/* The service role (Edge Functions and scripts/voxie-sync-catalogue.js only, never the browser) needs table access.
   New Supabase projects don't grant it by default, and the main migration only granted function access.
   - Edge Functions read profiles and family_links to check the caller is the child's grown-up.
   - The catalogue script upserts the three *_catalogue tables from the content files. */
grant usage on schema public to service_role;
grant select on all tables in schema public to service_role;
grant insert, update on public.item_catalogue, public.mission_catalogue, public.power_catalogue to service_role;
