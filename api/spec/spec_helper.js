process.env.NODE_ENV = 'test';
require('dotenv').config();
const app = require('../index');
const DatabaseCleaner = require('database-cleaner');
const databaseCleaner = new DatabaseCleaner('mysql');
const db = require('../app/lib/db');

beforeEach((done) => {
  databaseCleaner.clean(db, done);
});

after(() => {
  app.stop();
});