const express = require('express')
const path = require('path')
const app = express()

app.get('/slap-war', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'slap-war', 'index.html'))
})

app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
