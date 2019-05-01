require('dotenv').config();
const PeopleController = require('./app/controllers/PeopleController.js');
const DueDatesController = require('./app/controllers/DueDatesController.js');
const AssignmentsController = require('./app/controllers/AssignmentsController.js');
const express = require('express');
const db = require('./app/lib/db');

const app = express();
let port;

if (process.env.NODE_ENV === 'test') {
  port = 4000;
} else {
  port = 3000;
}

app.use(express.json({type: '*/*'}));
app.use('/people', PeopleController);
app.use('/due_dates', DueDatesController);
app.use('/assignments', AssignmentsController);

app.get('/', (req, res) => res.send('Hello World!'));

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
module.exports.stop = () => {
  db.destroy();
  server.close();
};