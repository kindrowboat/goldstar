var express = require('express');
var router = express.Router();
const db = require('../lib/db');

router.post('/', (req, res) => {
  db.query('INSERT INTO people SET ?', { name: req.body.name, initials: req.body.initials }, (error, results, fields) => {
    res.send({
      id: results.insertId,
      name: req.body.name,
      initials: req.body.initials
    });
  });
});

router.get('/:id', (req, res) => {
  db.query('SELECT * FROM people WHERE id=?', [req.params.id], (_error, results, _fields) => {
    if (results.length === 0) {
      res.send({}, 404)
    } else {
      res.send(results[0]);
    }
  });
});

router.get('/', (req, res) => {
  db.query('SELECT * FROM people', (_error, results, _fields) => {
    res.send(results);
  });
});

router.put('/:id', (req, res) => {
  db.query('UPDATE people SET ? WHERE id=?', [{ name: req.body.name, initials: req.body.initials}, req.params.id], (_error, results, _fields) => {
    if (results.affectedRows === 1) {
      res.send({
        id: parseInt(req.params.id),
        name: req.body.name,
        initials: req.body.initials
      });
    } else {
      res.send({}, 404)
    }
  })
});

router.delete('/:id', (req, res) => {
  db.query('DELETE FROM people WHERE id=?', [req.params.id], (_error, results, _fields) => {
    if (results.affectedRows === 1) {
      res.send(null, 204);
    } else {
      res.send(null, 404)
    }
  });
});

module.exports = router;