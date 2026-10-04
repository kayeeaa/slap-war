/* Tell a child when a grown-up adds tasks for them.
   Each task a grown-up adds (scheduled_tasks with set_by = 'parent') makes one child_notifications row. The app shows
   all of a child's unseen ones together in ONE pop-up next time they open the game, however many tasks were added.
   The grown-up's name is copied in, because a child can't read their grown-up's profile. */
create table public.child_notifications (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('task-added')),
  from_name text,          -- the grown-up who did it, as the child knows them (e.g. "Mum")
  task_title text,
  created_at timestamptz not null default now(),
  seen_at timestamptz
);
create index child_notifications_unseen on public.child_notifications (child_id) where seen_at is null;
alter table public.child_notifications enable row level security;
create policy "children read their own notifications" on public.child_notifications
  for select to authenticated using (child_id = (select auth.uid()));
grant select on public.child_notifications to authenticated, service_role;

-- Runs inside add_child_task, so auth.uid() is the grown-up who added it.
create or replace function private.notify_task_added() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.set_by = 'parent' then
    insert into public.child_notifications (child_id, kind, from_name, task_title)
    values (new.child_id, 'task-added',
            (select display_name from public.profiles where id = (select auth.uid())), new.title);
  end if;
  return new;
end $$;

drop trigger if exists notify_task_added on public.scheduled_tasks;
create trigger notify_task_added after insert on public.scheduled_tasks
  for each row execute function private.notify_task_added();

-- markMyNotificationsSeen(ids): the child has seen the pop-up.
create or replace function public.mark_my_notifications_seen(p_ids uuid[]) returns void
language plpgsql security definer set search_path = '' as $$
declare me uuid := private.require_child(false);
begin
  update public.child_notifications set seen_at = now()
  where child_id = me and id = any (coalesce(p_ids, '{}')) and seen_at is null;
end $$;

revoke execute on function private.notify_task_added() from public, anon, authenticated;
revoke execute on function public.mark_my_notifications_seen(uuid[]) from public, anon;
grant execute on function public.mark_my_notifications_seen(uuid[]) to authenticated;
