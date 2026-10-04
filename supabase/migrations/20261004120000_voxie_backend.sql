/* ======================================================================
   Voxie backend — one migration for the Supabase SQL Editor.
   Replaces the fake data/dataLayer.js.

   HOW IT'S BUILT
   - Tables live in "public". The browser can only SELECT them, and RLS limits what it sees.
   - Every write goes through a SECURITY DEFINER function (RPC) in "public" that checks
     auth.uid(), the caller's role and the family link. RPC errors use the exact codes
     dataLayer.js throws (raise exception 'daily-limit' → error.message === "daily-limit").
   - Helper functions live in the "private" schema, which the API does not expose.
   - XP, prices, powers, chance, limits and age checks are all worked out here, never trusted
     from the app. "Today" is the date in Europe/London.
   - Game content stays in the JS files. The three *_catalogue tables hold the numbers the
     server needs, filled by your own script from the content files (service role).
   - RPC arguments are prefixed p_ so they never clash with column names:
       supabase.rpc("buy_item", { p_item_id: "crown" })
   ====================================================================== */

create schema if not exists private;
revoke all on schema private from public;

/* ---------------------------------------------------------------------
   1. TABLES
   --------------------------------------------------------------------- */

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('child', 'parent')),
  display_name text not null default '' check (char_length(display_name) <= 30),
  username text unique check (username ~ '^[a-z0-9_-]{3,20}$'),
  birth_month smallint check (birth_month between 1 and 12),
  birth_year smallint check (birth_year between 1900 and 2200),
  theme_colour text not null default 'green',
  location text not null default 'home',
  active_buddy_id uuid,
  equipped_items text[] not null default '{}',
  timed_missions boolean not null default true,
  reset_streak_on_miss boolean not null default true,
  chance_features boolean not null default true,
  child_can_change_settings boolean not null default true,
  setup_complete boolean not null default false,
  highest_level_reached int not null default 1 check (highest_level_reached >= 1),
  plan text not null default 'free' check (plan in ('free', 'paid')),
  created_at timestamptz not null default now(),
  -- Children have a username; grown-ups never do, and never have a birth month/year.
  constraint children_have_username check ((role = 'child') = (username is not null)),
  constraint parents_have_no_birth check (role = 'child' or (birth_month is null and birth_year is null)),
  constraint birth_month_and_year_together check ((birth_month is null) = (birth_year is null))
);

create table public.buddies (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.profiles (id) on delete cascade,
  pet_type text not null,
  pet_name text not null default '',
  pet_look jsonb not null default '{}' check (jsonb_typeof(pet_look) = 'object'),
  theme_colour text not null default 'green',
  adopted_on date not null,
  created_at timestamptz not null default now(),
  unique (child_id, pet_type)            -- "already-collected"
);
create index buddies_child_id on public.buddies (child_id);

alter table public.profiles
  add constraint profiles_active_buddy_fk foreign key (active_buddy_id) references public.buddies (id) on delete set null;

create table public.family_links (
  parent_id uuid not null references public.profiles (id) on delete cascade,
  child_id uuid not null references public.profiles (id) on delete cascade,
  linked_on date not null,
  primary key (parent_id, child_id)
);
create index family_links_child_id on public.family_links (child_id);

create table public.link_codes (
  child_id uuid primary key references public.profiles (id) on delete cascade,
  code text not null unique check (code ~ '^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$'),
  expires_at timestamptz not null
);

create table public.friend_requests (
  id uuid primary key default gen_random_uuid(),
  from_child_id uuid not null references public.profiles (id) on delete cascade,
  to_child_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'cancelled')),
  sent_on date not null,
  created_at timestamptz not null default now(),
  check (from_child_id <> to_child_id)
);
-- Only one waiting request between two children, whichever way round.
create unique index friend_requests_one_pending_per_pair on public.friend_requests
  (least(from_child_id, to_child_id), greatest(from_child_id, to_child_id)) where status = 'pending';
create index friend_requests_to_child on public.friend_requests (to_child_id, status);
create index friend_requests_from_child on public.friend_requests (from_child_id, status);

create table public.friendships (
  child_id uuid not null references public.profiles (id) on delete cascade,
  friend_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (child_id, friend_id),
  check (child_id <> friend_id)
);
create index friendships_friend_id on public.friendships (friend_id);

-- Set tasks. dataLayer has no "add chore" call: these are filled by hand (or a later feature);
-- grown-ups' tasks from the app go into scheduled_tasks with set_by = 'parent'.
create table public.chores (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index chores_child_id on public.chores (child_id) where active;

create table public.chore_completions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.profiles (id) on delete cascade,
  buddy_id uuid references public.buddies (id) on delete cascade,  -- set by the database, not the app
  chore_id uuid not null references public.chores (id) on delete cascade,
  completed_on date not null,
  created_at timestamptz not null default now(),
  unique (child_id, chore_id, completed_on)
);
create index chore_completions_child_day on public.chore_completions (child_id, completed_on);
create index chore_completions_buddy on public.chore_completions (buddy_id);

create table public.own_tasks (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  added_on date not null,
  done boolean not null default false,
  done_by_buddy_id uuid references public.buddies (id) on delete cascade,
  created_at timestamptz not null default now(),
  check (done or done_by_buddy_id is null)
);
create index own_tasks_child_day on public.own_tasks (child_id, added_on);
create index own_tasks_buddy on public.own_tasks (done_by_buddy_id) where done;

create table public.scheduled_tasks (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  days_of_week text[] not null check (
    cardinality(days_of_week) between 1 and 7
    and days_of_week <@ array['mon','tue','wed','thu','fri','sat','sun']),
  times_per_day smallint not null check (times_per_day between 1 and 4),
  active boolean not null default true,
  set_by text not null default 'child' check (set_by in ('child', 'parent')),
  created_at timestamptz not null default now()
);
create index scheduled_tasks_child_id on public.scheduled_tasks (child_id) where active;

create table public.scheduled_task_completions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.profiles (id) on delete cascade,
  buddy_id uuid references public.buddies (id) on delete cascade,
  scheduled_task_id uuid not null references public.scheduled_tasks (id) on delete cascade,
  occurrence smallint not null check (occurrence between 1 and 4),
  completed_on date not null,
  created_at timestamptz not null default now(),
  unique (scheduled_task_id, occurrence, completed_on)
);
create index scheduled_task_completions_child_day on public.scheduled_task_completions (child_id, completed_on);
create index scheduled_task_completions_buddy on public.scheduled_task_completions (buddy_id);

/* Item ids are text ids from the content files. There are deliberately NO foreign keys to the
   catalogue tables, so refilling a catalogue never breaks a child's history. */
create table public.item_xp (
  child_id uuid not null references public.profiles (id) on delete cascade,
  item_id text not null,
  xp int not null default 0 check (xp >= 0),
  primary key (child_id, item_id)
);

create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.profiles (id) on delete cascade,
  item_id text not null,
  price_paid int not null check (price_paid >= 1),
  bought_on date not null,
  got_at_level int not null,
  created_at timestamptz not null default now(),
  unique (child_id, item_id)              -- "already-owned"
);

create table public.chance_rolls (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('box', 'gamble', 'treasure', 'milestone')),
  milestone_buddy_id uuid references public.buddies (id) on delete cascade,
  milestone_level int,
  risked_item_id text,
  outcome text not null check (outcome in ('won', 'duplicate', 'rarer', 'keep', 'common', 'declined')),
  won_item_id text,
  chance numeric,                          -- the chance of what happened (shown to the child)
  random_number double precision,          -- the dice value used, so any "that's not fair!" can be checked
  xp_paid int not null default 0 check (xp_paid >= 0),
  xp_refunded int not null default 0 check (xp_refunded >= 0),
  won_at_level int,
  rolled_on date not null,
  created_at timestamptz not null default now(),
  check (kind <> 'milestone' or (milestone_buddy_id is not null and milestone_level is not null)),
  check (kind <> 'gamble' or risked_item_id is not null)
);
create index chance_rolls_child_kind_day on public.chance_rolls (child_id, kind, rolled_on);
-- One decision per unlocked item, one claim per buddy milestone.
create unique index chance_rolls_one_gamble_per_item on public.chance_rolls (child_id, risked_item_id) where kind = 'gamble';
create unique index chance_rolls_one_claim_per_milestone on public.chance_rolls (child_id, milestone_buddy_id, milestone_level) where kind = 'milestone';

create table public.item_colours (
  child_id uuid not null references public.profiles (id) on delete cascade,
  item_id text not null,
  colour_id text not null check (colour_id in ('red','orange','yellow','green','teal','blue','purple','pink')),
  primary key (child_id, item_id)
);

create table public.mission_completions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.profiles (id) on delete cascade,
  mission_id text not null,
  completed_on date not null,
  choice_index smallint,                   -- null = timed out, or a Feel good mission
  xp_awarded int not null check (xp_awarded >= 0),
  used_hint boolean not null default false,
  used_think_again boolean not null default false,
  did_it boolean not null default false,
  created_at timestamptz not null default now(),
  unique (child_id, mission_id, completed_on)
);
create index mission_completions_child_day on public.mission_completions (child_id, completed_on);

/* ---------- Catalogue tables (filled by your script from the content files) ---------- */
create table public.item_catalogue (
  id text primary key,
  category text not null,
  slot text,
  rarity text not null check (rarity in ('common', 'rare', 'ultra', 'insane')),
  unlock_level int,                        -- null = not a level unlock
  xp_price int check (xp_price >= 1),      -- null = not in the Shop (so it can be won by chance)
  chance_only boolean not null default false,
  chance_within_rarity numeric not null default 1 check (chance_within_rarity > 0),
  abilities jsonb not null default '{}' check (jsonb_typeof(abilities) = 'object')  -- {"advanced":"hint","master":"brain-boost"}
);

create table public.mission_catalogue (
  id text primary key,
  type text not null check (type in ('trivia', 'puzzle', 'scenario', 'challenge')),
  difficulty int not null check (difficulty between 1 and 5),
  min_age int not null,
  max_age int not null,
  correct_index int,                       -- trivia / puzzle
  good_choice_indexes int[],               -- scenario: the options with isGoodChoice
  check (min_age <= max_age)
);

create table public.power_catalogue (
  id text primary key,
  advanced_value numeric not null,
  master_value numeric not null
);

