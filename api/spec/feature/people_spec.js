process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../../index');
chai.should();

let db = require('../../app/lib/db');

chai.use(chaiHttp);

describe('People', () => {
  beforeEach((done) => {
    db.query('TRUNCATE people', done);
  });

  after( () => {
    app.stop();
  });

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

  describe('GET /people/1', () => {
    it('should GET all the people', (done) => {
      chai.request(app)
        .post('/people')
        .send({"name": "Jane Doe", "initials": "JD"})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.deep.equal({"id": 1, "name": "Jane Doe", "initials": "JD"});
        });
      chai.request(app)
        .get('/people/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.deep.equal({"id": 1, "name": "Jane Doe", "initials": "JD"});
          done();
        });
    });
  });

  describe('POST /people', () => {
    it('should POST a person', (done) => {
      chai.request(app)
        .post('/people')
        .send({"name": "Jane Doe", "initials": "JD"})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.deep.equal({"id": 1, "name": "Jane Doe", "initials": "JD"});
        });
      chai.request(app)
        .get('/people')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body.should.deep.equal([{"id": 1, "name": "Jane Doe", "initials": "JD"}]);
          done();
        });
    });
  });
  describe('PUT /people', () => {
    it('should PUT a person', (done) => {
      chai.request(app)
        .post('/people')
        .send({"name": "Jane Doe", "initials": "JD"})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.deep.equal({"id": 1, "name": "Jane Doe", "initials": "JD"});
        });
      chai.request(app)
        .put('/people/1')
        .send({"name": "Janet Doe", "initials": "JD"})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.deep.equal({"id": 1, "name": "Janet Doe", "initials": "JD"});
        });
      chai.request(app)
        .get('/people/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.deep.equal({"id": 1, "name": "Janet Doe", "initials": "JD"});
          done();
        });
     });
   });
  describe('DELETE /people', () => {
    it('should DELETE a person', (done) => {
      chai.request(app)
        .post('/people')
        .send({"name": "Janet Doe", "initials": "JD"})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.deep.equal({"id": 1, "name": "Janet Doe", "initials": "JD"});
        });
      chai.request(app)
        .get('/people/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.deep.equal({"id": 1, "name": "Janet Doe", "initials": "JD"});
        });
      chai.request(app)
        .delete('/people/1')
        .end((err, res) => {
          res.should.have.status(204);
          res.body.should.deep.equal({}); // we know this is actually null :(
          done();
        });
    });
  });
});