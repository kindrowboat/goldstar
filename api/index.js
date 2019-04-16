require('dotenv').config()
const express = require('express')
const db = require('./lib/db');

const app = express()
const port = 3000
app.use(express.json({type: '*/*'}))

app.post('/people', (req, res) => {
  db.query('INSERT INTO people SET ?', { name: req.body.name, initials: req.body.initials }, (error, results, fields) => {
    res.send({
      id: results.insertId,
      name: req.body.name,
      initials: req.body.initials
    });
  });
})

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
