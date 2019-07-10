const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const combinations = require('../lib/combinations');
const dateFormat = require('dateformat');

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
  db.query('SELECT * FROM People', async (_error, results, _fields) => {
    const people = results;
    const peopleIds = people.map(person => person.id);
    const remainingPairs = combinations(peopleIds);
    const assignments = [];
    const feedbackPairsPerWeek = Math.floor(people.length / 2);
    const totalWeeks = feedbackPairsPerWeek * 2 + 1;
    let skipped = [];
    let newDueDateId;
    for (let i = 0; i < totalWeeks; i++) {
      let currentDate = new Date(req.body.startDate);
      currentDate.setDate(currentDate.getDate() + 7*i );

      newDueDateId = await new Promise((resolve, reject) => {
        db.query('INSERT INTO due_dates SET ?', { date: dateFormat(currentDate.date, 'yyyy-mm-dd') }, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results.insertId);
          }
        });
      });
      const picked = [];
      for (let j = 0; j < feedbackPairsPerWeek; j++) {
        let pairIndex;
        if(skipped.length === 0){
          pairIndex = remainingPairs.findIndex(candidate => !(picked.includes(candidate[0]) || picked.includes(candidate[1])));
        } else {
          pairIndex = remainingPairs.findIndex(candidate => !(picked.includes(candidate[0]) || picked.includes(candidate[1])) && (skipped.includes(candidate[0]) || skipped.includes(candidate[1])));
          const pair = remainingPairs[pairIndex];
          skipped = skipped.filter(personId => !pair.includes(personId));
        }

        const pair = remainingPairs[pairIndex];

        if(pair) {
          assignments.push({from_person_id: pair[0], to_person_id: pair[1], due_date_id: newDueDateId});
          assignments.push({from_person_id: pair[1], to_person_id: pair[0], due_date_id: newDueDateId});
          picked.push(pair[0]);
          picked.push(pair[1]);
          remainingPairs.splice(pairIndex, 1);
        }
      }
      skipped = peopleIds.filter(personId => (picked.indexOf(personId) === -1));
    }

    const assignmentMap = assignments.map(assignment => [assignment.from_person_id, assignment.to_person_id, assignment.due_date_id])
    console.log(assignmentMap);
    db.query('INSERT INTO assignments (from_person_id, to_person_id, due_date_id) VALUES ?', [assignmentMap], (error, results, fields) => {
      if (error) {
        console.log(error);
        res.send({}, 500);
      } else {
        res.status(200).send(assignments);
      }
    });
  });
});

module.exports = router;