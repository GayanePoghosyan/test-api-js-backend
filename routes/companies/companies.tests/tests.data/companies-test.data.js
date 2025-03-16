const testCompany = {
  name: 'Alpha Company',
  shortName: 'Alpha',
  businessEntity: 'LLC',
  address: '123 Alpha St',
  type: ['agent'],
  status: 'active',
};

const invalidCompany = {
  shortName: 'Gamma',
  businessEntity: 1,
  address: '123 Gamma St',
  type: ['agent', 'contractor'],
  status: 'active',
};

module.exports = { testCompany, invalidCompany };
