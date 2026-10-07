/* Games tab: mini-games that give XP. The first is ping pong against a bot buddy (first to 3 points).
   Needs 20261007090000_voxie_feature_flags.sql first: only children with the "games" feature can save a result.

   XP: 1 per point the child scores. If they've switched on "Lose my points if I lose" and lose the match, that
   match gives 0. Games give at most MAX_GAME_XP_PER_DAY (10) XP a day in total, so XP can't be farmed;
   keep this the same as MAX_GAME_XP_PER_DAY in engine/pong.js.
   Game XP is part of xpEarned, so it's spent like mission XP. */

create table public.game_results (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.profiles (id) on delete cascade,
  game text not null check (game in ('ping-pong')),
  played_on date not null,
  my_points smallint not null check (my_points between 0 and 3),
  bot_points smallint not null check (bot_points between 0 and 3),
  won boolean not null,
  lose_points_on_loss boolean not null,
  xp_awarded int not null check (xp_awarded >= 0),
  created_at timestamptz not null default now()
);
create index game_results_child_day on public.game_results (child_id, played_on);
alter table public.game_results enable row level security;
create policy "children read their own game results" on public.game_results
  for select to authenticated using (child_id = (select auth.uid()));
grant select on public.game_results to authenticated, service_role;

-- XP to spend now counts games as well as missions.
create or replace function private.xp_earned(p_child_id uuid) returns int
language sql stable set search_path = '' as $$
  select (coalesce((select sum(xp_awarded) from public.mission_completions where child_id = p_child_id), 0)
        + coalesce((select sum(xp_awarded) from public.game_results where child_id = p_child_id), 0))::int
$$;

/* saveGameResult(game, myPoints, botPoints, losePointsOnLoss) → { xpAwarded, won, hitDailyLimit }
   The match must be finished: one side on 3, the other on 0–2. */
create or replace function public.save_game_result(p_game text, p_my_points int, p_bot_points int, p_lose_points_on_loss boolean)
returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  me uuid := private.require_child();   -- locks the profile, so two results at once can't both pass the daily limit
  max_per_day constant int := 10;
  today date := private.today_uk();
  won boolean;
  earned int;
  already_today int;
  award int;
begin
  if not private.has_feature(me, 'games') then raise exception 'not-available'; end if;
  if p_game is distinct from 'ping-pong' then raise exception 'unknown-game'; end if;
  if p_my_points is null or p_bot_points is null or p_my_points not between 0 and 3 or p_bot_points not between 0 and 3
     or (p_my_points = 3) = (p_bot_points = 3) then
    raise exception 'bad-score';
  end if;
  won := p_my_points = 3;
  earned := case when not won and coalesce(p_lose_points_on_loss, false) then 0 else p_my_points end;
  select coalesce(sum(xp_awarded), 0) into already_today from public.game_results where child_id = me and played_on = today;
  award := least(earned, greatest(0, max_per_day - already_today));
  insert into public.game_results (child_id, game, played_on, my_points, bot_points, won, lose_points_on_loss, xp_awarded)
  values (me, p_game, today, p_my_points, p_bot_points, won, coalesce(p_lose_points_on_loss, false), award);
  return jsonb_build_object('xpAwarded', award, 'won', won, 'hitDailyLimit', award < earned);
end $$;

revoke execute on function public.save_game_result(text, int, int, boolean) from public, anon;
grant execute on function public.save_game_result(text, int, int, boolean) to authenticated;
