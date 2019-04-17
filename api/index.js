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
});

app.get('/people/:id', (req, res) => {
  db.query('SELECT * FROM people WHERE id=?', [req.params.id], (_error, results, _fields) => {
    if (results.length === 0) {
      res.send({}, 404)
    } else {
      res.send(results[0]);
    }
  });
});

app.put('/people/:id', (req, res) => {
  db.query('UPDATE people SET ? WHERE id=?', [{ name: req.body.name, initials: req.body.initials}, req.params.id], (_error, results, _fields) => {
    if (results.affectedRows === 1) {
      res.send({
        id: results.insertId,
        name: req.body.name,
        initials: req.body.initials
      });
    } else {
      res.send({}, 404)
    }
  })
});

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
