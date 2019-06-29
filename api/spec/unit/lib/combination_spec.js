const combinations = require('../../../app/lib/combinations');

describe('.combinations', () => {
  it('returns the pair-wise combinations of an array', () => {
    const array = ['a', 'b', 'c', 'd', 'e'];
    const expectedCombinations = [
      ['a', 'b'],
      ['a', 'c'],
      ['a', 'd'],
      ['a', 'e'],
      ['b', 'c'],
      ['b', 'd'],
      ['b', 'e'],
      ['c', 'd'],
      ['c', 'e'],
      ['d', 'e']
    ];

    combinations(array).should.deep.eq(expectedCombinations);
  });
});