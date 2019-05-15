process.env.NODE_ENV = 'test';

require('../spec_helper');
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../../index');

chai.should();

chai.use(chaiHttp);

describe('People', () => {

  describe('GET /people', () => {
    it('should GET all the people', (done) => {
      chai.request(app)
        .get('/people')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('GET /people/:id', () => {
    let newPersonId;
    it('should GET all the people', async () => {
      const response = await chai.request(app).post('/people').send({"name": "Jane Doe", "initials": "JD"});
      response.should.have.status(200);
      response.body.should.be.an('object');
      newPersonId = response.body['id'];
      response.body.should.deep.equal({"id": newPersonId, "name": "Jane Doe", "initials": "JD"});
      const getResponse = await chai.request(app).get(`/people/${newPersonId}`)
      getResponse.should.have.status(200);
      getResponse.body.should.be.an('object');
      getResponse.body.should.deep.equal({"id": newPersonId, "name": "Jane Doe", "initials": "JD"});
    });
  });

  describe('POST /people', () => {
    let newPersonId;
    it('should POST a person', async () => {
      const response = await chai.request(app).post('/people').send({"name": "Jane Doe", "initials": "JD"});
      response.should.have.status(200);
      response.body.should.be.an('object');
      newPersonId = response.body['id'];
      response.body.should.deep.equal({"id": newPersonId, "name": "Jane Doe", "initials": "JD"});
      const getResponse = await chai.request(app).get('/people')
      getResponse.should.have.status(200);
      getResponse.body.should.be.an('array');
      getResponse.body.should.deep.equal([{"id": newPersonId, "name": "Jane Doe", "initials": "JD"}]);
    });
    context('when passing in invalid data', () => {
      it('returns a 400', (done) => {
        chai.request(app)
          .post('/people')
          .send({})
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.deep.equal({"errors": { name: "must be present", initials: "must be present"}});
            done();
          });
      });
    });
  });
  describe('PUT /people', () => {
    let newPersonId;
    it('should PUT a person', async () => {
      const response = await chai.request(app).post('/people').send({"name": "Jane Doe", "initials": "JD"});
      response.should.have.status(200);
      response.body.should.be.an('object');
      newPersonId = response.body['id'];
      response.body.should.deep.equal({"id": newPersonId, "name": "Jane Doe", "initials": "JD"});
      const putResponse = await chai.request(app).put(`/people/${newPersonId}`).send({"name": "Janet Doe", "initials": "JD"});
      putResponse.should.have.status(200);
      putResponse.body.should.be.an('object');
      putResponse.body.should.deep.equal({"id": newPersonId, "name": "Janet Doe", "initials": "JD"});
      const getResponse = await chai.request(app).get(`/people/${newPersonId}`);
      getResponse.should.have.status(200);
      getResponse.body.should.be.an('object');
      getResponse.body.should.deep.equal({"id": newPersonId, "name": "Janet Doe", "initials": "JD"});
    });

    context('when passing invalid data', () => {
      it('returns a 400', async () => {
        const response = await chai.request(app).post('/people').send({"name": "Jane Doe", "initials": "JD"});
        response.should.have.status(200);
        response.body.should.be.an('object');
        newPersonId = response.body['id'];
        response.body.should.deep.equal({"id": newPersonId, "name": "Jane Doe", "initials": "JD"});
        const putResponse = await chai.request(app).put(`/people/${newPersonId}`).send({});
        putResponse.should.have.status(400);
        putResponse.body.should.deep.equal({"errors": { name: "must be present", initials: "must be present"}});
      });
    });

  });

  describe('DELETE /people', () => {
    let newPersonId;
    it('should DELETE a person', async () => {
      const postResponse = await chai.request(app).post('/people').send({"name": "Janet Doe", "initials": "JD"})
      postResponse.should.have.status(200);
      postResponse.body.should.be.an('object');
      newPersonId = postResponse.body['id'];
      postResponse.body.should.deep.equal({"id": newPersonId, "name": "Janet Doe", "initials": "JD"});

      const getResponse = await chai.request(app).get(`/people/${newPersonId}`);
      getResponse.should.have.status(200);
      getResponse.body.should.be.an('object');
      getResponse.body.should.deep.equal({"id": newPersonId, "name": "Janet Doe", "initials": "JD"});

      const deleteResponse = await chai.request(app).delete(`/people/${newPersonId}`);
      deleteResponse.should.have.status(204);
      deleteResponse.body.should.deep.equal({}); // we know this is actually null :(
    });
  });
});