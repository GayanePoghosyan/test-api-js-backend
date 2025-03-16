const request = require('supertest');
const { app } = require('../../../app');
const { database } = require('../../../services/database.service');
const { testCompany, invalidCompany } = require('./tests.data/companies-test.data');
const { registerTestUser, generateAuthToken } = require('../../../helpers/tests.helper');
const httpCodes = require('../../../constants/http-codes');
const { Company, Contact, User } = require('../../../DB/models');

describe('POST /companies', () => {
  const v = 'v1';
  const API_PATH = `/${v}/companies`;
  let authToken = null;
  let user = {};
  let contact = {};
  let companyId = null;

  beforeAll(async () => {
    await database.connect();
    user = await registerTestUser();
    authToken = generateAuthToken(user);
    contact = await Contact.create({
      firstName: 'Test',
      lastName: 'Contact',
      email: 'test@example.com'
    });

  });

  afterAll(async () => {
    await Company.destroy({ where: { id: companyId } });
    await Contact.destroy({ where: { id: contact.id } });
    await User.destroy({ where: { username: 'johndoe' } });
    await database.disconnect();
  });

  describe('With valid authorization', () => {
    test('should create a company and return 201', async () => {
      const response = await request(app)
        .post(API_PATH)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...testCompany, contactId: contact.id });

      expect(response.status).toBe(httpCodes.CREATED);
      expect(response.body).toMatchObject({
        name: testCompany.name,
        shortName: testCompany.shortName,
        businessEntity: testCompany.businessEntity
      });
      companyId = response.body.id;
    });

    test('should validate contract number format', async () => {
        const response = await request(app)
          .post(API_PATH)
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            ...testCompany,
            contactId:'ABC-12'
          });
        expect(response.status).toBe(httpCodes.UNPROCESSABLE_ENTITY);
    });

    test('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post(API_PATH)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test Company' });

      expect(response.status).toBe(httpCodes.UNPROCESSABLE_ENTITY);
    });

    test('should return 422 for invalid data types', async () => {
      const response = await request(app)
        .post(API_PATH)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidCompany);

      expect(response.status).toBe(httpCodes.UNPROCESSABLE_ENTITY);
    });

    test('should return 404 for invalid contact id', async () => {
      const response = await request(app)
        .post(API_PATH)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...testCompany, contactId: 999 });

      expect(response.status).toBe(httpCodes.NOT_FOUND);
    });
  });

  describe('Without authorization', () => {
    test('should return 401 unauthorized', async () => {
      const response = await request(app)
        .post(API_PATH)
        .send(testCompany);

      expect(response.status).toBe(httpCodes.UNAUTHORIZED);
    });
  });
});