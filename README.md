# House of Kay

> **⚠️ Never commit or push without checking with Kay first.**

A family web app with two parts: a family planner for daily schedules and meals, and Slap War (an isometric dungeon game).

---

## Routes

| URL | What it is |
|---|---|
| `/` | Redirects to `/menu/` |
| `/menu/` | Hub — choose Planner or Game |
| `/planner/` | Family planner (profile picker) |
| `/planner/create/` | First-time PIN setup for a profile |
| `/planner/pin/` | PIN entry screen |
| `/planner/onboarding/` | Food preference questionnaire (first login only) |
| `/planner/dashboard/` | Daily/weekly plan view |
| `/slap-war/` | Isometric dungeon game |

---

## Setup

### 1. Install dependencies

```
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free project
2. In **SQL Editor**, run the full schema from the **Database Schema** section below
3. Go to **Project Settings → API** and copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon public** key
4. Copy the config template:
   ```
   cp public/js/supabase-config.example.js public/js/supabase-config.js
   ```
5. Open `public/js/supabase-config.js` and paste your URL and anon key
6. **Confirm** `public/js/supabase-config.js` is in `.gitignore` — never commit this file

> The anon key is safe in client-side code. It is a public key designed for browser use; Row Level Security policies control what it can access.

### 3. Start the server

```
npm start
```

Visit `http://localhost:3000`

---

## Database Schema

Run this in the Supabase SQL Editor to create all tables:

```sql
-- PROFILES (one row per family member)
create table public.profiles (
  id           uuid primary key default gen_random_uuid(),
  name         text not null unique,
  color        text not null,
  color_name   text not null,
  pin_hash     text not null,
  is_parent    boolean not null default false,
  created_at   timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles_select" on public.profiles for select to anon using (true);
create policy "profiles_insert" on public.profiles for insert to anon with check (true);

-- FOOD PREFERENCES
create table public.food_preferences (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  likes       text[],
  dislikes    text[],
  allergies   text[],
  notes       text,
  updated_at  timestamptz not null default now()
);
alter table public.food_preferences enable row level security;
create policy "food_prefs_select" on public.food_preferences for select to anon using (true);
create policy "food_prefs_insert" on public.food_preferences for insert to anon with check (true);
create policy "food_prefs_update" on public.food_preferences for update to anon using (true);

-- FAMILY CONFIG (single row — shared settings for the whole family)
-- dad_weekend_ref_sat: a Saturday that IS a "dad's weekend"; used to calculate alternating pattern
-- child_lunch_defaults: {"Jenson": "Hot meal", "Roux": "Packed"} — set by Kay during setup
-- child_pe_days: {"Jenson": [2, 4], "Roux": [3]} — day numbers (1=Mon, 5=Fri), set by Kay
-- kids_at_dads_override: null = auto-calculate, true = at dad's (override), false = home (override)
-- kids_at_dads_override_week: the Monday of the week when the override was set
create table public.family_config (
  id                       uuid primary key default gen_random_uuid(),
  dad_weekend_ref_sat      date not null,
  dad_wednesday_pickup     boolean not null default false,
  dad_wednesday_feeds      boolean not null default false,
  child_lunch_defaults     jsonb not null default '{}',
  child_pe_days            jsonb not null default '{}',
  kids_at_dads_override    boolean,
  kids_at_dads_override_week date,
  updated_at               timestamptz not null default now()
);
alter table public.family_config enable row level security;
create policy "family_config_select" on public.family_config for select to anon using (true);
create policy "family_config_insert" on public.family_config for insert to anon with check (true);
create policy "family_config_update" on public.family_config for update to anon using (true);

-- TIMETABLE (static weekly lesson schedule — full timetable added in Phase 4 admin)
-- PE days are stored in family_config.child_pe_days for now
create table public.timetable (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid not null references public.profiles(id) on delete cascade,
  day_of_week  smallint not null check (day_of_week between 1 and 5),
  period       smallint not null,
  subject      text not null,
  room         text,
  teacher      text,
  is_pe        boolean not null default false,
  unique (profile_id, day_of_week, period)
);
alter table public.timetable enable row level security;
create policy "timetable_select" on public.timetable for select to anon using (true);
create policy "timetable_insert" on public.timetable for insert to anon with check (true);

-- DAILY PLANS (one row per profile per date — school_lunch overrides family_config default)
create table public.daily_plans (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid not null references public.profiles(id) on delete cascade,
  plan_date    date not null,
  school_lunch text,
  dinner       text,
  notes        text,
  updated_at   timestamptz not null default now(),
  unique (profile_id, plan_date)
);
alter table public.daily_plans enable row level security;
create policy "daily_plans_select" on public.daily_plans for select to anon using (true);
create policy "daily_plans_insert" on public.daily_plans for insert to anon with check (true);
create policy "daily_plans_update" on public.daily_plans for update to anon using (true);

-- MEALS (Phase 5 — created now, populated later by AI)
create table public.meals (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  macros_kcal     numeric,
  macros_protein  numeric,
  macros_carbs    numeric,
  macros_fat      numeric,
  tags            text[],
  created_at      timestamptz not null default now()
);
alter table public.meals enable row level security;
create policy "meals_select" on public.meals for select to anon using (true);

-- MEAL PLAN ITEMS (Phase 5)
create table public.meal_plan_items (
  id            uuid primary key default gen_random_uuid(),
  daily_plan_id uuid not null references public.daily_plans(id) on delete cascade,
  meal_id       uuid references public.meals(id),
  meal_slot     text not null,
  custom_meal   text,
  created_at    timestamptz not null default now()
);
alter table public.meal_plan_items enable row level security;
create policy "meal_plan_items_select" on public.meal_plan_items for select to anon using (true);
create policy "meal_plan_items_insert" on public.meal_plan_items for insert to anon with check (true);
```

