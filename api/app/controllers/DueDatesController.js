const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const dateFormat = require('dateformat');


router.post('/', (req, res) => {
  db.query('INSERT INTO due_dates SET ?', { date: req.body.date }, (error, results, fields) => {
    res.send({
      id: results.insertId,
      date: req.body.date
    });
  });
});

router.get('/:id', (req, res) => {
  db.query('SELECT * FROM due_dates WHERE id=?', [req.params.id], (_error, results, _fields) => {
    if (results.length === 0) {
      res.send({}, 404)
    } else {
      date = results[0];
      date.date = dateFormat(date.date, 'yyyy-mm-dd');
      res.send(date);
    }
  });
});

router.get('/', (req, res) => {
  db.query('SELECT * FROM due_dates', (_error, results, _fields) => {
    let dates = [];
    results.forEach( (result) => {
      result.date = dateFormat(result.date, 'yyyy-mm-dd');
      dates.push(result);
    });
    res.send(dates);
  });
});

router.put('/:id', (req, res) => {
  db.query('UPDATE due_dates SET ? WHERE id=?', [{ date: req.body.date }, req.params.id], (_error, results, _fields) => {
    if (results.affectedRows === 1) {
      res.send({
        id: parseInt(req.params.id),
        date: req.body.date
      });
    } else {
      res.send({}, 404)
    }
  })
});

router.delete('/:id', (req, res) => {
  db.query('DELETE FROM due_dates WHERE id=?', [req.params.id], (_error, results, _fields) => {
    if (results.affectedRows === 1) {
      res.send(null, 204);
    } else {
      res.send(null, 404)
    }
  });
});

module.exports = router;