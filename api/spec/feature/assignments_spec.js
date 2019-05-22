process.env.NODE_ENV = 'test';

require('../spec_helper');
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../../index');
const factories = require('../support/factories');

chai.should();

chai.use(chaiHttp);

describe('Assignments', () => {

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

  describe('GET /assignments/:id', () => {
    let newAssignmentId;
    it('should get the specified assignment', async () => {
      const fromPerson = await factories.createPerson({name: 'Foo Bar', initials: 'FB'});
      const toPerson = await factories.createPerson({name: 'To Person', initials: 'TP'});
      const dueDate = await factories.createDueDate({date: '2017-05-15'});

      const response = await chai.request(app).post('/assignments').send({"due_date_id": dueDate.id, "from_person_id": fromPerson.id, "to_person_id": toPerson.id, "complete": true});
      response.should.have.status(200);
      response.body.should.be.an('object');
      newAssignmentId = response.body['id'];
      response.body.should.deep.equal({"id": newAssignmentId, "due_date_id": dueDate.id, "from_person_id": fromPerson.id, "to_person_id": toPerson.id, "complete": true});
      const getResponse = await chai.request(app).get(`/assignments/${newAssignmentId}`);
      getResponse.should.have.status(200);
      getResponse.body.should.be.an('object');
      getResponse.body.should.deep.equal({"id": newAssignmentId, "due_date_id": dueDate.id, "from_person_id": fromPerson.id, "to_person_id": toPerson.id, "complete": true});
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
  });

  describe('PUT /assignments', () => {
    let newAssignmentId;
    it('should POST an assignments', async () => {
      const fromPerson = await factories.createPerson({name: 'Foo Bar', initials: 'FB'});
      const firstToPerson = await factories.createPerson({name: 'To Person', initials: 'TP'});
      const secondToPerson = await factories.createPerson({name: 'The Real To Person', initials: 'TRTP'});
      const dueDate = await factories.createDueDate({date: '2017-05-15'});

      const response = await chai.request(app).post('/assignments').send({"due_date_id": dueDate.id, "from_person_id": fromPerson.id, "to_person_id": firstToPerson.id, "complete": true});
      response.should.have.status(200);
      response.body.should.be.an('object');
      newAssignmentId = response.body['id'];
      response.body.should.deep.equal({"id": newAssignmentId, "due_date_id": dueDate.id, "from_person_id": fromPerson.id, "to_person_id": firstToPerson.id, "complete": true});

      const putResponse = await chai.request(app).put(`/assignments/${newAssignmentId}`).send({"due_date_id": dueDate.id, "from_person_id": fromPerson.id, "to_person_id": secondToPerson.id, "complete": true});
      putResponse.should.have.status(200);
      putResponse.body.should.be.an('object');
      putResponse.body.should.deep.equal({"id": newAssignmentId, "due_date_id": dueDate.id, "from_person_id": fromPerson.id, "to_person_id": secondToPerson.id, "complete": true});


      const getResponse = await chai.request(app).get('/assignments');
      getResponse.should.have.status(200);
      getResponse.body.should.be.an('array');
      getResponse.body.should.deep.equal([{"id": newAssignmentId, "due_date_id": dueDate.id, "from_person_id": fromPerson.id, "to_person_id": secondToPerson.id, "complete": true}]);
    });

    context('when querying with invalid assignment id', () => {
      it ('should return a 404', async () => {
        const putResponse = await chai.request(app).put(`/assignments/-1`).send({"due_date_id": '', "from_person_id": 1, "to_person_id": 1, "complete": true});
        putResponse.should.have.status(404);
      })
    });
  });

  describe('DELETE /assignments/:id', () => {
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

      const deleteResponse = await chai.request(app).delete(`/assignments/${newAssignmentId}`);
      deleteResponse.should.have.status(204);
      deleteResponse.body.should.deep.eq({});

      const getResponse = await chai.request(app).get(`/assignments/${newAssignmentId}`);
      getResponse.should.have.status(404);
    });
  });
});