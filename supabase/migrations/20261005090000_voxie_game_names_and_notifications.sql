/* Game names (the name friends see) and grown-up notifications.

   - A child's game name starts as the username their grown-up set. They can change it (at setup or in Settings).
   - Every child's game name is unique, and can't be another child's username either, so friend search never shows
     two children with the same name. A new username can't be another child's game name ("username-taken").
     Compared ignoring capitals: "Sky" and "sky" count as the same.
   - Game names can now be up to 20 characters, the same as usernames.
   - When a child's game name changes, each of their grown-ups gets a notification (parent_notifications), shown as a
     pop-up next time they open their account.
   Backwards compatible: no RPC changes its arguments or return shape. */

/* ---------- 1. Every child gets their username as their game name until they pick one ---------- */
update public.profiles set display_name = username where role = 'child' and display_name = '';

/* ---------- 2. Unique game names ---------- */
create unique index profiles_unique_child_game_name on public.profiles (lower(display_name))
  where role = 'child' and display_name <> '';

/* Is this game name free for this child? Not another child's game name or username. */
create or replace function private.game_name_is_free(p_name text, p_child_id uuid) returns boolean
language sql stable set search_path = '' as $$
  select not exists (
    select 1 from public.profiles other
    where other.role = 'child' and other.id <> p_child_id
      and (lower(other.display_name) = lower(btrim(p_name)) or other.username = lower(btrim(p_name))))
$$;

/* Checks every write to a child's names. A new child (insert) whose username clashes gets "username-taken";
   changing a game name to a taken one gets "name-taken". */
create or replace function private.check_child_names() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.role <> 'child' then return new; end if;
  if tg_op = 'INSERT' then
    if not private.game_name_is_free(new.username, new.id)
       or (new.display_name <> '' and not private.game_name_is_free(new.display_name, new.id)) then
      raise exception 'username-taken';
    end if;
  elsif new.display_name is distinct from old.display_name and new.display_name <> ''
        and not private.game_name_is_free(new.display_name, new.id) then
    raise exception 'name-taken';
  end if;
  return new;
end $$;

drop trigger if exists check_child_names on public.profiles;
create trigger check_child_names before insert or update of display_name, username on public.profiles
  for each row execute function private.check_child_names();

-- isGameNameAvailable(name): for the setup and Settings screens, so a child hears "taken" before they save.
create or replace function public.is_game_name_available(p_name text) returns boolean
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child(false);
begin
  return char_length(btrim(coalesce(p_name, ''))) between 1 and 20 and private.game_name_is_free(p_name, me);
end $$;

