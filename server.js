const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()

const pub = (rel) => path.join(__dirname, 'public', rel)

// Voxie content: one file per item/pet/location/mission. The game imports every file listed here,
// so adding content is just dropping a file into the folder.
const listVoxieContent = (folder) => {
  try { return fs.readdirSync(pub(`voxie/content/${folder}`)).filter(name => name.endsWith('.js')).sort() }
  catch (error) { return [] }
}
app.get('/voxie/content-manifest.json', (req, res) => res.json({
  items: listVoxieContent('items'), pets: listVoxieContent('pets'),
  locations: listVoxieContent('locations'), missions: listVoxieContent('missions')
}))

app.get('/menu',               (req, res) => res.sendFile(pub('menu/index.html')))
app.get('/slap-war',           (req, res) => res.sendFile(pub('slap-war/index.html')))
app.get('/voxie',              (req, res) => res.sendFile(pub('voxie/index.html')))
app.get('/planner',              (req, res) => res.sendFile(pub('planner/index.html')))
app.get('/planner/dashboard',      (req, res) => res.sendFile(pub('planner/dashboard/index.html')))
app.get('/planner/dashboard/kids', (req, res) => res.sendFile(pub('planner/dashboard/kids/index.html')))

app.use(express.static(pub('')))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
