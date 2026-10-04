/* Fix: adding a child failed with "bad-email".
   The add-child Edge Function creates the child's auth user with app_metadata.voxie_role = 'child', but Supabase Auth
   writes app_metadata AFTER the auth.users row is inserted, so the insert trigger never saw it and rejected the
   hidden "<id>@kids.voxie.invalid" address.

   Now any hidden child address simply gets no automatic profile: the add-child function makes the child's profile
   itself (create_child_profile, service role only). This is still safe: a public sign-up with a hidden address can
   never confirm it (nobody receives mail at .invalid), and without a profile row every RPC refuses it. */
create or replace function private.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if coalesce(new.raw_app_meta_data ->> 'voxie_role', '') = 'child'
     or lower(coalesce(new.email, '')) like '%@kids.voxie.invalid' then
    return new;
  end if;
  insert into public.profiles (id, role, display_name)
  values (new.id, 'parent', left(coalesce(nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''), 'Grown-up'), 30));
  return new;
end $$;
revoke execute on function private.handle_new_user() from public, anon, authenticated;
