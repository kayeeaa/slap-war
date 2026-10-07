/* Every buddy has its own stuff, and its own shuffled unlocks. Run after 20261007120000_voxie_games_for_everyone.sql.

   - Each buddy keeps its own XP, items (level unlocks, Shop buys, Mystery box and Take a chance wins), item XP,
     item colours, gear in use, place and house. A new buddy (setup or rebirth) starts from scratch; switching back
     to a buddy picks up where that buddy left off.
   - Each buddy unlocks things in its own order: level-up items, places and looks (body colours, faces, arm poses,
     body shapes) are dealt out at random when the buddy is made. Anything at level 1 stays at level 1 (the starting
     looks and Home); everything above that swaps levels with other things of the same kind, so there's still
     something new at the same levels, just not the same thing.
   - Each buddy's Shop stocks about two thirds of the Shop items, picked at random.
   - Existing players: everything they have now goes to the buddy they're playing, and that buddy keeps the usual
     unlock order and a full Shop, so nothing in front of them changes. Their other buddies start empty, shuffled.
   - Daily limits stay per child: 3 missions, 3 Mystery boxes, one Treasure a week, 10 XP a day from each game.
   - Milestone boxes are claimed by the buddy that reached the level, while you're playing it.
   Everything still works through the same RPCs with the same arguments and return shapes. */

/* ---------- 1. Place, gear and best level move onto the buddy ---------- */
alter table public.buddies
  add column location text not null default 'home',
  add column equipped_items text[] not null default '{}',
  add column highest_level_reached int not null default 1 check (highest_level_reached >= 1);

-- The buddy each child is playing gets what they have now.
update public.buddies b set location = p.location, equipped_items = p.equipped_items,
  highest_level_reached = greatest(1, p.highest_level_reached)
from public.profiles p where p.active_buddy_id = b.id;
-- Every buddy has reached at least the level its own tasks give it.
update public.buddies b set highest_level_reached = greatest(b.highest_level_reached,
  coalesce((select private.calculate_level(bp.points) from private.buddy_points(b.child_id) bp where bp.buddy_id = b.id), 1));

/* ---------- 2. Item and XP rows belong to a buddy ---------- */
alter table public.item_xp add column buddy_id uuid references public.buddies (id) on delete cascade;
alter table public.item_colours add column buddy_id uuid references public.buddies (id) on delete cascade;
alter table public.purchases add column buddy_id uuid references public.buddies (id) on delete cascade;
alter table public.chance_rolls add column buddy_id uuid references public.buddies (id) on delete cascade;
alter table public.mission_completions add column buddy_id uuid references public.buddies (id) on delete cascade;
alter table public.game_results add column buddy_id uuid references public.buddies (id) on delete cascade;

-- Existing rows go to the buddy each child is playing.
update public.item_xp t set buddy_id = p.active_buddy_id from public.profiles p where p.id = t.child_id;
update public.item_colours t set buddy_id = p.active_buddy_id from public.profiles p where p.id = t.child_id;
update public.purchases t set buddy_id = p.active_buddy_id from public.profiles p where p.id = t.child_id;
update public.chance_rolls t set buddy_id = p.active_buddy_id from public.profiles p where p.id = t.child_id;
update public.mission_completions t set buddy_id = p.active_buddy_id from public.profiles p where p.id = t.child_id;
update public.game_results t set buddy_id = p.active_buddy_id from public.profiles p where p.id = t.child_id;

