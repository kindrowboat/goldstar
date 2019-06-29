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
  const startDate = '2019-06-28';

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
      const autoAssignResponse = await chai.request(app).post('/assignments/auto_assign').send({"start_date": startDate});
      autoAssignResponse.should.have.status(200);
      const assignments = autoAssignResponse.body;
      assignments.should.be.an('array');

      firstRoundExpectedToPersonIdArray = [
        [personA.id, personB.id],
        [personB.id, personA.id],
        [personC.id, personD.id],
        [personD.id, personC.id],
      ];
      firstRoundAssignedToPersonIdArray = assignments.slice(0,4).map(assignment => [assignment.from_person_id, assignment.to_person_id]);
      firstRoundAssignedToPersonIdArray.should.deep.equal(firstRoundExpectedToPersonIdArray);

      secondRoundExpectedToPersonIdArray = [
        [personA.id, personE.id],
        [personE.id, personA.id],
        [personB.id, personC.id],
        [personC.id, personB.id],
      ];
      secondRoundAssignedToPersonIdArray = assignments.slice(4,8).map(assignment => [assignment.from_person_id, assignment.to_person_id]);
      secondRoundAssignedToPersonIdArray.should.deep.equal(secondRoundExpectedToPersonIdArray);

      thirdRoundExpectedToPersonIdArray = [
        [personA.id, personD.id],
        [personD.id, personA.id],
        [personB.id, personE.id],
        [personE.id, personB.id],
      ];
      thirdRoundAssignedToPersonIdArray = assignments.slice(8,12).map(assignment => [assignment.from_person_id, assignment.to_person_id]);
      thirdRoundAssignedToPersonIdArray.should.deep.equal(thirdRoundExpectedToPersonIdArray);

      forthRoundExpectedToPersonIdArray = [
        [personA.id, personC.id],
        [personC.id, personA.id],
        [personB.id, personD.id],
        [personD.id, personB.id],
      ];
      forthRoundAssignedToPersonIdArray = assignments.slice(12,16).map(assignment => [assignment.from_person_id, assignment.to_person_id]);
      forthRoundAssignedToPersonIdArray.should.deep.equal(forthRoundExpectedToPersonIdArray);

      fifthRoundExpectedToPersonIdArray = [
        [personC.id, personE.id],
        [personE.id, personC.id],
      ];
      fifthRoundAssignedToPersonIdArray = assignments.slice(16,20).map(assignment => [assignment.from_person_id, assignment.to_person_id]);
      fifthRoundAssignedToPersonIdArray.should.deep.equal(fifthRoundExpectedToPersonIdArray);

    });

    it('creates assignments for every week needed for everyone to give feedback starting on the "start_date"', async () => {

    });
  });
});