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
      const autoAssignResponse = await chai.request(app).post('/assignments/auto_assign').send({"start_date": startDate});
      autoAssignResponse.should.have.status(200);
      const assignmentsResponse = await chai.request(app).get('/assignments').send();
      const assignmentsBody = assignmentsResponse.body;
      const dueDatesResponse = await chai.request(app).get('/due_dates').send();
      const dueDatesBody = dueDatesResponse.body;

      const expectedAssignments = [
        { id: assignmentsBody[0].id, due_date_id: dueDatesBody[0].id, complete: false, from_person_id: personA.id, to_person_id: personB.id },
        { id: assignmentsBody[1].id, due_date_id: dueDatesBody[0].id, complete: false, from_person_id: personB.id, to_person_id: personA.id },
        { id: assignmentsBody[2].id, due_date_id: dueDatesBody[0].id, complete: false, from_person_id: personC.id, to_person_id: personD.id },
        { id: assignmentsBody[3].id, due_date_id: dueDatesBody[0].id, complete: false, from_person_id: personD.id, to_person_id: personC.id },
        { id: assignmentsBody[4].id, due_date_id: dueDatesBody[1].id, complete: false, from_person_id: personA.id, to_person_id: personE.id },
        { id: assignmentsBody[5].id, due_date_id: dueDatesBody[1].id, complete: false, from_person_id: personE.id, to_person_id: personA.id },
        { id: assignmentsBody[6].id, due_date_id: dueDatesBody[1].id, complete: false, from_person_id: personB.id, to_person_id: personC.id },
        { id: assignmentsBody[7].id, due_date_id: dueDatesBody[1].id, complete: false, from_person_id: personC.id, to_person_id: personB.id },
        { id: assignmentsBody[8].id, due_date_id: dueDatesBody[2].id, complete: false, from_person_id: personA.id, to_person_id: personD.id },
        { id: assignmentsBody[9].id, due_date_id: dueDatesBody[2].id, complete: false, from_person_id: personD.id, to_person_id: personA.id },
        { id: assignmentsBody[10].id, due_date_id: dueDatesBody[2].id, complete: false, from_person_id: personB.id, to_person_id: personE.id },
        { id: assignmentsBody[11].id, due_date_id: dueDatesBody[2].id, complete: false, from_person_id: personE.id, to_person_id: personB.id },
        { id: assignmentsBody[12].id, due_date_id: dueDatesBody[3].id, complete: false, from_person_id: personA.id, to_person_id: personC.id },
        { id: assignmentsBody[13].id, due_date_id: dueDatesBody[3].id, complete: false, from_person_id: personC.id, to_person_id: personA.id },
        { id: assignmentsBody[14].id, due_date_id: dueDatesBody[3].id, complete: false, from_person_id: personB.id, to_person_id: personD.id },
        { id: assignmentsBody[15].id, due_date_id: dueDatesBody[3].id, complete: false, from_person_id: personD.id, to_person_id: personB.id },
        { id: assignmentsBody[16].id, due_date_id: dueDatesBody[4].id, complete: false, from_person_id: personC.id, to_person_id: personE.id },
        { id: assignmentsBody[17].id, due_date_id: dueDatesBody[4].id, complete: false, from_person_id: personE.id, to_person_id: personC.id },
      ];

      assignmentsResponse.body.should.deep.equal(expectedAssignments)
    });
  });
});