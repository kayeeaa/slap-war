/* Snap in the Games tab, and a daily XP limit for EACH game (10 XP a day from Pong pong, 10 from Snap) instead of
   one limit shared by all games. Run after 20261007100000_voxie_games.sql.

   Snap XP: 3 for winning (finishing above 0), 1 for trying. With "Lose my points if I lose" on, losing gives 0.
   Keep MAX_GAME_XP_PER_DAY in app.js the same as max_per_day below. */

alter table public.game_results drop constraint game_results_game_check;
alter table public.game_results add constraint game_results_game_check check (game in ('ping-pong', 'snap'));
-- Pong pong fills in my_points / bot_points; Snap fills in mode / score.
alter table public.game_results alter column my_points drop not null, alter column bot_points drop not null;
alter table public.game_results add column mode text check (mode in ('classic', 'hard', 'extreme')), add column score int;

/* Gives up to p_earned XP for p_game, keeping that game under its daily limit. Call with the child's profile locked. */
create or replace function private.game_xp_to_award(p_child_id uuid, p_game text, p_earned int) returns int
language sql stable set search_path = '' as $$
  select least(p_earned, greatest(0, 10 - coalesce((
    select sum(xp_awarded) from public.game_results
    where child_id = p_child_id and game = p_game and played_on = private.today_uk()), 0)))::int
$$;

-- Pong pong: as before, but the daily limit only counts Pong pong.
create or replace function public.save_game_result(p_game text, p_my_points int, p_bot_points int, p_lose_points_on_loss boolean)
returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  me uuid := private.require_child();   -- locks the profile, so two results at once can't both pass the daily limit
  won boolean;
  earned int;
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
  award := private.game_xp_to_award(me, p_game, earned);
  insert into public.game_results (child_id, game, played_on, my_points, bot_points, won, lose_points_on_loss, xp_awarded)
  values (me, p_game, private.today_uk(), p_my_points, p_bot_points, won, coalesce(p_lose_points_on_loss, false), award);
  return jsonb_build_object('xpAwarded', award, 'won', won, 'hitDailyLimit', award < earned);
end $$;

/* saveSnapResult(mode, score, losePointsOnLoss) → { xpAwarded, won, hitDailyLimit }
   score is the scored half's total: +5 a snap, -5 a miss, so always a multiple of 5. Won means above 0. */
create or replace function public.save_snap_result(p_mode text, p_score int, p_lose_points_on_loss boolean)
returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  me uuid := private.require_child();
  won boolean;
  earned int;
  award int;
begin
  if not private.has_feature(me, 'games') then raise exception 'not-available'; end if;
  if p_mode is null or p_mode not in ('classic', 'hard', 'extreme') then raise exception 'bad-mode'; end if;
  if p_score is null or p_score % 5 <> 0 or p_score not between -1000 and 1000 then raise exception 'bad-score'; end if;
  won := p_score > 0;
  earned := case when won then 3 when coalesce(p_lose_points_on_loss, false) then 0 else 1 end;
  award := private.game_xp_to_award(me, 'snap', earned);
  insert into public.game_results (child_id, game, played_on, mode, score, won, lose_points_on_loss, xp_awarded)
  values (me, 'snap', private.today_uk(), p_mode, p_score, won, coalesce(p_lose_points_on_loss, false), award);
  return jsonb_build_object('xpAwarded', award, 'won', won, 'hitDailyLimit', award < earned);
end $$;

revoke execute on function private.game_xp_to_award(uuid, text, int) from public, anon, authenticated;
revoke execute on function public.save_snap_result(text, int, boolean) from public, anon;
grant execute on function public.save_snap_result(text, int, boolean) to authenticated;
