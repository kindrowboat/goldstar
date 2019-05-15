process.env.NODE_ENV = 'test';

require('../spec_helper');
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../../index');
chai.should();

chai.use(chaiHttp);

describe('Due Date', () => {

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
    it('should GET all the due_dates', async () => {
      const postResponse = await chai.request(app).post('/due_dates').send({"date": "2019-04-23"})
      postResponse.should.have.status(200);
      postResponse.body.should.be.an('object');
      const id = postResponse.body.id;
      postResponse.body.should.deep.equal({"id": id, "date": "2019-04-23"});

      const getResponse = await chai.request(app).get(`/due_dates/${id}`)
      getResponse.should.have.status(200);
      getResponse.body.should.be.an('object');
      getResponse.body.should.deep.equal({"id": id, "date": "2019-04-23"});
    });
  });

  describe('POST /due_dates', () => {
    it('should POST a person', async () => {
      const postResponse = await chai.request(app).post('/due_dates').send({"date": "2019-04-23"})
      postResponse.should.have.status(200);
      postResponse.body.should.be.an('object');
      const id = postResponse.body.id;
      postResponse.body.should.deep.equal({"id": id, "date": "2019-04-23"});

      const getResponse = await chai.request(app).get('/due_dates');
      getResponse.should.have.status(200);
      getResponse.body.should.be.an('array');
      getResponse.body.should.deep.equal([{"id": id, "date": "2019-04-23"}]);
    });
  });

  describe('PUT /due_dates', () => {
    it('should PUT a person', async () => {
      const postResponse = await chai.request(app).post('/due_dates').send({"date": "2019-04-23"})
      postResponse.should.have.status(200);
      postResponse.body.should.be.an('object');
      const id = postResponse.body.id;
      postResponse.body.should.deep.equal({"id": id, "date": "2019-04-23"});

      const putResponse = await chai.request(app).put(`/due_dates/${id}`).send({"date": "2019-05-01"})
      putResponse.should.have.status(200);
      putResponse.body.should.be.an('object');
      putResponse.body.should.deep.equal({"id": id, "date": "2019-05-01"});

      const getResponse = await chai.request(app).get(`/due_dates/${id}`);
      getResponse.should.have.status(200);
      getResponse.body.should.be.an('object');
      getResponse.body.should.deep.equal({"id": id, "date": "2019-05-01"});
    });
  });
  describe('DELETE /due_dates', () => {
    it('should DELETE a person', async () => {
      const postResponse = await chai.request(app).post('/due_dates').send({"date": "2019-05-01"});
      postResponse.should.have.status(200);
      postResponse.body.should.be.an('object');
      const id = postResponse.body.id;
      postResponse.body.should.deep.equal({"id": id, "date": "2019-05-01"});

      const getResponse = await chai.request(app).get(`/due_dates/${id}`)
      getResponse.should.have.status(200);
      getResponse.body.should.be.an('object');
      getResponse.body.should.deep.equal({"id": id, "date": "2019-05-01"});

      const deleteResponse = await chai.request(app).delete(`/due_dates/${id}`)
      deleteResponse.should.have.status(204);
      deleteResponse.body.should.deep.equal({}); // we know this is actually null :(
    });
  });
});