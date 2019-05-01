process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../../index');
const factories = require('../support/factories');
let DatabaseCleaner = require('database-cleaner');
let databaseCleaner = new DatabaseCleaner('mysql');

chai.should();

let db = require('../../app/lib/db');

chai.use(chaiHttp);

describe('Assignments', () => {
  beforeEach((done) => {
    databaseCleaner.clean(db, done);
  });

  after(() => {
    app.stop();
  });

  describe('GET /assignments', () => {
    it('should GET all the assignments', (done) => {
      chai.request(app)
        .get('/assignments')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('POST /assignments', () => {
    let newAssignmentId;
    it('should POST an assignments', async () => {
      const fromPerson = await factories.createPerson({name: 'Foo Bar', initials: 'FB'});
      const toPerson = await factories.createPerson({name: 'To Person', initials: 'TP'});
      const dueDate = await factories.createDueDate({date: '2017-05-15'});

      const response = await chai.request(app).post('/assignments').send({"due_date_id": dueDate.id, "from_person_id": fromPerson.id, "to_person_id": toPerson.id, "complete": true});
      response.should.have.status(200);
      response.body.should.be.an('object');
      newAssignmentId = response.body['id'];
      response.body.should.deep.equal({"id": newAssignmentId, "due_date_id": dueDate.id, "from_person_id": fromPerson.id, "to_person_id": toPerson.id, "complete": true});
      const getResponse = await chai.request(app).get('/assignments');
      getResponse.should.have.status(200);
      getResponse.body.should.be.an('array');
      getResponse.body.should.deep.equal([{"id": newAssignmentId, "due_date_id": dueDate.id, "from_person_id": fromPerson.id, "to_person_id": toPerson.id, "complete": true}]);
    });
  })
});