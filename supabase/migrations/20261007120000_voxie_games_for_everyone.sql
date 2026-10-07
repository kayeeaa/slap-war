/* Games for everyone: Ping pong and Snap no longer need the "games" feature flag. Run after 20261007110000_voxie_snap.sql.
   The feature-flag tables and helpers (20261007090000_voxie_feature_flags.sql) stay, ready for the next feature to hide
   behind a flag; only the "games" flag itself is removed. Everything else about saving results and XP is unchanged. */

-- Ping pong
create or replace function public.save_game_result(p_game text, p_my_points int, p_bot_points int, p_lose_points_on_loss boolean)
returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  me uuid := private.require_child();   -- locks the profile, so two results at once can't both pass the daily limit
  won boolean;
  earned int;
  award int;
begin
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

-- Snap
create or replace function public.save_snap_result(p_mode text, p_score int, p_lose_points_on_loss boolean)
returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  me uuid := private.require_child();
  won boolean;
  earned int;
  award int;
begin
  if p_mode is null or p_mode not in ('classic', 'hard') then raise exception 'bad-mode'; end if;
  if p_score is null or p_score % 5 <> 0 or p_score not between -1000 and 1000 then raise exception 'bad-score'; end if;
  won := p_score > 0;
  earned := case when won then 3 when coalesce(p_lose_points_on_loss, false) then 0 else 1 end;
  award := private.game_xp_to_award(me, 'snap', earned);
  insert into public.game_results (child_id, game, played_on, mode, score, won, lose_points_on_loss, xp_awarded)
  values (me, 'snap', private.today_uk(), p_mode, p_score, won, coalesce(p_lose_points_on_loss, false), award);
  return jsonb_build_object('xpAwarded', award, 'won', won, 'hitDailyLimit', award < earned);
end $$;

-- "create or replace" keeps the existing grants, but say them again so this file stands on its own.
revoke execute on function public.save_game_result(text, int, int, boolean) from public, anon;
grant execute on function public.save_game_result(text, int, int, boolean) to authenticated;
revoke execute on function public.save_snap_result(text, int, boolean) from public, anon;
grant execute on function public.save_snap_result(text, int, boolean) to authenticated;

-- The "games" flag isn't used any more (this also clears its chosen users). The flag tables stay.
delete from public.features where id = 'games';

notify pgrst, 'reload schema';
