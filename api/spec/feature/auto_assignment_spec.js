process.env.NODE_ENV = 'test';

require('../spec_helper');
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../../index');
const factories = require('../support/factories');

chai.should();

chai.use(chaiHttp);

describe('auto assignments', () => {
  let personA, personB, personC, personD, personE, people;
  const days = 7;

  beforeEach( async ()=> {
    personA = await factories.createPerson({name: 'Person A', initials: 'PA'});
    personB = await factories.createPerson({name: 'Person B', initials: 'PB'});
    personC = await factories.createPerson({name: 'Person C', initials: 'PC'});
    personD = await factories.createPerson({name: 'Person D', initials: 'PD'});
    personE = await factories.createPerson({name: 'Person E', initials: 'PE'});
    people = [personA, personB, personC, personD, personE];
  });
  context('when there have never been any assignments', () => {
    it ('assigns each person with a different person', async () => {
      const autoAssignResponse = await chai.request(app).post('/assignments/auto_assign').send({"days_until_due": days});
      autoAssignResponse.should.have.status(200);
      const assignments = autoAssignResponse.body;
      assignments.should.be.an('array');

      expected_to_person_id_array = [personB.id, personC.id, personD.id, personE.id, personA.id];
      assigned_to_person_id_array = assignments.map(assignment => assignment.to_person_id);
      assigned_to_person_id_array.should.deep.equal(expected_to_person_id_array);
    });

    it('never assign person to themselves', async () => {

    });
  });

  context('when a person the team', () => {
    it ('does not assign anyone to that person and that person to anyone', async () => {

    });
  });

  context('when a new person joins the team', () => {
    it ('assigns someone to the new person and the new person to someone else', async () => {

    });
  });

  context('when there have been multiple weeks gone by', () => {
    it ('always assigns someone who has not given feedback to that person yet', async () => {

    })
  });

  context('when someone has given feedback to everyone else', () => {
    it ('does not assign anyone to that person', async() => {

    });
  });

});