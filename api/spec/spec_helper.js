let app = require('../index');
let DatabaseCleaner = require('database-cleaner');
let databaseCleaner = new DatabaseCleaner('mysql');
let db = require('../app/lib/db');

beforeEach((done) => {
  databaseCleaner.clean(db, done);
});

after(() => {
  app.stop();
});