/* ---------- 3. Game names up to 20 characters (same as usernames) ---------- */
create or replace function public.save_profile_setup(p_look jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  me uuid := private.require_child();
  buddy_id uuid;
  new_display_name text := private.clean_text(p_look ->> 'displayName', 20, 'bad-name');
  new_pet_type text := private.clean_id(p_look ->> 'petType', 'unknown-pet');
  new_pet_name text := private.clean_text(p_look ->> 'petName', 30, 'bad-name', true);
  new_theme text := private.clean_id(p_look ->> 'themeColour', 'bad-look');
  new_location text := private.clean_id(p_look ->> 'location', 'bad-look');
  new_pet_look jsonb := private.clean_pet_look(p_look -> 'petLook');
begin
  select active_buddy_id into buddy_id from public.profiles where id = me;
  if buddy_id is null then
    insert into public.buddies (child_id, pet_type, pet_name, pet_look, theme_colour, adopted_on)
    values (me, new_pet_type, new_pet_name, new_pet_look, new_theme, private.today_uk()) returning id into buddy_id;
  else
    update public.buddies set pet_type = new_pet_type, pet_name = new_pet_name, pet_look = new_pet_look, theme_colour = new_theme
    where id = buddy_id;
  end if;
  update public.profiles set display_name = new_display_name, location = new_location, active_buddy_id = buddy_id, setup_complete = true
  where id = me;
  return private.app_profile(me);
end $$;

create or replace function public.update_my_profile(p_look jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child();
begin
  update public.profiles set
    display_name = private.clean_text(p_look ->> 'displayName', 20, 'bad-name'),
    location = private.clean_id(p_look ->> 'location', 'bad-look')
  where id = me;
  update public.buddies set
    pet_look = private.clean_pet_look(p_look -> 'petLook'),
    theme_colour = private.clean_id(p_look ->> 'themeColour', 'bad-look')
  where id = (select active_buddy_id from public.profiles where id = me);
  return private.app_profile(me);
end $$;

/* A new child's game name starts as their username. */
create or replace function public.create_child_profile(p_parent_id uuid, p_child_id uuid, p_username text,
  p_birth_month int, p_birth_year int) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare age int; clean_username text := lower(btrim(coalesce(p_username, '')));
begin
  -- Lock the grown-up's profile so two add-child calls at once can't go past the limit.
  perform 1 from public.profiles where id = p_parent_id and role = 'parent' for update;
  if not found then raise exception 'not-a-parent'; end if;
  age := private.check_birth_month(p_birth_month, p_birth_year);
  if clean_username !~ '^[a-z0-9_-]{3,20}$' then raise exception 'bad-username'; end if;
  if (select count(*) from public.family_links where parent_id = p_parent_id) >= 8 then raise exception 'limit'; end if;
  begin
    insert into public.profiles (id, role, display_name, username, birth_month, birth_year, timed_missions)
    values (p_child_id, 'child', clean_username, clean_username, p_birth_month, p_birth_year, age >= 8);   -- TIMED_MISSIONS_FROM_AGE
  exception when unique_violation then raise exception 'username-taken';
  end;
  insert into public.family_links (parent_id, child_id, linked_on) values (p_parent_id, p_child_id, private.today_uk());
  return private.child_for_parent(p_child_id);
end $$;

/* ---------- 4. Notifications for grown-ups ---------- */
create table public.parent_notifications (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles (id) on delete cascade,
  child_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('game-name-changed')),
  old_name text,
  new_name text,
  created_at timestamptz not null default now(),
  seen_at timestamptz
);
create index parent_notifications_unseen on public.parent_notifications (parent_id) where seen_at is null;
alter table public.parent_notifications enable row level security;
create policy "grown-ups read their own notifications" on public.parent_notifications
  for select to authenticated using (parent_id = (select auth.uid()));
grant select on public.parent_notifications to authenticated, service_role;

/* When a child's game name changes, tell each of their grown-ups. Compares the name as shown (an empty game name
   shows as the username), so filling in the username as the starting game name doesn't count as a change. */
create or replace function private.notify_game_name_change() returns trigger
language plpgsql security definer set search_path = '' as $$
declare old_shown text := coalesce(nullif(old.display_name, ''), old.username);
        new_shown text := coalesce(nullif(new.display_name, ''), new.username);
begin
  if new.role = 'child' and old_shown is distinct from new_shown then
    insert into public.parent_notifications (parent_id, child_id, kind, old_name, new_name)
    select fl.parent_id, new.id, 'game-name-changed', old_shown, new_shown
    from public.family_links fl where fl.child_id = new.id;
  end if;
  return new;
end $$;

drop trigger if exists notify_game_name_change on public.profiles;
create trigger notify_game_name_change after update of display_name on public.profiles
  for each row execute function private.notify_game_name_change();

-- markNotificationsSeen(ids): the grown-up has seen these pop-ups.
create or replace function public.mark_notifications_seen(p_ids uuid[]) returns void
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_parent();
begin
  update public.parent_notifications set seen_at = now()
  where parent_id = me and id = any (coalesce(p_ids, '{}')) and seen_at is null;
end $$;

/* ---------- 5. Who can call what ---------- */
revoke execute on function private.game_name_is_free(text, uuid), private.check_child_names(),
  private.notify_game_name_change() from public, anon, authenticated;
revoke execute on function public.is_game_name_available(text), public.mark_notifications_seen(uuid[]) from public, anon;
grant execute on function public.is_game_name_available(text), public.mark_notifications_seen(uuid[]) to authenticated;
