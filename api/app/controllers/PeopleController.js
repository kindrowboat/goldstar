const express = require('express');
const router = express.Router();
const db = require('../lib/db');

router.post('/', (req, res) => {
  const name = req.body.name;
  const initials = req.body.initials;
  const errors = validateParams(req.body);

  if(Object.keys(errors).length > 0) {
    res.send({errors: errors}, 400);
    return;
  }

  db.query('INSERT INTO people SET ?', { name: name, initials: initials }, (error, results, fields) => {
    if (error) {
      res.send({}, 500);
    } else {
      res.send({
        id: results.insertId,
        name: name,
        initials: req.body.initials
      });
    }
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
  const errors = validateParams(req.body);

  if(Object.keys(errors).length > 0) {
    res.send({errors: errors}, 400);
    return;
  }

  db.query('UPDATE people SET ? WHERE id=?', [{ name: req.body.name, initials: req.body.initials}, req.params.id], (error, results, _fields) => {
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

const validateParams = (params) => {
  const name = params.name;
  const initials = params.initials;
  const errors = {};

  if(!name) {
    errors['name'] = 'must be present';
  }

  if(!initials) {
    errors['initials'] = 'must be present';
  }

  return errors;
};

module.exports = router;