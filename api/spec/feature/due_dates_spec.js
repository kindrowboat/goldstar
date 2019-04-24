process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../../index');
chai.should();

let db = require('../../app/lib/db');

chai.use(chaiHttp);

describe('Due Date', () => {
  beforeEach((done) => {
    db.query('TRUNCATE due_dates', done);
  });

  after( () => {
    app.stop();
  });

  describe('GET /due_dates', () => {
    it('should GET all the due_dates', (done) => {
      chai.request(app)
        .get('/due_dates')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('GET /due_dates/1', () => {
    it('should GET all the due_dates', (done) => {
      chai.request(app)
        .post('/due_dates')
        .send({"date": "2019-04-23"})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.deep.equal({"id": 1, "date": "2019-04-23"});
        });
      chai.request(app)
        .get('/due_dates/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.deep.equal({"id": 1, "date": "2019-04-23"});
          done();
        });
    });
  });

  describe('POST /due_dates', () => {
    it('should POST a person', (done) => {
      chai.request(app)
        .post('/due_dates')
        .send({"date": "2019-04-23"})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.deep.equal({"id": 1, "date": "2019-04-23"});
        });
      chai.request(app)
        .get('/due_dates')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body.should.deep.equal([{"id": 1, "date": "2019-04-23"}]);
          done();
        });
    });
  });
  describe('PUT /due_dates', () => {
    it('should PUT a person', (done) => {
      chai.request(app)
        .post('/due_dates')
        .send({"date": "2019-04-23"})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.deep.equal({"id": 1, "date": "2019-04-23"});
        });
      chai.request(app)
        .put('/due_dates/1')
        .send({"date": "2019-05-01"})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.deep.equal({"id": 1, "date": "2019-05-01"});
        });
      chai.request(app)
        .get('/due_dates/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.deep.equal({"id": 1, "date": "2019-05-01"});
          done();
        });
    });
  });
  describe('DELETE /due_dates', () => {
    it('should DELETE a person', (done) => {
      chai.request(app)
        .post('/due_dates')
        .send({"date": "2019-05-01"})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.deep.equal({"id": 1, "date": "2019-05-01"});
        });
      chai.request(app)
        .get('/due_dates/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.deep.equal({"id": 1, "date": "2019-05-01"});
        });
      chai.request(app)
        .delete('/due_dates/1')
        .end((err, res) => {
          res.should.have.status(204);
          res.body.should.deep.equal({}); // we know this is actually null :(
          done();
        });
    });
  });
});