-- Item XP and colours are looked up by buddy, so every row needs one (a child with no buddy can't have any).
delete from public.item_xp where buddy_id is null;
delete from public.item_colours where buddy_id is null;
alter table public.item_xp alter column buddy_id set not null;
alter table public.item_colours alter column buddy_id set not null;
alter table public.item_xp drop constraint item_xp_pkey, add primary key (buddy_id, item_id);
alter table public.item_colours drop constraint item_colours_pkey, add primary key (buddy_id, item_id);
alter table public.purchases drop constraint purchases_child_id_item_id_key,
  add constraint purchases_one_per_buddy unique (buddy_id, item_id);   -- "already-owned"
drop index public.chance_rolls_one_gamble_per_item;
create unique index chance_rolls_one_gamble_per_item on public.chance_rolls (buddy_id, risked_item_id) where kind = 'gamble';
create index purchases_buddy on public.purchases (buddy_id);
create index chance_rolls_buddy on public.chance_rolls (buddy_id);
create index mission_completions_buddy on public.mission_completions (buddy_id);
create index game_results_buddy on public.game_results (buddy_id);

/* New rows go to the playing buddy unless the RPC says otherwise. */
create or replace function private.fill_buddy_id() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.buddy_id is null then select active_buddy_id into new.buddy_id from public.profiles where id = new.child_id; end if;
  return new;
end $$;
do $$
declare table_name text;
begin
  foreach table_name in array array['item_xp', 'item_colours', 'purchases', 'chance_rolls', 'mission_completions', 'game_results'] loop
    execute format('drop trigger if exists fill_buddy_id on public.%I', table_name);
    execute format('create trigger fill_buddy_id before insert on public.%I for each row execute function private.fill_buddy_id()', table_name);
  end loop;
end $$;

/* ---------- 3. Each buddy's own unlock order and Shop ---------- */
/* Places and looks the server deals out (items are in item_catalogue). Filled by scripts/voxie-sync-catalogue.js;
   these are the levels in the content files today. */
create table public.option_catalogue (
  kind text not null check (kind in ('location', 'body-colour', 'face', 'arms', 'width', 'height')),
  id text not null,
  unlock_level int not null check (unlock_level >= 1),
  primary key (kind, id)
);
insert into public.option_catalogue (kind, id, unlock_level) values
  ('location', 'beach', 9), ('location', 'castle', 52), ('location', 'coral-reef', 38), ('location', 'crystal-caves', 90),
  ('location', 'desert', 26), ('location', 'forest', 20), ('location', 'frozen-lake', 32), ('location', 'galaxy', 100),
  ('location', 'home', 1), ('location', 'moon-base', 60), ('location', 'mountains', 6), ('location', 'pixel-arena', 15),
  ('location', 'sky-islands', 70), ('location', 'spooky-woods', 80), ('location', 'volcano', 45),
  ('body-colour', 'original', 1), ('body-colour', 'mint', 1), ('body-colour', 'lilac', 5), ('body-colour', 'golden', 8),
  ('body-colour', 'midnight', 11), ('body-colour', 'snow', 14),
  ('face', 'happy', 1), ('face', 'grin', 1), ('face', 'surprised', 4), ('face', 'sleepy', 6), ('face', 'cheeky', 9), ('face', 'determined', 12),
  ('arms', 'down', 1), ('arms', 'wave', 1), ('arms', 'cheer', 5), ('arms', 'wide', 10),
  ('width', 'normal', 1), ('width', 'chunky', 2), ('width', 'slim', 7), ('width', 'extra-chunky', 13),
  ('height', 'normal', 1), ('height', 'tall', 3), ('height', 'short', 10), ('height', 'extra-tall', 14)
on conflict (kind, id) do update set unlock_level = excluded.unlock_level;

/* The level each item, place and look unlocks at for one buddy. Anything added to the game after the buddy was made
   has no row here and unlocks at its usual level. */
create table public.buddy_unlocks (
  buddy_id uuid not null references public.buddies (id) on delete cascade,
  kind text not null check (kind in ('item', 'location', 'body-colour', 'face', 'arms', 'width', 'height')),
  option_id text not null,
  unlock_level int not null check (unlock_level >= 1),
  primary key (buddy_id, kind, option_id)
);
/* Which Shop items this buddy's Shop sells. A Shop item added after the buddy was made has no row and is in stock. */
create table public.buddy_shop (
  buddy_id uuid not null references public.buddies (id) on delete cascade,
  item_id text not null,
  in_stock boolean not null,
  primary key (buddy_id, item_id)
);

alter table public.option_catalogue enable row level security;
alter table public.buddy_unlocks enable row level security;
alter table public.buddy_shop enable row level security;
create policy "signed-in users read the option catalogue" on public.option_catalogue for select to authenticated using (true);
create policy "read own or linked child buddy unlocks" on public.buddy_unlocks for select to authenticated
  using (exists (select 1 from public.buddies b where b.id = buddy_id and private.can_see_child(b.child_id)));
create policy "read own or linked child buddy shop" on public.buddy_shop for select to authenticated
  using (exists (select 1 from public.buddies b where b.id = buddy_id and private.can_see_child(b.child_id)));
revoke all on public.option_catalogue, public.buddy_unlocks, public.buddy_shop from anon, authenticated;
grant select on public.option_catalogue, public.buddy_unlocks, public.buddy_shop to authenticated;
grant all on public.option_catalogue, public.buddy_unlocks, public.buddy_shop to service_role;

/* Deals out one buddy's unlocks and Shop. p_shuffle false keeps the usual order and a full Shop. */
create or replace function private.deal_buddy_unlocks(p_buddy_id uuid, p_shuffle boolean) returns void
language plpgsql security definer set search_path = '' as $$
begin
  with options as (
    select 'item' as kind, id, unlock_level from public.item_catalogue where unlock_level is not null
    union all
    select kind, id, unlock_level from public.option_catalogue
  ), above_one as (
    select * from options where unlock_level > 1
  ), picked as (
    -- each kind's things in a random order (or the usual order)…
    select kind, id, row_number() over (partition by kind order by case when p_shuffle then random() end, unlock_level, id) as position
    from above_one
  ), levels as (
    -- …take that kind's levels, lowest first
    select kind, unlock_level, row_number() over (partition by kind order by unlock_level, id) as position from above_one
  )
  insert into public.buddy_unlocks (buddy_id, kind, option_id, unlock_level)
  select p_buddy_id, kind, id, unlock_level from options where unlock_level <= 1
  union all
  select p_buddy_id, picked.kind, picked.id, levels.unlock_level from picked join levels using (kind, position)
  on conflict (buddy_id, kind, option_id) do nothing;

  insert into public.buddy_shop (buddy_id, item_id, in_stock)
  select p_buddy_id, id, not p_shuffle or position <= ceil(total * 2 / 3.0)
  from (select id, row_number() over (order by random()) as position, count(*) over () as total
        from public.item_catalogue where xp_price is not null) shop
  on conflict (buddy_id, item_id) do nothing;
end $$;

-- A new buddy (setup or rebirth) gets its own shuffled unlocks and Shop.
create or replace function private.deal_new_buddy() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  perform private.deal_buddy_unlocks(new.id, true);
  return new;
end $$;
drop trigger if exists deal_new_buddy on public.buddies;
create trigger deal_new_buddy after insert on public.buddies for each row execute function private.deal_new_buddy();

-- Existing buddies: the one each child is playing keeps the usual order and a full Shop; the others are shuffled.
select private.deal_buddy_unlocks(b.id, not exists (select 1 from public.profiles p where p.active_buddy_id = b.id))
from public.buddies b;

/* ---------- 4. Helpers now look at the playing buddy ---------- */
create or replace function private.active_buddy(p_child_id uuid) returns uuid
language sql stable set search_path = '' as $$ select active_buddy_id from public.profiles where id = p_child_id $$;

-- The level this item unlocks at for this buddy (null if it isn't a level unlock).
create or replace function private.unlock_level_for(p_buddy_id uuid, p_item_id text) returns int
language sql stable set search_path = '' as $$
  select coalesce(
    (select unlock_level from public.buddy_unlocks where buddy_id = p_buddy_id and kind = 'item' and option_id = p_item_id),
    (select unlock_level from public.item_catalogue where id = p_item_id))
$$;

-- Does this buddy's Shop sell this item?
create or replace function private.in_buddy_shop(p_buddy_id uuid, p_item_id text) returns boolean
language sql stable set search_path = '' as $$
  select coalesce((select in_stock from public.buddy_shop where buddy_id = p_buddy_id and item_id = p_item_id), true)
$$;

-- The playing buddy's highest level ever (stored, so un-ticking never takes unlocks away).
create or replace function private.best_level(p_child_id uuid) returns int
language sql stable set search_path = '' as $$
  select greatest(1,
    coalesce((select b.highest_level_reached from public.buddies b where b.id = private.active_buddy(p_child_id)), 1),
    private.active_level(p_child_id))
$$;

create or replace function private.record_highest_level(p_child_id uuid) returns void
language sql set search_path = '' as $$
  update public.buddies set highest_level_reached = private.best_level(p_child_id) where id = private.active_buddy(p_child_id)
$$;

/* XP to spend = what the playing buddy earned (missions and games) - what it spent on items and in the Shop. */
create or replace function private.xp_earned(p_child_id uuid) returns int
language sql stable set search_path = '' as $$
  select (coalesce((select sum(xp_awarded) from public.mission_completions where child_id = p_child_id and buddy_id = private.active_buddy(p_child_id)), 0)
        + coalesce((select sum(xp_awarded) from public.game_results where child_id = p_child_id and buddy_id = private.active_buddy(p_child_id)), 0))::int
$$;
create or replace function private.xp_spent_on_items(p_child_id uuid) returns int
language sql stable set search_path = '' as $$
  select coalesce(sum(xp), 0)::int from public.item_xp where child_id = p_child_id and buddy_id = private.active_buddy(p_child_id)
$$;
create or replace function private.xp_spent_in_shop(p_child_id uuid) returns int
language sql stable set search_path = '' as $$
  select (coalesce((select sum(price_paid) from public.purchases where child_id = p_child_id and buddy_id = private.active_buddy(p_child_id)), 0)
        + coalesce((select sum(xp_paid - xp_refunded) from public.chance_rolls where child_id = p_child_id and buddy_id = private.active_buddy(p_child_id)), 0))::int
$$;

/* Powers from the items the playing buddy has in use, with that buddy's item XP. */
create or replace function private.active_powers(p_child_id uuid) returns jsonb
language sql stable set search_path = '' as $$
  with buddy as (
    select id, equipped_items from public.buddies where id = private.active_buddy(p_child_id)
  ), equipped as (
    select distinct unnest(equipped_items) as item_id from buddy
  ), tiers as (
    select item.id as item_id, ability.tier, ability.power_id,
           case ability.tier when 'advanced' then 60 else 200 end as xp_needed
    from public.item_catalogue item
    join equipped on equipped.item_id = item.id
    cross join lateral jsonb_each_text(item.abilities) as ability (tier, power_id)
    where item.category <> 'house' and ability.tier in ('advanced', 'master')
  ), switched_on as (
    select tiers.power_id, case tiers.tier when 'advanced' then power.advanced_value else power.master_value end as value
    from tiers
    join public.power_catalogue power on power.id = tiers.power_id
    left join public.item_xp xp on xp.buddy_id = (select id from buddy) and xp.item_id = tiers.item_id
    where coalesce(xp.xp, 0) >= tiers.xp_needed
  )
  select coalesce(jsonb_object_agg(power_id, value), '{}'::jsonb)
  from (select power_id, max(value) as value from switched_on group by power_id) strongest
$$;

/* The playing buddy's items: level unlocks up to its best level in its own order (minus anything swapped away by
   Take a chance), its Shop buys, and anything it won by chance. */
create or replace function private.owned_item_ids(p_child_id uuid) returns setof text
language sql stable set search_path = '' as $$
  with me as (select private.active_buddy(p_child_id) as buddy_id, private.best_level(p_child_id) as level)
  select won_item_id from public.chance_rolls, me where chance_rolls.child_id = p_child_id and chance_rolls.buddy_id = me.buddy_id and won_item_id is not null
  union
  select item_id from public.purchases, me where purchases.child_id = p_child_id and purchases.buddy_id = me.buddy_id
  union
  select item.id from public.item_catalogue item
  cross join me
  left join public.buddy_unlocks dealt on dealt.buddy_id = me.buddy_id and dealt.kind = 'item' and dealt.option_id = item.id
  where item.unlock_level is not null and coalesce(dealt.unlock_level, item.unlock_level) <= me.level
    and item.id not in (select risked_item_id from public.chance_rolls
                        where child_id = p_child_id and buddy_id = me.buddy_id and kind = 'gamble' and outcome in ('rarer', 'common'))
$$;

-- gotAtLevelFor(): lowest of the item's unlock level (for this buddy), its Shop got_at_level and any chance won_at_level.
create or replace function private.got_at_level(p_child_id uuid, p_item_id text) returns int
language sql stable set search_path = '' as $$
  select least(
    private.unlock_level_for(private.active_buddy(p_child_id), p_item_id),
    (select min(got_at_level) from public.purchases where child_id = p_child_id and buddy_id = private.active_buddy(p_child_id) and item_id = p_item_id),
    (select min(won_at_level) from public.chance_rolls where child_id = p_child_id and buddy_id = private.active_buddy(p_child_id) and won_item_id = p_item_id))
$$;

create or replace function private.item_colours_for(p_child_id uuid) returns jsonb
language sql stable set search_path = '' as $$
  select coalesce(jsonb_object_agg(item_id, colour_id), '{}'::jsonb) from public.item_colours
  where child_id = p_child_id and buddy_id = private.active_buddy(p_child_id)
$$;

/* The profile the app sees: place, gear and best level now come from the playing buddy. Same columns, same order. */
create or replace view private.app_profiles as
select p.id, p.role, p.display_name, p.username, p.birth_month, p.birth_year,
  coalesce(b.theme_colour, p.theme_colour) as theme_colour,
  coalesce(b.location, p.location) as location, p.active_buddy_id, coalesce(b.equipped_items, p.equipped_items) as equipped_items,
  p.timed_missions, p.reset_streak_on_miss, p.chance_features,
  p.child_can_change_settings, p.setup_complete, coalesce(b.highest_level_reached, p.highest_level_reached) as highest_level_reached, p.plan,
  b.pet_type, coalesce(b.pet_name, '') as pet_name, coalesce(b.pet_look, '{}'::jsonb) as pet_look,
  case when p.role = 'child' then array(
    select parent.display_name from public.family_links fl join public.profiles parent on parent.id = fl.parent_id
    where fl.child_id = p.id order by fl.linked_on, parent.display_name) end as grown_up_names,
  array(select f.id from public.features f
        where f.rollout = 'everyone'
           or (f.rollout = 'chosen' and exists (
                 select 1 from public.feature_users fu where fu.feature_id = f.id and fu.user_id = p.id))
        order by f.id) as features
from public.profiles p
left join public.buddies b on b.id = p.active_buddy_id;

/* ---------- 5. RPCs that save to the buddy ---------- */
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
    insert into public.buddies (child_id, pet_type, pet_name, pet_look, theme_colour, location, adopted_on)
    values (me, new_pet_type, new_pet_name, new_pet_look, new_theme, new_location, private.today_uk()) returning id into buddy_id;
  else
    update public.buddies set pet_type = new_pet_type, pet_name = new_pet_name, pet_look = new_pet_look, theme_colour = new_theme,
      location = new_location
    where id = buddy_id;
  end if;
  update public.profiles set display_name = new_display_name, active_buddy_id = buddy_id, setup_complete = true where id = me;
  return private.app_profile(me);
end $$;

-- updateMyProfile(look): the game name on the child; place, pet look and colour on the playing buddy.
create or replace function public.update_my_profile(p_look jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child();
begin
  update public.profiles set display_name = private.clean_text(p_look ->> 'displayName', 20, 'bad-name') where id = me;
  update public.buddies set
    location = private.clean_id(p_look ->> 'location', 'bad-look'),
    pet_look = private.clean_pet_look(p_look -> 'petLook'),
    theme_colour = private.clean_id(p_look ->> 'themeColour', 'bad-look')
  where id = private.active_buddy(me);
  return private.app_profile(me);
end $$;

-- updateEquippedItems(itemIds): only items the playing buddy owns. "not-owned". Returns the profile.
create or replace function public.update_equipped_items(p_item_ids text[]) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child(); cleaned text[];
begin
  cleaned := array(select distinct unnest(coalesce(p_item_ids, '{}')));
  if cardinality(cleaned) > 100 then raise exception 'not-owned'; end if;
  if exists (select 1 from unnest(cleaned) as item_id
             where item_id not in (select owned_id from private.owned_item_ids(me) as owned_id))
    then raise exception 'not-owned'; end if;
  update public.buddies set equipped_items = cleaned where id = private.active_buddy(me);
  return private.app_profile(me);
end $$;

create or replace function public.add_xp_to_item(p_item_id text, p_amount int) returns int
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child(); buddy uuid := private.active_buddy(me); new_total int;
begin
  if p_amount is null or p_amount < 1 then raise exception 'bad-amount'; end if;
  if not exists (select 1 from public.item_catalogue where id = p_item_id and category <> 'house')
     or not private.owns_item(me, p_item_id) then raise exception 'not-owned'; end if;
  if p_amount > private.xp_to_spend(me) then raise exception 'not-enough-xp'; end if;
  insert into public.item_xp (child_id, buddy_id, item_id, xp) values (me, buddy, p_item_id, p_amount)
  on conflict (buddy_id, item_id) do update set xp = public.item_xp.xp + excluded.xp
  returning xp into new_total;
  return new_total;
end $$;

create or replace function public.set_item_colour(p_item_id text, p_colour_id text) returns void
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child(); buddy uuid := private.active_buddy(me); item public.item_catalogue; got_level int; unlock_level int;
begin
  select * into item from public.item_catalogue where id = p_item_id;
  if item.id is null or not private.owns_item(me, p_item_id) then raise exception 'not-owned'; end if;
  if p_colour_id is null or p_colour_id not in ('original','red','orange','yellow','green','teal','blue','purple','pink')
    then raise exception 'unknown-colour'; end if;
  got_level := private.got_at_level(me, p_item_id);
  unlock_level := got_level + 10 + (case item.rarity when 'rare' then 5 when 'ultra' then 10 when 'insane' then 20 else 0 end) + got_level / 10;
  if got_level is null or private.best_level(me) < unlock_level then raise exception 'locked'; end if;
  delete from public.item_colours where buddy_id = buddy and item_id = p_item_id;
  if p_colour_id <> 'original' then
    insert into public.item_colours (child_id, buddy_id, item_id, colour_id) values (me, buddy, p_item_id, p_colour_id);
  end if;
end $$;

-- buyItem(itemId): only what this buddy's Shop sells. "not-for-sale" / "already-owned" / "not-enough-xp". Returns { pricePaid }.
create or replace function public.buy_item(p_item_id text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child(); buddy uuid := private.active_buddy(me); base_price int; price int;
begin
  select xp_price into base_price from public.item_catalogue where id = p_item_id;
  if base_price is null or not private.in_buddy_shop(buddy, p_item_id) then raise exception 'not-for-sale'; end if;
  if exists (select 1 from public.purchases where buddy_id = buddy and item_id = p_item_id) then raise exception 'already-owned'; end if;
  price := greatest(1, round(base_price * (1 - private.power_value(private.active_powers(me), 'bargain')))::int);
  if price > private.xp_to_spend(me) then raise exception 'not-enough-xp'; end if;
  insert into public.purchases (child_id, buddy_id, item_id, price_paid, bought_on, got_at_level)
  values (me, buddy, p_item_id, price, private.today_uk(), private.best_level(me));
  return jsonb_build_object('pricePaid', price);
end $$;

create or replace function public.keep_new_item(p_item_id text) returns void
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child();
begin
  insert into public.chance_rolls (child_id, buddy_id, kind, risked_item_id, outcome, xp_paid, rolled_on)
  values (me, private.active_buddy(me), 'gamble', p_item_id, 'declined', 0, private.today_uk())
  on conflict (buddy_id, risked_item_id) where kind = 'gamble' do nothing;
end $$;

/* claimMilestoneBox(buddyId, level): the playing buddy's own milestones. "not-reached" / "already-claimed" / "sold-out". */
create or replace function public.claim_milestone_box(p_buddy_id uuid, p_level int) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child(); today date := private.today_uk(); buddy_level int; prize record; xp_back int;
begin
  if p_buddy_id is distinct from private.active_buddy(me) then raise exception 'not-reached'; end if;
  select private.calculate_level(points) into buddy_level from private.buddy_points(me) where buddy_id = p_buddy_id;
  if buddy_level is null or p_level is null or p_level < 10 or p_level % 10 <> 0 or buddy_level < p_level then raise exception 'not-reached'; end if;
  if exists (select 1 from public.chance_rolls where child_id = me and kind = 'milestone' and milestone_buddy_id = p_buddy_id and milestone_level = p_level)
    then raise exception 'already-claimed'; end if;
  select * into prize from private.mystery_box_roll(me, private.power_value(private.active_powers(me), 'lucky'));
  if prize.item_id is null then raise exception 'sold-out'; end if;
  xp_back := case when prize.duplicate then private.duplicate_xp_back(prize.rarity) else 0 end;
  insert into public.chance_rolls (child_id, buddy_id, kind, milestone_buddy_id, milestone_level, outcome, won_item_id, chance, random_number,
                                   xp_paid, xp_refunded, rolled_on, won_at_level)
  values (me, p_buddy_id, 'milestone', p_buddy_id, p_level, case when prize.duplicate then 'duplicate' else 'won' end, prize.item_id, prize.chance,
          prize.random_number, 0, xp_back, today, private.best_level(me));
  return jsonb_build_object('wonItemId', prize.item_id, 'chance', prize.chance, 'duplicate', prize.duplicate, 'xpBack', xp_back);
end $$;

/* takeAChance(itemId): only on an item the playing buddy JUST unlocked (its unlock level for this buddy = the buddy's
   highest level), once per buddy. Everything else as before. */
create or replace function public.take_a_chance(p_item_id text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  me uuid := private.require_child();
  buddy uuid := private.active_buddy(me);
  item public.item_catalogue;
  win_chance numeric;
  rest_chance numeric;
  outcome_roll double precision := random();
  prize_roll double precision := random();
  outcome text;
  outcome_chance numeric;
  prize_ids text[] := '{}';
  next_rarity text;
  prize record;
  prize_item_id text;
  final_outcome text;
  final_chance numeric;
begin
  if not (select chance_features from public.profiles where id = me) then raise exception 'chance-off'; end if;
  select * into item from public.item_catalogue where id = p_item_id;
  if item.id is null or item.unlock_level is null then raise exception 'cannot-take-a-chance'; end if;
  if not private.owns_item(me, p_item_id) then raise exception 'not-owned'; end if;
  if exists (select 1 from public.chance_rolls where buddy_id = buddy and kind = 'gamble' and risked_item_id = p_item_id) then raise exception 'already-tried'; end if;
  if private.unlock_level_for(buddy, p_item_id) <> private.best_level(me) then raise exception 'not-new'; end if;

  win_chance := coalesce(nullif(private.power_value(private.active_powers(me), 'daring'), 0), 1.0 / 3);
  rest_chance := (1 - win_chance) / 2;
  if outcome_roll < win_chance then outcome := 'rarer'; outcome_chance := win_chance;
  elsif outcome_roll < win_chance + rest_chance then outcome := 'keep'; outcome_chance := rest_chance;
  else outcome := 'common'; outcome_chance := rest_chance; end if;

  if outcome = 'rarer' then
    foreach next_rarity in array (array['common','rare','ultra','insane'])[array_position(array['common','rare','ultra','insane'], item.rarity) + 1 :] loop
      prize_ids := array(select c.id from public.item_catalogue c
                         where c.rarity = next_rarity and c.xp_price is null and not private.owns_item(me, c.id));
      exit when cardinality(prize_ids) > 0;
    end loop;
  elsif outcome = 'common' then
    prize_ids := array(select c.id from public.item_catalogue c
                       where c.rarity = 'common' and c.id <> item.id and c.xp_price is null and not private.owns_item(me, c.id));
  end if;

  if outcome <> 'keep' and cardinality(prize_ids) > 0 then
    select * into prize from private.pick_weighted(prize_ids, prize_roll);
    prize_item_id := prize.item_id;
    final_outcome := outcome;
    final_chance := outcome_chance * prize.chance;
  else
    final_outcome := 'keep';
    final_chance := 1.0 / 3;
  end if;

  insert into public.chance_rolls (child_id, buddy_id, kind, risked_item_id, outcome, won_item_id, chance, random_number, xp_paid, rolled_on, won_at_level)
  values (me, buddy, 'gamble', p_item_id, final_outcome, prize_item_id, final_chance, outcome_roll, 0,
          private.today_uk(), case when final_outcome <> 'keep' then private.best_level(me) end);
  if final_outcome <> 'keep' then
    update public.buddies set equipped_items = array_remove(equipped_items, p_item_id) where id = buddy;
  end if;
  return jsonb_build_object('outcome', final_outcome, 'wonItemId', prize_item_id,
                            'chance', final_chance, 'profile', private.app_profile(me));
end $$;

/* ---------- 6. Who can run what ---------- */
revoke execute on function private.fill_buddy_id(), private.deal_buddy_unlocks(uuid, boolean), private.deal_new_buddy(),
  private.active_buddy(uuid), private.unlock_level_for(uuid, text), private.in_buddy_shop(uuid, text)
from public, anon, authenticated;

notify pgrst, 'reload schema';
