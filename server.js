const express = require('express')
const path = require('path')
const app = express()

const pub = (rel) => path.join(__dirname, 'public', rel)

app.get('/menu',               (req, res) => res.sendFile(pub('menu/index.html')))
app.get('/slap-war',           (req, res) => res.sendFile(pub('slap-war/index.html')))
app.get('/planner',                (req, res) => res.sendFile(pub('planner/index.html')))
app.get('/planner/dashboard',      (req, res) => res.sendFile(pub('planner/dashboard/index.html')))
app.get('/planner/dashboard/kids', (req, res) => res.sendFile(pub('planner/dashboard/kids/index.html')))

app.use(express.static(pub('')))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
