# Voxie feature flags: rolling out new features per user

Use a feature flag to give a new feature to chosen users first, such as `kaytest` or your own family, and then to everyone.

## Set up (once)

Paste `supabase/migrations/20261007090000_voxie_feature_flags.sql` into the Supabase SQL Editor and run it.

## How it fits together

| Part | Where | What it does |
|---|---|---|
| `features` table | Supabase | One row per feature: its id, a description and its rollout (`off`, `chosen` or `everyone`). |
| `feature_users` table | Supabase | The users chosen for each feature. |
| `profile.features` | `my_profile` view, and every RPC that returns the profile | The signed-in user's features, e.g. `["pet-races"]`. |
| `featureOn("pet-races")` | `public/voxie/app.js` | `true` if the signed-in user has the feature. Works for children and grown-ups. |
| `private.has_feature(me, 'pet-races')` | SQL | Server-side check, for RPCs that only users with the feature may call. |

The app can't read or change the flag tables. You manage them only from the SQL Editor, so nobody can turn a feature on for themselves.

A user picks up a change the next time they open or refresh the game.

## Adding a new feature (on its branch)

1. Pick an id: lower case with dashes, e.g. `pet-races`.
2. In the app, wrap the new feature's buttons, screens or behaviour in `featureOn("pet-races")`:
   ```js
   if (featureOn("pet-races")) element("raceButton").hidden = false;
   ```
3. If the feature has new RPCs, check the flag on the server too, so it can't be used by calling the RPC directly:
   ```sql
   if not private.has_feature(me, 'pet-races') then raise exception 'not-available'; end if;
   ```
4. In the SQL Editor, add the feature and choose who gets it:
   ```sql
   select private.add_feature('pet-races', 'Race your buddy against friends');
   select private.turn_feature_on_for('pet-races', 'kaytest');                          -- a child, by username
   select private.turn_feature_on_for('pet-races', 'you@example.com', true);            -- a grown-up and all their children
   ```
   A new feature starts as `chosen`, so only the users you choose get it.

## Managing features

```sql
select * from private.feature_report;                            -- every feature, its rollout and who has it
select private.turn_feature_off_for('pet-races', 'kaytest');     -- take it off one user
select private.set_feature_rollout('pet-races', 'everyone');     -- release it to everyone
select private.set_feature_rollout('pet-races', 'off');          -- switch it off for everyone; the chosen list is kept
select private.set_feature_rollout('pet-races', 'chosen');       -- back to just the chosen users
```

## Once a feature is out for good

Once a feature has been `everyone` for a while and is staying:

1. Remove the `featureOn` and `has_feature` checks from the code.
2. Delete the flag: `delete from public.features where id = 'pet-races';` (this also clears its chosen users).

Removing the checks first means nobody loses the feature in between.
