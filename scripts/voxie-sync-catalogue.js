/* Voxie: fill the Supabase catalogue tables from the game's content files.
   The server works out prices, powers, chance and mission XP from these tables, so run this whenever
   items, missions or powers change:

     SUPABASE_SERVICE_ROLE_KEY=... node scripts/voxie-sync-catalogue.js

   It upserts (adds new rows, updates changed ones) and never deletes, so a removed item can't break
   a child's history. The service_role key must only ever be used from your own machine, never the browser. */
const fs = require('fs')
const path = require('path')
const vm = require('vm')

const SUPABASE_URL = process.env.VOXIE_SUPABASE_URL || 'https://gtazlqzloumjzzybrfpa.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const CONTENT = path.join(__dirname, '..', 'public', 'voxie', 'content')

// Content files are browser ES modules ("export default { ... }"); read them without a bundler.
function loadContentFolder(folder) {
  return fs.readdirSync(path.join(CONTENT, folder)).filter(name => name.endsWith('.js')).sort().map(name => {
    const source = fs.readFileSync(path.join(CONTENT, folder, name), 'utf8').replace(/^\s*export default\s+/m, 'module.exports = ')
    const sandbox = { module: {} }
    vm.runInNewContext(source, sandbox, { filename: `${folder}/${name}` })
    return sandbox.module.exports
  })
}
function loadPowers() {
  const source = fs.readFileSync(path.join(CONTENT, 'powers.js'), 'utf8') + '\n;POWERS'
  return vm.runInNewContext(source, {}, { filename: 'powers.js' })
}

const itemRows = loadContentFolder('items').map(item => ({
  id: item.id,
  category: item.category,
  slot: item.slot || null,
  rarity: item.rarity,
  unlock_level: item.unlockLevel ?? null,
  xp_price: item.xpPrice ?? null,
  chance_only: item.chanceOnly === true,
  chance_within_rarity: item.chanceWithinRarity ?? 1,
  abilities: item.abilities || {}
}))
const missionRows = loadContentFolder('missions').map(mission => ({
  id: mission.id,
  type: mission.type,
  difficulty: mission.difficulty,
  min_age: mission.ages[0],
  max_age: mission.ages[1],
  correct_index: mission.correctIndex ?? null,
  good_choice_indexes: mission.type === 'scenario'
    ? mission.options.map((option, index) => (option.isGoodChoice ? index : null)).filter(index => index !== null)
    : null
}))
const powerRows = loadPowers().map(power => ({ id: power.id, advanced_value: power.values.advanced, master_value: power.values.master }))
// Places and looks, which each new buddy gets in its own shuffled order (option_catalogue).
function loadLooks() {
  const source = fs.readFileSync(path.join(CONTENT, 'customise.js'), 'utf8') + '\n;({ BODY_COLOURS, FACES, ARM_POSES, BODY_WIDTHS, BODY_HEIGHTS })'
  return vm.runInNewContext(source, {}, { filename: 'customise.js' })
}
const looks = loadLooks()
const optionRows = [
  ...loadContentFolder('locations').map(location => ({ kind: 'location', id: location.id, unlock_level: location.unlockLevel })),
  ...[['body-colour', looks.BODY_COLOURS], ['face', looks.FACES], ['arms', looks.ARM_POSES], ['width', looks.BODY_WIDTHS], ['height', looks.BODY_HEIGHTS]]
    .flatMap(([kind, options]) => options.map(option => ({ kind, id: option.id, unlock_level: option.unlockLevel })))
]

async function upsert(table, rows, conflictColumns = 'id') {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?on_conflict=${conflictColumns}`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal'
    },
    body: JSON.stringify(rows)
  })
  if (!response.ok) throw new Error(`${table}: ${response.status} ${await response.text()}`)
  console.log(`${table}: ${rows.length} rows`)
}

;(async () => {
  if (!SERVICE_KEY) { console.error('Set SUPABASE_SERVICE_ROLE_KEY first (Supabase dashboard → Project Settings → API).'); process.exit(1) }
  await upsert('power_catalogue', powerRows)
  await upsert('item_catalogue', itemRows)
  await upsert('mission_catalogue', missionRows)
  await upsert('option_catalogue', optionRows, 'kind,id')
})().catch(error => { console.error(error.message); process.exit(1) })
