const express = require('express');
const router = express.Router();
const db = require('../lib/db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM assignments', (_error, results, _fields) => {
    results.forEach(result => normalizeAssignment(result));
    res.send(results);
  });
});

router.get('/:id', (req, res) => {
  db.query('SELECT * FROM assignments WHERE id=?', [req.params.id], (_error, results, _fields) => {
    if (results.length === 0) {
      res.status(404).send({});
    } else {
      results.forEach(result => normalizeAssignment(result));
      res.send(results[0]);
    }
  });
});

router.post('/', (req, res) => {
  const dueDateId = req.body.due_date_id;
  const toPersonId = req.body.to_person_id;
  const fromPersonId = req.body.from_person_id;
  const complete = req.body.complete;

  db.query('INSERT INTO assignments SET ?', { due_date_id: dueDateId, to_person_id: toPersonId, from_person_id: fromPersonId, complete: complete }, (error, results, fields) => {
    if (error) {
      console.log(error);
      res.send({}, 500);
    } else {
      res.send({
        id: results.insertId,
        due_date_id: dueDateId,
        to_person_id: toPersonId,
        from_person_id: fromPersonId,
        complete: complete
      });
    }
  });
});

router.put('/:assignment_id', (req, res) => {
  const dueDateId = req.body.due_date_id;
  const toPersonId = req.body.to_person_id;
  const fromPersonId = req.body.from_person_id;
  const complete = req.body.complete;

  db.query('UPDATE assignments SET ? WHERE id=?', [{ due_date_id: dueDateId, to_person_id: toPersonId, from_person_id: fromPersonId, complete: complete }, req.params.assignment_id], (error, results, fields) => {
    if (error) {
      console.log(error);
      res.send({}, 500);
    } else if (results.affectedRows === 1) {
      res.send({
        id: parseInt(req.params.assignment_id),
        due_date_id: dueDateId,
        to_person_id: toPersonId,
        from_person_id: fromPersonId,
        complete: complete
      });
    }
    else {
      res.status(404).send(null);
    }
  });
});

router.delete('/:id', (req, res) => {
  db.query('DELETE FROM assignments WHERE id=?', [req.params.id], (_error, results, _fields) => {
    if (results.affectedRows === 1) {
      res.status(204).send(null);
    } else {
      res.status(404).send(null);
    }
  });
});

function normalizeAssignment(assignment) {
  assignment.complete = !!assignment.complete
}

router.post('/auto_assign', (req, res) => {
  db.query('SELECT * FROM People', (_error, results, _fields) => {
    const people = results;

    // for each people, get a list of remaining people, subtract people already given feedback to
    const all_people_ids = people.map(peep => peep.id);
    const assignments = [];
    people.forEach(person => {
      db.query('SELECT * FROM People JOIN Assignments ON People.id == Assignment.from_person_id'
      eligiblePeople = all_people_ids.filter(id => id !== person.id && !already_assigned.includes(id))
    });


    // for each people, select the first one on the list, add to 'selected list'
    // compare the to_person to selected list, if it already exists, move to next one, and add to 'selected list', and repeat
    const assignments = people.map(peep => ({
      to_person_id: 1
    }));
    res.status(200).send(assignments);
  });
});

module.exports = router;