// Ignore the javascript for now. Not needed for assignment 1
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send("Welcome to setting up Node.js project tutorial!"))

app.listen(port, () => console.log(`Application listening on port ${port}!`))
