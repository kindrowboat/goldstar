let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../../index');
chai.should();

module.exports.createPerson = async ({name, initials}) => {
  const response = await chai.request(app).post('/people').send({name, initials});
  response.should.have.status(200);
  return response.body;
};

module.exports.createDueDate = async ({date}) => {
  const response = await chai.request(app).post('/due_dates').send({date});
  response.should.have.status(200);
  return response.body;
};