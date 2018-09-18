const express = require('express')
const app = express()

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))

app.use('/scripts', express.static('scripts'))
app.use('/assets', express.static('assets'))

app.listen(3000, () => console.log('server listening on port 3000!'))