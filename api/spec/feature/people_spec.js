process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../../index');
let should = chai.should();

let db = require('../../lib/db');

chai.use(chaiHttp);

const request = chai.request(app);

describe('People', () => {
  beforeEach((done) => {
    db.query('TRUNCATE people', done);
  });

  after( () => {
    app.stop();
  });
  describe('/GET people', () => {
    it('it should GET all the people', (done) => {
      request
        .get('/people')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });
});