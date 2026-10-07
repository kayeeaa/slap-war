/* Feature flags: try new features with chosen users before everyone gets them.
   A feature is a short id (e.g. 'pet-races') with a rollout:
     'off'      nobody has it (a kill switch: the chosen list is kept, so switching back to 'chosen' restores it)
     'chosen'   only the users listed in feature_users
     'everyone' every user
   The app gets the signed-in user's features as profile.features (a text array, from my_profile and every RPC
   that returns the profile) and checks them with featureOn("pet-races") in app.js.
   An RPC that must be gated on the server too checks private.has_feature(me, 'pet-races').

   Flags are only managed from the Supabase SQL Editor: there are no policies, so the app can't read or change
   the tables directly. See docs/voxie/FEATURES.md for the SQL to run. */

create table public.features (
  id text primary key check (id ~ '^[a-z0-9][a-z0-9-]{1,39}$'),
  description text not null default '',
  rollout text not null default 'chosen' check (rollout in ('off', 'chosen', 'everyone')),
  created_at timestamptz not null default now()
);

create table public.feature_users (
  feature_id text not null references public.features (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (feature_id, user_id)
);
create index feature_users_user on public.feature_users (user_id);

alter table public.features enable row level security;
alter table public.feature_users enable row level security;
revoke all on public.features, public.feature_users from anon, authenticated;
grant all on public.features, public.feature_users to service_role;

/* ---------- Checks ---------- */
create or replace function private.features_for(p_user_id uuid) returns text[]
language sql stable set search_path = '' as $$
  select coalesce(array_agg(f.id order by f.id), '{}')
  from public.features f
  where f.rollout = 'everyone'
     or (f.rollout = 'chosen' and exists (
           select 1 from public.feature_users fu where fu.feature_id = f.id and fu.user_id = p_user_id))
$$;

create or replace function private.has_feature(p_user_id uuid, p_feature_id text) returns boolean
language sql stable set search_path = '' as $$
  select p_feature_id = any (private.features_for(p_user_id))
$$;

/* ---------- The profile the app sees gets a features column ----------
   Same view as before with features added at the end (a view can only gain columns at the end).
   my_profile is "select *", which Postgres fixes at creation, so it's recreated to pick the new column up. */
create or replace view private.app_profiles as
select p.id, p.role, p.display_name, p.username, p.birth_month, p.birth_year,
  coalesce(b.theme_colour, p.theme_colour) as theme_colour,
  p.location, p.active_buddy_id, p.equipped_items, p.timed_missions, p.reset_streak_on_miss, p.chance_features,
  p.child_can_change_settings, p.setup_complete, p.highest_level_reached, p.plan,
  b.pet_type, coalesce(b.pet_name, '') as pet_name, coalesce(b.pet_look, '{}'::jsonb) as pet_look,
  case when p.role = 'child' then array(
    select parent.display_name from public.family_links fl join public.profiles parent on parent.id = fl.parent_id
    where fl.child_id = p.id order by fl.linked_on, parent.display_name) end as grown_up_names,
  -- Written out rather than calling private.features_for, because the app may not run private functions
  -- (a view reads tables as its owner but runs functions as whoever is signed in). Keep the two the same.
  array(select f.id from public.features f
        where f.rollout = 'everyone'
           or (f.rollout = 'chosen' and exists (
                 select 1 from public.feature_users fu where fu.feature_id = f.id and fu.user_id = p.id))
        order by f.id) as features
from public.profiles p
left join public.buddies b on b.id = p.active_buddy_id;

create or replace view public.my_profile as
select * from private.app_profiles where id = auth.uid();
revoke all on public.my_profile from anon, authenticated;
grant select on public.my_profile to authenticated;

/* ---------- SQL Editor helpers ----------
   A user is named by their log-in: a child's username or a grown-up's email.
     select private.add_feature('pet-races', 'Race your buddy against friends');
     select private.turn_feature_on_for('pet-races', 'kaytest');
     select private.turn_feature_on_for('pet-races', 'grown-up@example.com', true);   -- and all their children
     select private.turn_feature_off_for('pet-races', 'kaytest');
     select private.set_feature_rollout('pet-races', 'everyone');
     select * from private.feature_report;  */
create or replace function private.user_id_for_login(p_login text) returns uuid
language plpgsql stable security definer set search_path = '' as $$
declare found uuid;
begin
  select id into found from public.profiles where username = lower(btrim(p_login));
  if found is null then
    select id into found from auth.users where lower(email) = lower(btrim(p_login));
  end if;
  if found is null then raise exception 'No user with username or email %', p_login; end if;
  return found;
end $$;

create or replace function private.add_feature(p_feature_id text, p_description text default '') returns void
language sql set search_path = '' as $$
  insert into public.features (id, description) values (p_feature_id, coalesce(p_description, ''))
  on conflict (id) do update set description = excluded.description
$$;

create or replace function private.turn_feature_on_for(p_feature_id text, p_login text, p_with_children boolean default false)
returns int
language plpgsql set search_path = '' as $$
declare who uuid := private.user_id_for_login(p_login); added int;
begin
  if not exists (select 1 from public.features where id = p_feature_id) then
    raise exception 'No feature %: add it with private.add_feature first', p_feature_id;
  end if;
  insert into public.feature_users (feature_id, user_id)
  select p_feature_id, user_id from (
    select who as user_id
    union select fl.child_id from public.family_links fl where p_with_children and fl.parent_id = who
  ) people
  on conflict do nothing;
  get diagnostics added = row_count;
  return added;   -- how many users were newly given it
end $$;

create or replace function private.turn_feature_off_for(p_feature_id text, p_login text, p_with_children boolean default false)
returns int
language plpgsql set search_path = '' as $$
declare who uuid := private.user_id_for_login(p_login); removed int;
begin
  delete from public.feature_users fu
  where fu.feature_id = p_feature_id
    and (fu.user_id = who or (p_with_children and fu.user_id in (select child_id from public.family_links where parent_id = who)));
  get diagnostics removed = row_count;
  return removed;
end $$;

create or replace function private.set_feature_rollout(p_feature_id text, p_rollout text) returns void
language plpgsql set search_path = '' as $$
begin
  update public.features set rollout = p_rollout where id = p_feature_id;
  if not found then raise exception 'No feature %', p_feature_id; end if;
end $$;

-- Every feature, its rollout and who has it (username for children, email for grown-ups).
create or replace view private.feature_report as
select f.id, f.rollout, f.description,
  coalesce(array_agg(coalesce(p.username, u.email) order by p.role, coalesce(p.username, u.email))
           filter (where fu.user_id is not null), '{}') as chosen_users
from public.features f
left join public.feature_users fu on fu.feature_id = f.id
left join public.profiles p on p.id = fu.user_id
left join auth.users u on u.id = fu.user_id
group by f.id, f.rollout, f.description
order by f.id;

-- Only the SQL Editor (postgres) runs these. has_feature is for SECURITY DEFINER RPCs, which run as postgres.
revoke execute on function private.features_for(uuid), private.has_feature(uuid, text), private.user_id_for_login(text),
  private.add_feature(text, text), private.turn_feature_on_for(text, text, boolean),
  private.turn_feature_off_for(text, text, boolean), private.set_feature_rollout(text, text)
from public, anon, authenticated;
revoke all on private.feature_report from public, anon, authenticated;