/* ---------------------------------------------------------------------
   2. ACCESS: the browser can only read, and only through RLS
   --------------------------------------------------------------------- */
revoke all on all tables in schema public from anon, authenticated;
grant select on all tables in schema public to authenticated;

-- RLS helper: may the signed-in user see this child's rows? (the child themself, or a linked grown-up)
create or replace function private.can_see_child(p_child_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select p_child_id = (select auth.uid())
      or exists (select 1 from public.family_links fl
                 where fl.parent_id = (select auth.uid()) and fl.child_id = p_child_id);
$$;
grant usage on schema private to authenticated;   -- needed so RLS can call can_see_child; private is NOT exposed by the API
revoke execute on function private.can_see_child(uuid) from public;
grant execute on function private.can_see_child(uuid) to authenticated;

do $$
declare table_name text;
begin
  foreach table_name in array array['profiles','buddies','family_links','link_codes','friend_requests','friendships',
    'chores','chore_completions','own_tasks','scheduled_tasks','scheduled_task_completions','item_xp','purchases',
    'chance_rolls','item_colours','mission_completions','item_catalogue','mission_catalogue','power_catalogue']
  loop
    execute format('alter table public.%I enable row level security', table_name);
  end loop;
end $$;

-- A child sees their own profile; a grown-up sees their own and their linked children's.
create policy "read own or linked child profile" on public.profiles
  for select to authenticated using (private.can_see_child(id));

-- Child-owned rows: the child, or a linked grown-up.
do $$
declare table_name text;
begin
  foreach table_name in array array['buddies','chores','chore_completions','own_tasks','scheduled_tasks',
    'scheduled_task_completions','item_xp','purchases','chance_rolls','item_colours','mission_completions']
  loop
    execute format('create policy "read own or linked child rows" on public.%I for select to authenticated using (private.can_see_child(child_id))', table_name);
  end loop;
end $$;

create policy "read own family links" on public.family_links
  for select to authenticated using (parent_id = (select auth.uid()) or private.can_see_child(child_id));

-- Invite codes: grown-ups only (never the child).
create policy "linked grown-ups read invite codes" on public.link_codes
  for select to authenticated using (child_id <> (select auth.uid()) and private.can_see_child(child_id));

-- Friends: the child only. Grown-ups never see friends.
create policy "children read their own requests" on public.friend_requests
  for select to authenticated using (from_child_id = (select auth.uid()) or to_child_id = (select auth.uid()));
create policy "children read their own friendships" on public.friendships
  for select to authenticated using (child_id = (select auth.uid()));

create policy "signed-in users read the item catalogue" on public.item_catalogue for select to authenticated using (true);
create policy "signed-in users read the mission catalogue" on public.mission_catalogue for select to authenticated using (true);
create policy "signed-in users read the power catalogue" on public.power_catalogue for select to authenticated using (true);

/* ---------------------------------------------------------------------
   3. PRIVATE HELPERS (not callable from the browser)
   Numbers here mirror the JS constants; the JS name is in each comment.
   --------------------------------------------------------------------- */

-- getTodayInUk()
create or replace function private.today_uk() returns date
language sql stable set search_path = '' as $$ select (now() at time zone 'Europe/London')::date $$;

-- getWeekDayIdInUk()
create or replace function private.week_day_id(p_date date) returns text
language sql immutable set search_path = '' as $$
  select (array['sun','mon','tue','wed','thu','fri','sat'])[extract(dow from p_date)::int + 1]
$$;

-- weekStartOf(): Monday
create or replace function private.week_start(p_date date) returns date
language sql immutable set search_path = '' as $$ select date_trunc('week', p_date)::date $$;

create or replace function private.require_user() returns uuid
language plpgsql stable set search_path = '' as $$
declare user_id uuid := auth.uid();
begin
  if user_id is null then raise exception 'not-signed-in'; end if;
  return user_id;
end $$;

/* Every "My…" RPC: the caller must be a child. p_lock = true locks their profile row, so two writes
   for the same child (e.g. two Mystery boxes at once) run one after the other and can't overspend. */
create or replace function private.require_child(p_lock boolean default true) returns uuid
language plpgsql set search_path = '' as $$
declare user_id uuid := private.require_user(); user_role text;
begin
  if p_lock then
    select role into user_role from public.profiles where id = user_id for update;
  else
    select role into user_role from public.profiles where id = user_id;
  end if;
  if user_role is distinct from 'child' then raise exception 'not-a-child'; end if;
  return user_id;
end $$;

create or replace function private.require_parent() returns uuid
language plpgsql set search_path = '' as $$
declare user_id uuid := private.require_user();
begin
  if not exists (select 1 from public.profiles where id = user_id and role = 'parent') then raise exception 'not-a-parent'; end if;
  return user_id;
end $$;

-- requireMyChild(): returns the grown-up's id. Locks the child's profile row for writes.
create or replace function private.require_my_child(p_child_id uuid, p_lock boolean default true) returns uuid
language plpgsql set search_path = '' as $$
declare caller_id uuid := private.require_parent();
begin
  if p_child_id is null or not exists (select 1 from public.family_links fl where fl.parent_id = caller_id and fl.child_id = p_child_id)
    then raise exception 'not-your-child'; end if;
  if p_lock then perform 1 from public.profiles where id = p_child_id for update; end if;
  return caller_id;
end $$;

/* ---------- Age (engine/missions.js ageFromBirthMonth, progression.js MIN/MAX_CHILD_AGE) ---------- */
create or replace function private.age_from_birth_month(p_birth_month int, p_birth_year int, p_on date default null) returns int
language sql stable set search_path = '' as $$
  select case when p_birth_month is null or p_birth_year is null then null
    else extract(year from coalesce(p_on, private.today_uk()))::int - p_birth_year
         - case when extract(month from coalesce(p_on, private.today_uk()))::int < p_birth_month then 1 else 0 end end
$$;

-- checkBirthMonth(): MIN_CHILD_AGE = 4, MAX_CHILD_AGE = 16. Returns the age.
create or replace function private.check_birth_month(p_birth_month int, p_birth_year int) returns int
language plpgsql stable set search_path = '' as $$
declare age int;
begin
  if p_birth_month is null or p_birth_year is null or p_birth_month not between 1 and 12 then raise exception 'bad-birth-month'; end if;
  age := private.age_from_birth_month(p_birth_month, p_birth_year);
  if age < 4 or age > 16 then raise exception 'bad-birth-month'; end if;
  return age;
end $$;

/* ---------- Levels (engine/progression.js) ----------
   LEVEL_POINT_THRESHOLDS [0,2,6,11]; then POINTS_PER_LEVEL_AFTER_LAST 4, +1 every LEVELS_PER_EXTRA_TASK 25,
   capped at MAX_POINTS_PER_LEVEL 10. */
create or replace function private.points_to_go_up_from(p_level int) returns int
language sql immutable set search_path = '' as $$
  select least(10, 4 + greatest(0, floor((p_level - 5) / 25.0)::int))
$$;

create or replace function private.points_needed_for_level(p_level int) returns int
language plpgsql immutable set search_path = '' as $$
declare total int := 11; level int;
begin
  if p_level <= 1 then return 0; end if;
  if p_level <= 4 then return (array[0, 2, 6, 11])[p_level]; end if;
  for level in 4 .. p_level - 1 loop total := total + private.points_to_go_up_from(level); end loop;
  return total;
end $$;

create or replace function private.calculate_level(p_points int) returns int
language plpgsql immutable set search_path = '' as $$
declare level int := 1; needed_now int := 0; needed_next int;
begin
  loop
    needed_next := case when level < 4 then (array[0, 2, 6, 11])[level + 1] else needed_now + private.points_to_go_up_from(level) end;
    exit when needed_next > coalesce(p_points, 0);
    level := level + 1;
    needed_now := needed_next;
  end loop;
  return level;
end $$;

-- Level points per buddy: tasks ticked while that buddy was playing (missions don't count).
create or replace function private.buddy_points(p_child_id uuid)
returns table (buddy_id uuid, points int)
language sql stable set search_path = '' as $$
  select b.id,
    ((select count(*) from public.chore_completions c where c.child_id = p_child_id and c.buddy_id = b.id)
   + (select count(*) from public.scheduled_task_completions s where s.child_id = p_child_id and s.buddy_id = b.id)
   + (select count(*) from public.own_tasks o where o.child_id = p_child_id and o.done and o.done_by_buddy_id = b.id))::int
  from public.buddies b where b.child_id = p_child_id
$$;

-- The playing buddy's level (1 if none).
create or replace function private.active_level(p_child_id uuid) returns int
language sql stable set search_path = '' as $$
  select coalesce((select private.calculate_level(bp.points) from private.buddy_points(p_child_id) bp
                   join public.profiles p on p.id = p_child_id and p.active_buddy_id = bp.buddy_id), 1)
$$;

-- fakeBestLevel(): highest level ever, any buddy (stored, so un-ticking never takes unlocks away).
create or replace function private.best_level(p_child_id uuid) returns int
language sql stable set search_path = '' as $$
  select greatest(1,
    coalesce((select highest_level_reached from public.profiles where id = p_child_id), 1),
    coalesce((select max(private.calculate_level(points)) from private.buddy_points(p_child_id)), 1))
$$;

create or replace function private.record_highest_level(p_child_id uuid) returns void
language sql set search_path = '' as $$
  update public.profiles set highest_level_reached = private.best_level(p_child_id) where id = p_child_id
$$;

/* ---------- XP (missions only) ----------
   XP to spend = xpEarned - xpSpentOnItems - xpSpentInShop */
create or replace function private.xp_earned(p_child_id uuid) returns int
language sql stable set search_path = '' as $$
  select coalesce(sum(xp_awarded), 0)::int from public.mission_completions where child_id = p_child_id
$$;
create or replace function private.xp_spent_on_items(p_child_id uuid) returns int
language sql stable set search_path = '' as $$
  select coalesce(sum(xp), 0)::int from public.item_xp where child_id = p_child_id
$$;
create or replace function private.xp_spent_in_shop(p_child_id uuid) returns int
language sql stable set search_path = '' as $$
  select (coalesce((select sum(price_paid) from public.purchases where child_id = p_child_id), 0)
        + coalesce((select sum(xp_paid - xp_refunded) from public.chance_rolls where child_id = p_child_id), 0))::int
$$;
create or replace function private.xp_to_spend(p_child_id uuid) returns int
language sql stable set search_path = '' as $$
  select private.xp_earned(p_child_id) - private.xp_spent_on_items(p_child_id) - private.xp_spent_in_shop(p_child_id)
$$;

/* ---------- Powers (content/powers.js activePowersFor) ----------
   { powerId: value } from the items IN USE. ABILITY_LEVELS: advanced 60 XP, master 200 XP.
   House items never give powers. Two of the same power: the strongest counts. */
create or replace function private.active_powers(p_child_id uuid) returns jsonb
language sql stable set search_path = '' as $$
  with equipped as (
    select distinct unnest(equipped_items) as item_id from public.profiles where id = p_child_id
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
    left join public.item_xp xp on xp.child_id = p_child_id and xp.item_id = tiers.item_id
    where coalesce(xp.xp, 0) >= tiers.xp_needed
  )
  select coalesce(jsonb_object_agg(power_id, value), '{}'::jsonb)
  from (select power_id, max(value) as value from switched_on group by power_id) strongest
$$;

create or replace function private.power_value(p_powers jsonb, p_power_id text) returns numeric
language sql immutable set search_path = '' as $$ select coalesce((p_powers ->> p_power_id)::numeric, 0) $$;

/* ---------- Owned items (fakeOwnedItemIds) ----------
   Level unlocks up to the best level (minus anything swapped away by Take a chance),
   Shop purchases, and anything won by chance (which also wins back a swapped-away item). */
create or replace function private.owned_item_ids(p_child_id uuid) returns setof text
language sql stable set search_path = '' as $$
  select won_item_id from public.chance_rolls where child_id = p_child_id and won_item_id is not null
  union
  select item_id from public.purchases where child_id = p_child_id
  union
  select item.id from public.item_catalogue item
  where item.unlock_level is not null and item.unlock_level <= private.best_level(p_child_id)
    and item.id not in (select risked_item_id from public.chance_rolls
                        where child_id = p_child_id and kind = 'gamble' and outcome in ('rarer', 'common'))
$$;

create or replace function private.owns_item(p_child_id uuid, p_item_id text) returns boolean
language sql stable set search_path = '' as $$
  select exists (select 1 from private.owned_item_ids(p_child_id) owned where owned = p_item_id)
$$;

-- gotAtLevelFor(): lowest of the item's unlock level, the Shop got_at_level and any chance won_at_level. null = never got it.
create or replace function private.got_at_level(p_child_id uuid, p_item_id text) returns int
language sql stable set search_path = '' as $$
  select least(
    (select unlock_level from public.item_catalogue where id = p_item_id),
    (select min(got_at_level) from public.purchases where child_id = p_child_id and item_id = p_item_id),
    (select min(won_at_level) from public.chance_rolls where child_id = p_child_id and won_item_id = p_item_id))
$$;

/* ---------- Tasks ---------- */
-- fakeTaskCountForDay(): set tasks + scheduled occurrences on that weekday + own tasks added that day.
create or replace function private.task_count_for_day(p_child_id uuid, p_date date) returns int
language sql stable set search_path = '' as $$
  select ((select count(*) from public.chores where child_id = p_child_id and active)
        + coalesce((select sum(times_per_day) from public.scheduled_tasks
                    where child_id = p_child_id and active and private.week_day_id(p_date) = any (days_of_week)), 0)
        + (select count(*) from public.own_tasks where child_id = p_child_id and added_on = p_date))::int
$$;

create or replace function private.scheduled_task_shape(p_task public.scheduled_tasks) returns jsonb
language sql immutable set search_path = '' as $$
  select jsonb_build_object('id', p_task.id, 'title', p_task.title, 'daysOfWeek', to_jsonb(p_task.days_of_week),
                            'timesPerDay', p_task.times_per_day, 'setBy', p_task.set_by)
$$;

/* fakeAddScheduledTask(): p_task = { title, daysOfWeek, timesPerDay }.
   "limit" past MAX_SCHEDULED_TASKS (15); "daily-limit" if any chosen day would go over MAX_TASKS_PER_DAY (10). */
create or replace function private.add_scheduled_task(p_child_id uuid, p_task jsonb, p_set_by text) returns jsonb
language plpgsql set search_path = '' as $$
declare
  task_title text := btrim(coalesce(p_task ->> 'title', ''));
  task_days text[];
  task_times int;
  today date := private.today_uk();
  saved public.scheduled_tasks;
begin
  begin
    task_days := array(select distinct jsonb_array_elements_text(p_task -> 'daysOfWeek'));
    task_times := (p_task ->> 'timesPerDay')::int;
  exception when others then raise exception 'bad-task';
  end;
  if char_length(task_title) not between 1 and 100 or cardinality(task_days) = 0
     or not task_days <@ array['mon','tue','wed','thu','fri','sat','sun'] or task_times is null or task_times not between 1 and 4
    then raise exception 'bad-task'; end if;
  if (select count(*) from public.scheduled_tasks where child_id = p_child_id and active) >= 15 then raise exception 'limit'; end if;
  if exists (
    select 1 from unnest(task_days) as day
    where (select count(*) from public.chores where child_id = p_child_id and active)
        + task_times
        + case when day = private.week_day_id(today)
               then (select count(*) from public.own_tasks where child_id = p_child_id and added_on = today) else 0 end
        + coalesce((select sum(times_per_day) from public.scheduled_tasks
                    where child_id = p_child_id and active and day = any (days_of_week)), 0) > 10
  ) then raise exception 'daily-limit'; end if;
  insert into public.scheduled_tasks (child_id, title, days_of_week, times_per_day, set_by)
  values (p_child_id, task_title, task_days, task_times, p_set_by) returning * into saved;
  return private.scheduled_task_shape(saved);
end $$;

/* ---------- Missions (engine/missions.js) ---------- */
/* missionsForAge(): unknown age → missions for ages 8–13 (DEFAULT_MISSION_AGES);
   otherwise the age clamped to MISSION_MIN_AGE 5 … MISSION_MAX_AGE 13. */
create or replace function private.mission_suits_age(p_mission public.mission_catalogue, p_age int) returns boolean
language sql immutable set search_path = '' as $$
  select case when p_age is null then p_mission.min_age <= 13 and p_mission.max_age >= 8
    else p_mission.min_age <= least(13, greatest(5, p_age)) and p_mission.max_age >= least(13, greatest(5, p_age)) end
$$;

-- isRightAnswer(): scenarios use isGoodChoice; quizzes use correctIndex; Feel good and timed-out are never right.
create or replace function private.is_right_answer(p_mission public.mission_catalogue, p_choice_index int) returns boolean
language sql immutable set search_path = '' as $$
  select case
    when p_mission.type = 'challenge' or p_choice_index is null then false
    when p_mission.type = 'scenario' then coalesce(p_choice_index = any (p_mission.good_choice_indexes), false)
    else coalesce(p_choice_index = p_mission.correct_index, false) end
$$;

/* ---------- Chance (content/inventory.js) ---------- */
/* mysteryBoxChances() + pickByChance(): MYSTERY_BOX_RARITY_ODDS with the Lucky power, only items NOT in the Shop,
   only rarities that have such items (so odds add up to 100%), unowned items first inside a rarity, else a duplicate.
   Rolls the dice here with random(). item_id is null if there is nothing at all to win. */
create or replace function private.mystery_box_roll(p_child_id uuid, p_luck numeric,
  out item_id text, out rarity text, out chance numeric, out duplicate boolean, out random_number double precision)
language plpgsql volatile set search_path = '' as $$
begin
  random_number := random();
  with odds (rarity, rarity_order, odds) as (
    values ('common', 1, 0.60 - p_luck), ('rare', 2, 0.30 + p_luck * 0.7),
           ('ultra', 3, 0.09 + p_luck * 0.25), ('insane', 4, 0.01 + p_luck * 0.05)
  ), owned as (
    select owned_id from private.owned_item_ids(p_child_id) as owned_id
  ), winnable as (
    select item.id, item.rarity, item.chance_within_rarity as weight, item.id in (select owned_id from owned) as is_owned
    from public.item_catalogue item where item.xp_price is null
  ), by_rarity as (
    select winnable.rarity, bool_and(is_owned) as all_owned from winnable group by winnable.rarity
  ), pool as (
    select winnable.*, by_rarity.all_owned as is_duplicate
    from winnable join by_rarity using (rarity) where by_rarity.all_owned or not winnable.is_owned
  ), present_odds as (
    select odds.* from odds where odds.rarity in (select by_rarity.rarity from by_rarity)
  ), weights as (
    select pool.rarity, sum(pool.weight) as total from pool group by pool.rarity
  ), chances as (
    select pool.id, pool.rarity, pool.is_duplicate, present_odds.rarity_order,
           (present_odds.odds / (select sum(o.odds) from present_odds o)) * pool.weight / weights.total as chance
    from pool join present_odds using (rarity) join weights using (rarity)
  ), running as (
    select chances.*, sum(chances.chance) over (order by chances.rarity_order, chances.id rows unbounded preceding) as running_total,
           row_number() over (order by chances.rarity_order desc, chances.id desc) as from_end
    from chances
  )
  select running.id, running.rarity, running.chance, running.is_duplicate
  into item_id, rarity, chance, duplicate
  from running
  where running.running_total > random_number::numeric or running.from_end = 1
  order by running.rarity_order, running.id
  limit 1;
end $$;

-- DUPLICATE_XP_BACK
create or replace function private.duplicate_xp_back(p_rarity text) returns int
language sql immutable set search_path = '' as $$
  select case p_rarity when 'common' then 5 when 'rare' then 10 when 'ultra' then 20 when 'insane' then 40 else 0 end
$$;

-- chancesFor(items, null) + pickByChance() for a list in ONE rarity: weighted by chance_within_rarity.
create or replace function private.pick_weighted(p_item_ids text[], p_random double precision,
  out item_id text, out chance numeric)
language sql stable set search_path = '' as $$
  with items as (
    select id, chance_within_rarity / sum(chance_within_rarity) over () as chance,
           row_number() over (order by id desc) as from_end
    from public.item_catalogue where id = any (p_item_ids)
  ), running as (
    select items.*, sum(items.chance) over (order by id rows unbounded preceding) as running_total from items
  )
  select id, chance from running
  where running_total > p_random::numeric or from_end = 1
  order by id limit 1
$$;

/* ---------- Shapes the app sees ---------- */
/* The profile as the app sees it (profileForApp): the child's own fields plus their active buddy's pet.
   pet_look comes back as saved; the app merges DEFAULT_PET_LOOK over it as before. */
create or replace view private.app_profiles as
select p.id, p.role, p.display_name, p.username, p.birth_month, p.birth_year,
  coalesce(b.theme_colour, p.theme_colour) as theme_colour,
  p.location, p.active_buddy_id, p.equipped_items, p.timed_missions, p.reset_streak_on_miss, p.chance_features,
  p.child_can_change_settings, p.setup_complete, p.highest_level_reached, p.plan,
  b.pet_type, coalesce(b.pet_name, '') as pet_name, coalesce(b.pet_look, '{}'::jsonb) as pet_look,
  case when p.role = 'child' then array(
    select parent.display_name from public.family_links fl join public.profiles parent on parent.id = fl.parent_id
    where fl.child_id = p.id order by fl.linked_on, parent.display_name) end as grown_up_names
from public.profiles p
left join public.buddies b on b.id = p.active_buddy_id;

create or replace function private.app_profile(p_user_id uuid) returns jsonb
language sql stable set search_path = '' as $$
  select to_jsonb(app) from private.app_profiles app where app.id = p_user_id
$$;

-- fakeItemColours(): { itemId: colourId }
create or replace function private.item_colours_for(p_child_id uuid) returns jsonb
language sql stable set search_path = '' as $$
  select coalesce(jsonb_object_agg(item_id, colour_id), '{}'::jsonb) from public.item_colours where child_id = p_child_id
$$;

/* A child's "look" as other people see it (lookFromProfile + level, equipped, itemColours).
   SAFE FIELDS ONLY: never birth month/year, username or anything else. */
create or replace function private.public_look(p_child_id uuid) returns jsonb
language sql stable set search_path = '' as $$
  select jsonb_build_object(
    'displayName', app.display_name, 'petType', app.pet_type, 'petName', app.pet_name, 'petLook', app.pet_look,
    'themeColour', app.theme_colour, 'location', app.location,
    'level', private.active_level(p_child_id), 'equipped', to_jsonb(app.equipped_items),
    'itemColours', private.item_colours_for(p_child_id))
  from private.app_profiles app where app.id = p_child_id
$$;

-- fakeChildForParent(): { id, displayName, setupComplete, level, petName, look } (look null until set up)
create or replace function private.child_for_parent(p_child_id uuid) returns jsonb
language sql stable set search_path = '' as $$
  select jsonb_build_object(
    'id', app.id,
    'displayName', coalesce(nullif(app.display_name, ''), app.username, 'New player'),
    'setupComplete', app.setup_complete,
    'level', private.active_level(p_child_id),
    'petName', app.pet_name,
    'look', case when app.setup_complete then private.public_look(p_child_id) end)
  from private.app_profiles app where app.id = p_child_id
$$;

-- Days with any task or mission done (a day counts as played).
create or replace function private.days_played_dates(p_child_id uuid) returns date[]
language sql stable set search_path = '' as $$
  select coalesce(array_agg(day order by day), '{}') from (
    select completed_on as day from public.chore_completions where child_id = p_child_id
    union select added_on from public.own_tasks where child_id = p_child_id and done
    union select completed_on from public.scheduled_task_completions where child_id = p_child_id
    union select completed_on from public.mission_completions where child_id = p_child_id
  ) days
$$;

-- fakeProgressSummary()
create or replace function private.progress_summary(p_child_id uuid) returns jsonb
language sql stable set search_path = '' as $$
  with points as (select * from private.buddy_points(p_child_id)),
  today as (select private.today_uk() as day),
  todays_missions as (select * from public.mission_completions, today where child_id = p_child_id and completed_on = today.day)
  select jsonb_build_object(
    'levelPoints', coalesce((select points.points from points join public.profiles p on p.id = p_child_id and p.active_buddy_id = points.buddy_id), 0),
    'highestLevelReached', private.best_level(p_child_id),
    'buddyLevelPoints', coalesce((select jsonb_object_agg(buddy_id, points.points) from points), '{}'::jsonb),
    'xpEarned', private.xp_earned(p_child_id),
    'xpSpentOnItems', private.xp_spent_on_items(p_child_id),
    'xpSpentInShop', private.xp_spent_in_shop(p_child_id),
    'daysPlayedTotal', cardinality(private.days_played_dates(p_child_id)),
    'daysPlayedDates', to_jsonb(private.days_played_dates(p_child_id)),
    'missionsDoneToday', coalesce((select jsonb_agg(jsonb_build_object('missionId', mission_id, 'xpAwarded', xp_awarded) order by created_at) from todays_missions), '[]'::jsonb),
    'hintsUsedToday', (select count(*) from todays_missions where used_hint),
    'thinkAgainsUsedToday', (select count(*) from todays_missions where used_think_again),
    'missionsLastDoneOn', coalesce((select jsonb_object_agg(mission_id, last_done) from (
        select mission_id, max(completed_on) as last_done from public.mission_completions, today
        where child_id = p_child_id and completed_on < today.day group by mission_id) last), '{}'::jsonb))
$$;

/* fakeChildStats(). The streak itself is worked out in the app with calculateStreak(), from streakInputs
   (the same inputs the fake used), because that function lives in the app's JS. */
create or replace function private.child_stats(p_child_id uuid) returns jsonb
language sql stable set search_path = '' as $$
  with today as (select private.today_uk() as day),
  days as (
    select series.day::date as day, private.week_day_id(series.day::date) as week_day,
      ((select count(*) from public.chore_completions where child_id = p_child_id and completed_on = series.day::date)
     + (select count(*) from public.scheduled_task_completions where child_id = p_child_id and completed_on = series.day::date)
     + (select count(*) from public.own_tasks where child_id = p_child_id and added_on = series.day::date and done))::int as done
    from today, generate_series(today.day - 6, today.day, interval '1 day') as series (day)
  ), week as (
    select day, week_day, done, greatest(done, private.task_count_for_day(p_child_id, day)) as set from days
  ), missions as (
    select mc.*, cat as mission from public.mission_completions mc
    left join public.mission_catalogue cat on cat.id = mc.mission_id where mc.child_id = p_child_id
  ), answered as (
    select * from missions where (missions.mission).id is not null and (missions.mission).type <> 'challenge'
  )
  select jsonb_build_object(
    'lastSevenDays', (select jsonb_agg(jsonb_build_object('date', day, 'weekDay', week_day, 'done', done, 'set', set) order by day) from week),
    'tasksDoneToday', (select done from week, today where week.day = today.day),
    'tasksSetToday', (select set from week, today where week.day = today.day),
    'tasksDoneThisWeek', (select sum(done) from week),
    'tasksSetThisWeek', (select sum(set) from week),
    'missionsDoneToday', (select count(*) from missions, today where completed_on = today.day),
    'missionsDoneThisWeek', (select count(*) from missions, today where completed_on >= today.day - 6),
    'missionsPossibleThisWeek', 7 * 3,
    'feelGoodDoneThisWeek', (select count(*) from missions, today where completed_on >= today.day - 6 and did_it),
    'questionsAnswered', (select count(*) from answered),
    'questionsRight', (select count(*) from answered where private.is_right_answer(answered.mission, answered.choice_index)),
    'streakInputs', jsonb_build_object(
      'daysPlayedDates', to_jsonb(private.days_played_dates(p_child_id)),
      'resetStreakOnMiss', (select reset_streak_on_miss from public.profiles where id = p_child_id),
      'streakShield', private.power_value(private.active_powers(p_child_id), 'streak-shield')))
$$;

/* ---------- Checking what the app sends ---------- */
create or replace function private.clean_text(p_value text, p_max_length int, p_error text, p_allow_empty boolean default false) returns text
language plpgsql immutable set search_path = '' as $$
declare cleaned text := btrim(coalesce(p_value, ''));
begin
  if char_length(cleaned) > p_max_length or (not p_allow_empty and cleaned = '') then raise exception '%', p_error; end if;
  return cleaned;
end $$;

-- Ids from the content files (pet types, colours, locations): short lowercase ids.
create or replace function private.clean_id(p_value text, p_error text) returns text
language plpgsql immutable set search_path = '' as $$
begin
  if p_value is null or p_value !~ '^[a-z0-9-]{1,40}$' then raise exception '%', p_error; end if;
  return p_value;
end $$;

create or replace function private.clean_pet_look(p_value jsonb) returns jsonb
language plpgsql immutable set search_path = '' as $$
begin
  if p_value is null then return '{}'::jsonb; end if;
  if jsonb_typeof(p_value) <> 'object' or octet_length(p_value::text) > 2000 then raise exception 'bad-look'; end if;
  return p_value;
end $$;

/* ---------------------------------------------------------------------
   4. AUTH: profiles for new grown-ups, and the username → hidden email lookup
   --------------------------------------------------------------------- */

/* Runs when an auth user is created. Grown-ups (supabase.auth.signUp with display_name in user metadata)
   get a 'parent' profile here. Children are created by the add-child Edge Function, which sets
   app_metadata.voxie_role = 'child' (only the service role can set app_metadata) and makes the profile itself. */
create or replace function private.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if coalesce(new.raw_app_meta_data ->> 'voxie_role', '') = 'child' then return new; end if;
  -- Nobody may sign up with a hidden child address.
  if lower(coalesce(new.email, '')) like '%@kids.voxie.invalid' then raise exception 'bad-email'; end if;
  insert into public.profiles (id, role, display_name)
  values (new.id, 'parent', left(coalesce(nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''), 'Grown-up'), 30));
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function private.handle_new_user();

/* Log-in by username: returns ONLY the hidden address for that username, or null. Callable before sign-in. */
create or replace function public.email_for_username(p_username text) returns text
language sql stable security definer set search_path = '' as $$
  select id::text || '@kids.voxie.invalid' from public.profiles
  where role = 'child' and username = lower(btrim(p_username))
$$;

/* The signed-in user's profile, as the app sees it (getSignedInProfile):
   supabase.from("my_profile").select("*").maybeSingle(). Only ever returns your own row. */
create or replace view public.my_profile as
select * from private.app_profiles where id = auth.uid();
revoke all on public.my_profile from anon, authenticated;
grant select on public.my_profile to authenticated;

/* ---------------------------------------------------------------------
   5. CHILD RPCs ("My…" functions). All SECURITY DEFINER, all check the caller is a child.
   --------------------------------------------------------------------- */

/* ---------- Profile and buddies ---------- */

-- saveProfileSetup(look). p_look = { displayName, petType, petName, themeColour, location, petLook }. Returns the profile.
create or replace function public.save_profile_setup(p_look jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  me uuid := private.require_child();
  buddy_id uuid;
  new_display_name text := private.clean_text(p_look ->> 'displayName', 16, 'bad-name');
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

-- updateMyProfile(look): name and location on the child; pet look and colour on the ACTIVE buddy. Returns the profile.
create or replace function public.update_my_profile(p_look jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child();
begin
  update public.profiles set
    display_name = private.clean_text(p_look ->> 'displayName', 16, 'bad-name'),
    location = private.clean_id(p_look ->> 'location', 'bad-look')
  where id = me;
  update public.buddies set
    pet_look = private.clean_pet_look(p_look -> 'petLook'),
    theme_colour = private.clean_id(p_look ->> 'themeColour', 'bad-look')
  where id = (select active_buddy_id from public.profiles where id = me);
  return private.app_profile(me);
end $$;

/* rebirthAsNewPet(petType, petName). A rebirth is earned every 100 levels a buddy reaches; each extra buddy
   uses one. "no-rebirth" / "unknown-pet" / "already-collected". Returns the profile. */
create or replace function public.rebirth_as_new_pet(p_pet_type text, p_pet_name text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  me uuid := private.require_child();
  rebirths_earned int;
  buddies_count int;
  start_colour text;
  new_buddy_id uuid;
begin
  select coalesce(sum(private.calculate_level(points) / 100), 0), count(*) into rebirths_earned, buddies_count
  from private.buddy_points(me);
  if rebirths_earned - greatest(buddies_count - 1, 0) < 1 then raise exception 'no-rebirth'; end if;
  perform private.clean_id(p_pet_type, 'unknown-pet');
  if exists (select 1 from public.buddies where child_id = me and pet_type = p_pet_type) then raise exception 'already-collected'; end if;
  select theme_colour into start_colour from private.app_profiles where id = me;   -- the colour you're using now
  insert into public.buddies (child_id, pet_type, pet_name, pet_look, theme_colour, adopted_on)
  values (me, p_pet_type, private.clean_text(p_pet_name, 30, 'bad-name', true), '{}', start_colour, private.today_uk())
  returning id into new_buddy_id;
  update public.profiles set active_buddy_id = new_buddy_id where id = me;
  return private.app_profile(me);
end $$;

-- setActiveBuddy(buddyId). "not-your-buddy". Returns the profile.
create or replace function public.set_active_buddy(p_buddy_id uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child();
begin
  if not exists (select 1 from public.buddies where id = p_buddy_id and child_id = me) then raise exception 'not-your-buddy'; end if;
  update public.profiles set active_buddy_id = p_buddy_id where id = me;
  return private.app_profile(me);
end $$;

/* ---------- Friends (safe fields only, never raw rows) ---------- */

/* searchPlayers(searchText): name contains the text (2+ letters), set-up children only, not you, max 10.
   [{ id, displayName, petType, petLook, relationship, requestId }] */
create or replace function public.search_players(p_search_text text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  me uuid := private.require_child(false);
  search text := lower(btrim(coalesce(p_search_text, '')));
  pattern text;
begin
  if char_length(search) < 2 then return '[]'::jsonb; end if;
  pattern := '%' || replace(replace(replace(left(search, 30), '\', '\\'), '%', '\%'), '_', '\_') || '%';
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', found.id, 'displayName', found.display_name, 'petType', found.pet_type, 'petLook', found.pet_look,
      'requestId', found.request_id,
      'relationship', case when found.is_friend then 'friend'
                           when found.request_id is null then 'none'
                           when found.request_from = me then 'request-sent' else 'request-received' end)
      order by found.display_name)
    from (
      select app.id, app.display_name, app.pet_type, app.pet_look,
        exists (select 1 from public.friendships f where f.child_id = me and f.friend_id = app.id) as is_friend,
        pending.id as request_id, pending.from_child_id as request_from
      from private.app_profiles app
      left join lateral (
        select fr.id, fr.from_child_id from public.friend_requests fr
        where fr.status = 'pending'
          and ((fr.from_child_id = me and fr.to_child_id = app.id) or (fr.from_child_id = app.id and fr.to_child_id = me))
        limit 1) pending on true
      where app.role = 'child' and app.id <> me and app.setup_complete and lower(app.display_name) like pattern
      order by app.display_name
      limit 10
    ) found), '[]'::jsonb);
end $$;

-- sendFriendRequest(toChildId). "not-found" / "already-friends" / "already-asked".
create or replace function public.send_friend_request(p_to_child_id uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child();
begin
  if p_to_child_id is null or p_to_child_id = me
     or not exists (select 1 from public.profiles where id = p_to_child_id and role = 'child' and setup_complete)
    then raise exception 'not-found'; end if;
  if exists (select 1 from public.friendships where child_id = me and friend_id = p_to_child_id) then raise exception 'already-friends'; end if;
  if exists (select 1 from public.friend_requests where status = 'pending'
             and ((from_child_id = me and to_child_id = p_to_child_id) or (from_child_id = p_to_child_id and to_child_id = me)))
    then raise exception 'already-asked'; end if;
  insert into public.friend_requests (from_child_id, to_child_id, sent_on) values (me, p_to_child_id, private.today_uk());
exception when unique_violation then raise exception 'already-asked';
end $$;

-- loadMyFriendRequests(): sent TO you, waiting. [{ id, fromChildId, displayName, petType, petLook }] newest first.
create or replace function public.load_my_friend_requests() returns jsonb
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child(false);
begin
  return coalesce((select jsonb_agg(jsonb_build_object('id', fr.id, 'fromChildId', app.id, 'displayName', app.display_name,
                                                       'petType', app.pet_type, 'petLook', app.pet_look) order by fr.created_at desc)
    from public.friend_requests fr join private.app_profiles app on app.id = fr.from_child_id
    where fr.to_child_id = me and fr.status = 'pending'), '[]'::jsonb);
end $$;

-- loadMySentFriendRequests(): YOU sent, waiting. [{ id, toChildId, displayName, petType, petLook }] newest first.
create or replace function public.load_my_sent_friend_requests() returns jsonb
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child(false);
begin
  return coalesce((select jsonb_agg(jsonb_build_object('id', fr.id, 'toChildId', app.id, 'displayName', app.display_name,
                                                       'petType', app.pet_type, 'petLook', app.pet_look) order by fr.created_at desc)
    from public.friend_requests fr join private.app_profiles app on app.id = fr.to_child_id
    where fr.from_child_id = me and fr.status = 'pending'), '[]'::jsonb);
end $$;

-- answerFriendRequest(requestId, accept). Accepting makes you friends both ways. "not-found".
create or replace function public.answer_friend_request(p_request_id uuid, p_accept boolean) returns void
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child(); from_id uuid;
begin
  update public.friend_requests set status = case when p_accept then 'accepted' else 'declined' end
  where id = p_request_id and to_child_id = me and status = 'pending'
  returning from_child_id into from_id;
  if from_id is null then raise exception 'not-found'; end if;
  if p_accept then
    insert into public.friendships (child_id, friend_id) values (me, from_id), (from_id, me) on conflict do nothing;
  end if;
end $$;

-- cancelFriendRequest(requestId): takes back a waiting request you sent.
create or replace function public.cancel_friend_request(p_request_id uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child();
begin
  update public.friend_requests set status = 'cancelled' where id = p_request_id and from_child_id = me and status = 'pending';
end $$;

-- removeFriend(friendId): both ways.
create or replace function public.remove_friend(p_friend_id uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child();
begin
  delete from public.friendships where (child_id = me and friend_id = p_friend_id) or (child_id = p_friend_id and friend_id = me);
end $$;

/* loadMyFriends(): set-up friends, safe fields only, sorted by name.
   [{ id, displayName, setupComplete, level, xpEarned, look:{ …, retiredBuddies:[{ petType, petLook }] } }] */
create or replace function public.load_my_friends() returns jsonb
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child(false);
begin
  return coalesce((select jsonb_agg(friend order by friend ->> 'displayName') from (
    select jsonb_build_object(
      'id', app.id, 'displayName', app.display_name, 'setupComplete', app.setup_complete,
      'level', private.active_level(app.id), 'xpEarned', private.xp_earned(app.id),
      'look', private.public_look(app.id) || jsonb_build_object('retiredBuddies', coalesce((
        select jsonb_agg(jsonb_build_object('petType', b.pet_type, 'petLook', b.pet_look) order by b.adopted_on, b.created_at)
        from public.buddies b where b.child_id = app.id and b.id is distinct from app.active_buddy_id), '[]'::jsonb))) as friend
    from public.friendships f join private.app_profiles app on app.id = f.friend_id
    where f.child_id = me and app.setup_complete) friends), '[]'::jsonb);
end $$;

/* ---------- Settings and items in use ---------- */

-- updateMySettings(settings). p_settings = { timedMissions, resetStreakOnMiss, chanceFeatures }. "set-by-grown-up". Returns the profile.
create or replace function public.update_my_settings(p_settings jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child();
begin
  if not (select child_can_change_settings from public.profiles where id = me) then raise exception 'set-by-grown-up'; end if;
  update public.profiles set
    timed_missions = coalesce((p_settings ->> 'timedMissions')::boolean, timed_missions),
    reset_streak_on_miss = coalesce((p_settings ->> 'resetStreakOnMiss')::boolean, reset_streak_on_miss),
    chance_features = coalesce((p_settings ->> 'chanceFeatures')::boolean, true)
  where id = me;
  return private.app_profile(me);
end $$;

-- updateEquippedItems(itemIds): only items the child owns. "not-owned". Returns the profile.
create or replace function public.update_equipped_items(p_item_ids text[]) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child(); cleaned text[];
begin
  cleaned := array(select distinct unnest(coalesce(p_item_ids, '{}')));
  if cardinality(cleaned) > 100 then raise exception 'not-owned'; end if;
  if exists (select 1 from unnest(cleaned) as item_id
             where item_id not in (select owned_id from private.owned_item_ids(me) as owned_id))
    then raise exception 'not-owned'; end if;
  update public.profiles set equipped_items = cleaned where id = me;
  return private.app_profile(me);
end $$;

/* ---------- Tasks ---------- */

-- addMyOwnTask(title): for today. "daily-limit" at MAX_TASKS_PER_DAY (10). Returns { id, title, done }.
create or replace function public.add_my_own_task(p_title text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child(); today date := private.today_uk(); saved public.own_tasks;
begin
  if private.task_count_for_day(me, today) >= 10 then raise exception 'daily-limit'; end if;
  insert into public.own_tasks (child_id, title, added_on) values (me, private.clean_text(p_title, 100, 'bad-task'), today)
  returning * into saved;
  return jsonb_build_object('id', saved.id, 'title', saved.title, 'done', saved.done);
end $$;

-- setMyOwnTaskDone(ownTaskId, done): today's own tasks only. The playing buddy gets the point.
create or replace function public.set_my_own_task_done(p_own_task_id uuid, p_done boolean) returns void
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child();
begin
  update public.own_tasks set
    done = coalesce(p_done, false),
    done_by_buddy_id = case when coalesce(p_done, false) then (select active_buddy_id from public.profiles where id = me) end
  where id = p_own_task_id and child_id = me and added_on = private.today_uk();
  if coalesce(p_done, false) then perform private.record_highest_level(me); end if;
end $$;

-- removeMyOwnTask(ownTaskId): only while not ticked.
create or replace function public.remove_my_own_task(p_own_task_id uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child();
begin
  delete from public.own_tasks where id = p_own_task_id and child_id = me and not done;
end $$;

-- addMyScheduledTask(task). p_task = { title, daysOfWeek, timesPerDay }. "limit" / "daily-limit". Returns the saved task.
create or replace function public.add_my_scheduled_task(p_task jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
begin
  return private.add_scheduled_task(private.require_child(), p_task, 'child');
end $$;

-- removeMyScheduledTask(scheduledTaskId): stops it appearing; points kept. "set-by-grown-up".
create or replace function public.remove_my_scheduled_task(p_scheduled_task_id uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child(); task_set_by text;
begin
  select set_by into task_set_by from public.scheduled_tasks where id = p_scheduled_task_id and child_id = me;
  if task_set_by = 'parent' then raise exception 'set-by-grown-up'; end if;
  update public.scheduled_tasks set active = false where id = p_scheduled_task_id and child_id = me;
end $$;

-- markScheduledTaskDone(scheduledTaskId, occurrence): an active task of yours, on today's weekday, occurrence 1…timesPerDay.
create or replace function public.mark_scheduled_task_done(p_scheduled_task_id uuid, p_occurrence int) returns void
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child(); today date := private.today_uk();
begin
  if not exists (select 1 from public.scheduled_tasks where id = p_scheduled_task_id and child_id = me and active
                 and private.week_day_id(today) = any (days_of_week) and p_occurrence between 1 and times_per_day)
    then raise exception 'not-found'; end if;
  insert into public.scheduled_task_completions (child_id, buddy_id, scheduled_task_id, occurrence, completed_on)
  values (me, (select active_buddy_id from public.profiles where id = me), p_scheduled_task_id, p_occurrence, today)
  on conflict (scheduled_task_id, occurrence, completed_on) do nothing;
  perform private.record_highest_level(me);
end $$;

create or replace function public.unmark_scheduled_task_done(p_scheduled_task_id uuid, p_occurrence int) returns void
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child();
begin
  delete from public.scheduled_task_completions
  where child_id = me and scheduled_task_id = p_scheduled_task_id and occurrence = p_occurrence and completed_on = private.today_uk();
end $$;

-- markChoreDone(choreId): an active set task of yours.
create or replace function public.mark_chore_done(p_chore_id uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child();
begin
  if not exists (select 1 from public.chores where id = p_chore_id and child_id = me and active) then raise exception 'not-found'; end if;
  insert into public.chore_completions (child_id, buddy_id, chore_id, completed_on)
  values (me, (select active_buddy_id from public.profiles where id = me), p_chore_id, private.today_uk())
  on conflict (child_id, chore_id, completed_on) do nothing;
  perform private.record_highest_level(me);
end $$;

create or replace function public.unmark_chore_done(p_chore_id uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child();
begin
  delete from public.chore_completions where child_id = me and chore_id = p_chore_id and completed_on = private.today_uk();
end $$;

/* ---------- Items, Shop and colours ---------- */

-- addXpToItem(itemId, amount): spare XP into an owned, non-house item. "bad-amount" / "not-owned" / "not-enough-xp". Returns the new total.
create or replace function public.add_xp_to_item(p_item_id text, p_amount int) returns int
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child(); new_total int;
begin
  if p_amount is null or p_amount < 1 then raise exception 'bad-amount'; end if;
  if not exists (select 1 from public.item_catalogue where id = p_item_id and category <> 'house')
     or not private.owns_item(me, p_item_id) then raise exception 'not-owned'; end if;
  if p_amount > private.xp_to_spend(me) then raise exception 'not-enough-xp'; end if;
  insert into public.item_xp (child_id, item_id, xp) values (me, p_item_id, p_amount)
  on conflict (child_id, item_id) do update set xp = public.item_xp.xp + excluded.xp
  returning xp into new_total;
  return new_total;
end $$;

/* setItemColour(itemId, colourId): "original" puts it back. Unlocks at
   gotAtLevel + RECOLOUR_BASE_LEVELS 10 + rarity extra (0/5/10/20) + floor(gotAtLevel / 10).
   "not-owned" / "unknown-colour" / "locked". */
create or replace function public.set_item_colour(p_item_id text, p_colour_id text) returns void
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child(); item public.item_catalogue; got_level int; unlock_level int;
begin
  select * into item from public.item_catalogue where id = p_item_id;
  if item.id is null or not private.owns_item(me, p_item_id) then raise exception 'not-owned'; end if;
  if p_colour_id is null or p_colour_id not in ('original','red','orange','yellow','green','teal','blue','purple','pink')
    then raise exception 'unknown-colour'; end if;
  got_level := private.got_at_level(me, p_item_id);
  unlock_level := got_level + 10 + (case item.rarity when 'rare' then 5 when 'ultra' then 10 when 'insane' then 20 else 0 end) + got_level / 10;
  if got_level is null or private.best_level(me) < unlock_level then raise exception 'locked'; end if;
  delete from public.item_colours where child_id = me and item_id = p_item_id;
  if p_colour_id <> 'original' then
    insert into public.item_colours (child_id, item_id, colour_id) values (me, p_item_id, p_colour_id);
  end if;
end $$;

/* buyItem(itemId): the price comes from item_catalogue, less the Bargain power, never below 1.
   "not-for-sale" / "already-owned" / "not-enough-xp". Returns { pricePaid }. */
create or replace function public.buy_item(p_item_id text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child(); base_price int; price int;
begin
  select xp_price into base_price from public.item_catalogue where id = p_item_id;
  if base_price is null then raise exception 'not-for-sale'; end if;
  if exists (select 1 from public.purchases where child_id = me and item_id = p_item_id) then raise exception 'already-owned'; end if;
  price := greatest(1, round(base_price * (1 - private.power_value(private.active_powers(me), 'bargain')))::int);
  if price > private.xp_to_spend(me) then raise exception 'not-enough-xp'; end if;
  insert into public.purchases (child_id, item_id, price_paid, bought_on, got_at_level)
  values (me, p_item_id, price, private.today_uk(), private.best_level(me));
  return jsonb_build_object('pricePaid', price);
end $$;

/* ---------- Chance: every roll happens here and is kept in chance_rolls ---------- */

/* openMysteryBox(): MYSTERY_BOX_PRICE 20 XP, MYSTERY_BOXES_PER_DAY 3, Lucky power changes the odds.
   "chance-off" / "daily-limit" / "not-enough-xp" / "sold-out". Returns { wonItemId, chance, duplicate, xpBack }. */
create or replace function public.open_mystery_box() returns jsonb
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child(); today date := private.today_uk(); prize record; xp_back int;
begin
  if not (select chance_features from public.profiles where id = me) then raise exception 'chance-off'; end if;
  if (select count(*) from public.chance_rolls where child_id = me and kind = 'box' and rolled_on = today) >= 3 then raise exception 'daily-limit'; end if;
  if private.xp_to_spend(me) < 20 then raise exception 'not-enough-xp'; end if;
  select * into prize from private.mystery_box_roll(me, private.power_value(private.active_powers(me), 'lucky'));
  if prize.item_id is null then raise exception 'sold-out'; end if;
  xp_back := case when prize.duplicate then private.duplicate_xp_back(prize.rarity) else 0 end;
  insert into public.chance_rolls (child_id, kind, outcome, won_item_id, chance, random_number, xp_paid, xp_refunded, rolled_on, won_at_level)
  values (me, 'box', case when prize.duplicate then 'duplicate' else 'won' end, prize.item_id, prize.chance, prize.random_number,
          20, xp_back, today, private.best_level(me));
  return jsonb_build_object('wonItemId', prize.item_id, 'chance', prize.chance, 'duplicate', prize.duplicate, 'xpBack', xp_back);
end $$;

-- keepNewItem(itemId): "Keep it" — records the decision so the chance can't be taken later.
create or replace function public.keep_new_item(p_item_id text) returns void
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child();
begin
  insert into public.chance_rolls (child_id, kind, risked_item_id, outcome, xp_paid, rolled_on)
  values (me, 'gamble', p_item_id, 'declined', 0, private.today_uk())
  on conflict (child_id, risked_item_id) where kind = 'gamble' do nothing;
end $$;

/* claimWeeklyTreasure(): Treasure finder power, one free item a week (Monday to Sunday).
   "no-power" / "already-claimed" / "sold-out". Returns { wonItemId, chance, duplicate, xpBack }. */
create or replace function public.claim_weekly_treasure() returns jsonb
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child(); today date := private.today_uk(); powers jsonb := private.active_powers(me); prize record; xp_back int;
begin
  if private.power_value(powers, 'treasure-finder') = 0 then raise exception 'no-power'; end if;
  if exists (select 1 from public.chance_rolls where child_id = me and kind = 'treasure' and private.week_start(rolled_on) = private.week_start(today))
    then raise exception 'already-claimed'; end if;
  select * into prize from private.mystery_box_roll(me, private.power_value(powers, 'lucky'));
  if prize.item_id is null then raise exception 'sold-out'; end if;
  xp_back := case when prize.duplicate then private.duplicate_xp_back(prize.rarity) else 0 end;
  insert into public.chance_rolls (child_id, kind, outcome, won_item_id, chance, random_number, xp_paid, xp_refunded, rolled_on, won_at_level)
  values (me, 'treasure', case when prize.duplicate then 'duplicate' else 'won' end, prize.item_id, prize.chance, prize.random_number,
          0, xp_back, today, private.best_level(me));
  return jsonb_build_object('wonItemId', prize.item_id, 'chance', prize.chance, 'duplicate', prize.duplicate, 'xpBack', xp_back);
end $$;

/* claimMilestoneBox(buddyId, level): a free box for every MILESTONE_EVERY_LEVELS (10) levels a buddy reaches, once each.
   "not-reached" / "already-claimed" / "sold-out". Returns { wonItemId, chance, duplicate, xpBack }. */
create or replace function public.claim_milestone_box(p_buddy_id uuid, p_level int) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child(); today date := private.today_uk(); buddy_level int; prize record; xp_back int;
begin
  select private.calculate_level(points) into buddy_level from private.buddy_points(me) where buddy_id = p_buddy_id;
  if buddy_level is null or p_level is null or p_level < 10 or p_level % 10 <> 0 or buddy_level < p_level then raise exception 'not-reached'; end if;
  if exists (select 1 from public.chance_rolls where child_id = me and kind = 'milestone' and milestone_buddy_id = p_buddy_id and milestone_level = p_level)
    then raise exception 'already-claimed'; end if;
  select * into prize from private.mystery_box_roll(me, private.power_value(private.active_powers(me), 'lucky'));
  if prize.item_id is null then raise exception 'sold-out'; end if;
  xp_back := case when prize.duplicate then private.duplicate_xp_back(prize.rarity) else 0 end;
  insert into public.chance_rolls (child_id, kind, milestone_buddy_id, milestone_level, outcome, won_item_id, chance, random_number,
                                   xp_paid, xp_refunded, rolled_on, won_at_level)
  values (me, 'milestone', p_buddy_id, p_level, case when prize.duplicate then 'duplicate' else 'won' end, prize.item_id, prize.chance,
          prize.random_number, 0, xp_back, today, private.best_level(me));
  return jsonb_build_object('wonItemId', prize.item_id, 'chance', prize.chance, 'duplicate', prize.duplicate, 'xpBack', xp_back);
end $$;

/* takeAChance(itemId): only on an item JUST unlocked (its unlock level = the child's highest level), once.
   Outcomes (takeAChanceOutcomes): rarer = Daring power or 1/3; keep and common share the rest.
   If an outcome has nothing to give it becomes "keep".
   "chance-off" / "cannot-take-a-chance" / "not-owned" / "already-tried" / "not-new".
   Returns { outcome, wonItemId, chance, profile }. */
create or replace function public.take_a_chance(p_item_id text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  me uuid := private.require_child();
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
  if exists (select 1 from public.chance_rolls where child_id = me and kind = 'gamble' and risked_item_id = p_item_id) then raise exception 'already-tried'; end if;
  if item.unlock_level <> private.best_level(me) then raise exception 'not-new'; end if;

  win_chance := coalesce(nullif(private.power_value(private.active_powers(me), 'daring'), 0), 1.0 / 3);
  rest_chance := (1 - win_chance) / 2;
  if outcome_roll < win_chance then outcome := 'rarer'; outcome_chance := win_chance;
  elsif outcome_roll < win_chance + rest_chance then outcome := 'keep'; outcome_chance := rest_chance;
  else outcome := 'common'; outcome_chance := rest_chance; end if;

  if outcome = 'rarer' then
    -- rarerPrizesFor(): unowned chance items of the next rarity up that has any.
    foreach next_rarity in array (array['common','rare','ultra','insane'])[array_position(array['common','rare','ultra','insane'], item.rarity) + 1 :] loop
      prize_ids := array(select c.id from public.item_catalogue c
                         where c.rarity = next_rarity and c.xp_price is null and not private.owns_item(me, c.id));
      exit when cardinality(prize_ids) > 0;
    end loop;
  elsif outcome = 'common' then
    -- commonSwapsFor(): unowned common chance items, not this one.
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

  insert into public.chance_rolls (child_id, kind, risked_item_id, outcome, won_item_id, chance, random_number, xp_paid, rolled_on, won_at_level)
  values (me, 'gamble', p_item_id, final_outcome, prize_item_id, final_chance, outcome_roll, 0,
          private.today_uk(), case when final_outcome <> 'keep' then private.best_level(me) end);
  if final_outcome <> 'keep' then
    update public.profiles set equipped_items = array_remove(equipped_items, p_item_id) where id = me;
  end if;
  return jsonb_build_object('outcome', final_outcome, 'wonItemId', prize_item_id,
                            'chance', final_chance, 'profile', private.app_profile(me));
end $$;

/* ---------- Missions ---------- */

/* saveMissionCompletion(missionId, choiceIndex, { usedHint, usedThinkAgain, didIt }).
   XP worked out here: right = difficulty + Brain boost; wrong or timed out = XP_FOR_TRYING 1;
   Feel good = difficulty (only with didIt, no choice, no powers).
   Limits: MAX_MISSIONS_PER_DAY 3 + Bonus mission; hints and think-agains per day up to the power's value.
   "unknown-mission" / "not-for-age" / "bad-answer" / "daily-limit" / "no-power".
   Returns { xpAwarded, brainBoost } (plus alreadySaved: true if this mission was already saved today). */
create or replace function public.save_mission_completion(p_mission_id text, p_choice_index int,
  p_used_hint boolean default false, p_used_think_again boolean default false, p_did_it boolean default false) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  me uuid := private.require_child();
  today date := private.today_uk();
  mission public.mission_catalogue;
  child public.profiles;
  powers jsonb := private.active_powers(me);
  already public.mission_completions;
  hint_used boolean := coalesce(p_used_hint, false);
  think_again_used boolean := coalesce(p_used_think_again, false);
  brain_boost int := 0;
  xp_to_award int;
begin
  select * into mission from public.mission_catalogue where id = p_mission_id;
  if mission.id is null then raise exception 'unknown-mission'; end if;
  select * into child from public.profiles where id = me;
  if not private.mission_suits_age(mission, private.age_from_birth_month(child.birth_month, child.birth_year)) then raise exception 'not-for-age'; end if;
  if mission.type = 'challenge' and (not coalesce(p_did_it, false) or p_choice_index is not null or hint_used or think_again_used)
    then raise exception 'bad-answer'; end if;
  if mission.type <> 'challenge' and p_choice_index is not null and (p_choice_index < 0 or p_choice_index > 20) then raise exception 'bad-answer'; end if;

  select * into already from public.mission_completions where child_id = me and mission_id = p_mission_id and completed_on = today;
  if already.id is not null then
    return jsonb_build_object('xpAwarded', already.xp_awarded, 'brainBoost', 0, 'alreadySaved', true);
  end if;
  if (select count(*) from public.mission_completions where child_id = me and completed_on = today)
     >= 3 + private.power_value(powers, 'bonus-mission') then raise exception 'daily-limit'; end if;
  if hint_used and (select count(*) from public.mission_completions where child_id = me and completed_on = today and mission_completions.used_hint)
     >= private.power_value(powers, 'hint') then raise exception 'no-power'; end if;
  if think_again_used and (select count(*) from public.mission_completions where child_id = me and completed_on = today and mission_completions.used_think_again)
     >= private.power_value(powers, 'think-again') then raise exception 'no-power'; end if;

  if mission.type = 'challenge' then
    xp_to_award := mission.difficulty;
  elsif private.is_right_answer(mission, p_choice_index) then
    brain_boost := private.power_value(powers, 'brain-boost')::int;
    xp_to_award := mission.difficulty + brain_boost;
  else
    xp_to_award := 1;
  end if;

  insert into public.mission_completions (child_id, mission_id, completed_on, choice_index, xp_awarded, used_hint, used_think_again, did_it)
  values (me, p_mission_id, today, p_choice_index, xp_to_award, hint_used, think_again_used, mission.type = 'challenge');
  return jsonb_build_object('xpAwarded', xp_to_award, 'brainBoost', brain_boost);
end $$;

-- loadProgressSummary(): see private.progress_summary for the shape.
create or replace function public.load_progress_summary() returns jsonb
language plpgsql security definer set search_path = '' as $$
begin
  return private.progress_summary(private.require_child(false));
end $$;

/* ---------------------------------------------------------------------
   6. GROWN-UP RPCs. All check the caller is a parent linked to the child.
   --------------------------------------------------------------------- */

-- loadMyChildren(): [{ id, displayName, setupComplete, level, petName, look }]
create or replace function public.load_my_children() returns jsonb
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_parent();
begin
  return coalesce((select jsonb_agg(private.child_for_parent(fl.child_id) order by fl.linked_on, fl.child_id)
                   from public.family_links fl where fl.parent_id = me), '[]'::jsonb);
end $$;

/* loadChildOverview(childId): { child, settings, tasks, stats, login:{ username }, grownUps, birth:{ month, year } }.
   stats.streakInputs = { daysPlayedDates, resetStreakOnMiss, streakShield } for calculateStreak() in the app. */
create or replace function public.load_child_overview(p_child_id uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare child public.profiles;
begin
  perform private.require_my_child(p_child_id, false);
  select * into child from public.profiles where id = p_child_id;
  return jsonb_build_object(
    'child', private.child_for_parent(p_child_id),
    'settings', jsonb_build_object('timedMissions', child.timed_missions, 'resetStreakOnMiss', child.reset_streak_on_miss,
                                   'chanceFeatures', child.chance_features, 'childCanChangeSettings', child.child_can_change_settings),
    'tasks', coalesce((select jsonb_agg(task order by set_tasks_first, sort_order, created_at) from (
        select jsonb_build_object('id', id, 'title', title, 'daysOfWeek', '["mon","tue","wed","thu","fri","sat","sun"]'::jsonb,
                                  'timesPerDay', 1, 'setBy', 'parent') as task, 0 as set_tasks_first, sort_order, created_at
        from public.chores where child_id = p_child_id and active
        union all
        select private.scheduled_task_shape(st), 1, 0, st.created_at
        from public.scheduled_tasks st where st.child_id = p_child_id and st.active) tasks), '[]'::jsonb),
    'stats', private.child_stats(p_child_id),
    'login', jsonb_build_object('username', coalesce(child.username, '')),
    'grownUps', coalesce((select jsonb_agg(parent.display_name order by fl.linked_on, parent.display_name)
                          from public.family_links fl join public.profiles parent on parent.id = fl.parent_id
                          where fl.child_id = p_child_id), '[]'::jsonb),
    'birth', jsonb_build_object('month', child.birth_month, 'year', child.birth_year));
end $$;

-- setChildBirthMonth(childId, { birthMonth, birthYear }): grown-ups only. "bad-birth-month".
create or replace function public.set_child_birth_month(p_child_id uuid, p_birth_month int, p_birth_year int) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform private.require_my_child(p_child_id);
  perform private.check_birth_month(p_birth_month, p_birth_year);
  update public.profiles set birth_month = p_birth_month, birth_year = p_birth_year where id = p_child_id;
end $$;

-- addChildTask(childId, task): same limits as addMyScheduledTask, set_by 'parent'. Returns the saved task.
create or replace function public.add_child_task(p_child_id uuid, p_task jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
begin
  perform private.require_my_child(p_child_id);
  return private.add_scheduled_task(p_child_id, p_task, 'parent');
end $$;

-- removeChildTask(childId, taskId): any of the child's tasks (scheduled or set). Points already earned are kept.
create or replace function public.remove_child_task(p_child_id uuid, p_task_id uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform private.require_my_child(p_child_id);
  update public.scheduled_tasks set active = false where id = p_task_id and child_id = p_child_id;
  if not found then
    update public.chores set active = false where id = p_task_id and child_id = p_child_id;
  end if;
end $$;

-- updateChildSettings(childId, settings). p_settings = { timedMissions, resetStreakOnMiss, chanceFeatures, childCanChangeSettings }.
create or replace function public.update_child_settings(p_child_id uuid, p_settings jsonb) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform private.require_my_child(p_child_id);
  update public.profiles set
    timed_missions = coalesce((p_settings ->> 'timedMissions')::boolean, timed_missions),
    reset_streak_on_miss = coalesce((p_settings ->> 'resetStreakOnMiss')::boolean, reset_streak_on_miss),
    chance_features = coalesce((p_settings ->> 'chanceFeatures')::boolean, chance_features),
    child_can_change_settings = coalesce((p_settings ->> 'childCanChangeSettings')::boolean, child_can_change_settings)
  where id = p_child_id;
end $$;

/* createGrownUpInvite(childId): a 6-letter code (no 0/O/1/I/L), used once, lasts LINK_CODE_HOURS 24.
   Any older code for the child stops working. Returns { code, expiresAt }. */
create or replace function public.create_grown_up_invite(p_child_id uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  letters constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  random_bytes bytea;
  new_code text;
  expires timestamptz := now() + interval '24 hours';
  attempt int;
begin
  perform private.require_my_child(p_child_id);
  delete from public.link_codes where child_id = p_child_id or expires_at < now();
  for attempt in 1 .. 10 loop
    -- gen_random_uuid() is cryptographically random; take 6 of its bytes.
    random_bytes := decode(replace(gen_random_uuid()::text, '-', ''), 'hex');
    new_code := '';
    for byte_index in 0 .. 5 loop
      new_code := new_code || substr(letters, get_byte(random_bytes, byte_index) % 31 + 1, 1);
    end loop;
    begin
      insert into public.link_codes (child_id, code, expires_at) values (p_child_id, new_code, expires);
      return jsonb_build_object('code', new_code, 'expiresAt', expires);
    exception when unique_violation then null;  -- code already in use: try another
    end;
  end loop;
  raise exception 'save-failed';
end $$;

/* linkChildWithCode(code): links a child from another grown-up's invite.
   "confusing-letters" / "bad-code" / "already-linked". Returns the child (as in loadMyChildren). */
create or replace function public.link_child_with_code(p_code text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  me uuid := private.require_parent();
  clean_code text := regexp_replace(upper(coalesce(p_code, '')), '[^A-Z0-9]', '', 'g');
  invite public.link_codes;
begin
  if clean_code ~ '[01OIL]' then raise exception 'confusing-letters'; end if;
  select * into invite from public.link_codes where code = clean_code and expires_at > now() for update;
  if invite.child_id is null or not exists (select 1 from public.profiles where id = invite.child_id and role = 'child')
    then raise exception 'bad-code'; end if;
  if exists (select 1 from public.family_links where parent_id = me and child_id = invite.child_id) then raise exception 'already-linked'; end if;
  insert into public.family_links (parent_id, child_id, linked_on) values (me, invite.child_id, private.today_uk());
  delete from public.link_codes where child_id = invite.child_id;
  return private.child_for_parent(invite.child_id);
end $$;

/* unlinkChild(childId): only when another grown-up looks after them ("last-grown-up" otherwise).
   If no grown-up is left, the child gets their settings and tasks back. */
create or replace function public.unlink_child(p_child_id uuid) returns void
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_my_child(p_child_id);
begin
  if (select count(*) from public.family_links where child_id = p_child_id) < 2 then raise exception 'last-grown-up'; end if;
  delete from public.family_links where parent_id = me and child_id = p_child_id;
  if not exists (select 1 from public.family_links where child_id = p_child_id) then
    update public.profiles set child_can_change_settings = true where id = p_child_id;
    update public.scheduled_tasks set set_by = 'child' where child_id = p_child_id and set_by = 'parent';
  end if;
end $$;

/* ---------------------------------------------------------------------
   7. SERVICE-ROLE ONLY (called by the Edge Functions, never the browser)
   --------------------------------------------------------------------- */

/* add-child: makes the child's profile and family link in one transaction, after the Edge Function has
   created the auth user. "bad-birth-month" / "bad-username" / "username-taken" / "limit".
   Returns the child (as in loadMyChildren). */
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
    values (p_child_id, 'child', '', clean_username, p_birth_month, p_birth_year, age >= 8);   -- TIMED_MISSIONS_FROM_AGE
  exception when unique_violation then raise exception 'username-taken';
  end;
  insert into public.family_links (parent_id, child_id, linked_on) values (p_parent_id, p_child_id, private.today_uk());
  return private.child_for_parent(p_child_id);
end $$;

/* delete-child-account: deletes every row for the child EXCEPT the profile and family links.
   The Edge Function then calls auth.admin.deleteUser, which removes the profile (and, through the
   foreign keys, anything left). Keeping the links until then means a failed deleteUser can be retried. */
create or replace function public.delete_child_data(p_child_id uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.profiles where id = p_child_id and role = 'child') then raise exception 'not-found'; end if;
  update public.profiles set active_buddy_id = null, equipped_items = '{}' where id = p_child_id;
  delete from public.friendships where child_id = p_child_id or friend_id = p_child_id;
  delete from public.friend_requests where from_child_id = p_child_id or to_child_id = p_child_id;
  delete from public.link_codes where child_id = p_child_id;
  delete from public.mission_completions where child_id = p_child_id;
  delete from public.item_colours where child_id = p_child_id;
  delete from public.chance_rolls where child_id = p_child_id;
  delete from public.purchases where child_id = p_child_id;
  delete from public.item_xp where child_id = p_child_id;
  delete from public.scheduled_task_completions where child_id = p_child_id;
  delete from public.scheduled_tasks where child_id = p_child_id;
  delete from public.own_tasks where child_id = p_child_id;
  delete from public.chore_completions where child_id = p_child_id;
  delete from public.chores where child_id = p_child_id;
  delete from public.buddies where child_id = p_child_id;
end $$;

/* ---------------------------------------------------------------------
   8. WHO CAN CALL WHAT
   Postgres lets everyone run new functions by default, so take that away and grant back exactly.
   --------------------------------------------------------------------- */
revoke execute on all functions in schema private from public, anon, authenticated;
grant execute on function private.can_see_child(uuid) to authenticated;   -- used inside RLS policies
revoke all on all tables in schema private from public, anon, authenticated;

revoke execute on all functions in schema public from public, anon, authenticated;

grant execute on function public.email_for_username(text) to anon, authenticated;

grant execute on function
  public.save_profile_setup(jsonb), public.update_my_profile(jsonb), public.rebirth_as_new_pet(text, text),
  public.set_active_buddy(uuid), public.search_players(text), public.send_friend_request(uuid),
  public.load_my_friend_requests(), public.load_my_sent_friend_requests(), public.answer_friend_request(uuid, boolean),
  public.cancel_friend_request(uuid), public.remove_friend(uuid), public.load_my_friends(),
  public.update_my_settings(jsonb), public.update_equipped_items(text[]),
  public.add_my_own_task(text), public.set_my_own_task_done(uuid, boolean), public.remove_my_own_task(uuid),
  public.add_my_scheduled_task(jsonb), public.remove_my_scheduled_task(uuid),
  public.mark_scheduled_task_done(uuid, int), public.unmark_scheduled_task_done(uuid, int),
  public.mark_chore_done(uuid), public.unmark_chore_done(uuid),
  public.add_xp_to_item(text, int), public.set_item_colour(text, text), public.buy_item(text),
  public.open_mystery_box(), public.keep_new_item(text), public.claim_weekly_treasure(), public.claim_milestone_box(uuid, int),
  public.take_a_chance(text), public.save_mission_completion(text, int, boolean, boolean, boolean), public.load_progress_summary(),
  public.load_my_children(), public.load_child_overview(uuid), public.set_child_birth_month(uuid, int, int),
  public.add_child_task(uuid, jsonb), public.remove_child_task(uuid, uuid), public.update_child_settings(uuid, jsonb),
  public.create_grown_up_invite(uuid), public.link_child_with_code(text), public.unlink_child(uuid)
to authenticated;

grant execute on function public.create_child_profile(uuid, uuid, text, int, int), public.delete_child_data(uuid) to service_role;

-- Stop functions created later in these schemas being runnable by everyone by default.
alter default privileges in schema public revoke execute on functions from public, anon, authenticated;
alter default privileges in schema private revoke execute on functions from public, anon, authenticated;