### If you already ran the old schema (migration SQL)

```sql
-- Remove columns that are no longer used
alter table public.daily_plans drop column if exists pickup_person;
alter table public.daily_plans drop column if exists pickup_time;
alter table public.food_preferences drop column if exists dietary_needs;

-- Add the new family_config table (see above)
```

---

## Architecture

**Stack**: Node.js + Express (static file server), Vanilla JS, Supabase (database + future edge functions)

**No build tools** — all JS is plain browser-native. Supabase client loaded from CDN.

**Auth**: Profiles are stored in Supabase. Each child sets their own PIN (stored as SHA-256 hash). Session held in `sessionStorage` — closing the browser tab logs you out.

```
public/
├── index.html            → instant redirect to /menu/
├── menu/index.html       → hub page
├── slap-war/index.html   → game
│   ├── slap-war/style.css    → shared + game-screen styles
│   └── slap-war/home.css     → home/start-screen styles (Fonts, pills, tooltips, clouds)
├── js/
│   ├── supabase-config.example.js   ← commit this
│   ├── supabase-config.js           ← DO NOT COMMIT (gitignored)
│   └── auth.js           → shared session + PIN hash helpers
└── planner/
    ├── index.html         → profile picker
    ├── create/index.html  → first-time PIN creation
    ├── pin/index.html     → PIN entry
    ├── onboarding/        → food preference questionnaire
    └── dashboard/         → daily/weekly plan view
```

---

## Phases

| Phase | What | Status |
|---|---|---|
| 1 | Supabase setup, remove site PIN, profile creation with child-set PINs | ✅ Done |
| 2 | Food preference questionnaire — Kay gets extra steps for family config + children's school info | ✅ Done |
| 3 | Dashboard: Day/Week/Meals/Lessons/Family tabs. Alternating weekend, Wednesday dad toggles, school lunch defaults, PE days | ✅ Done |
| 4 | Parent admin view — enter plan data, manage profiles | 🔜 Next |
| 5 | AI meal planning with macros + shopping list | 🔮 Future |

---

## Environment

| Variable | Default | Notes |
|---|---|---|
| `PORT` | `3000` | Set to override the server port |

Frontend Supabase credentials live in `public/js/supabase-config.js` (not an env var — no build tool).
