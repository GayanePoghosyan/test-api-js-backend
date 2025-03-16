const request = require('supertest');
const { app } = require('../../../../app');
const { database } = require('../../../../services/database.service');
const { testContact } = require('./tests.data/contacts');
const { registerTestUser, generateAuthToken } = require('../../../../helpers/tests.helper');
const httpCodes = require('../../../../constants/http-codes');
const { Contact, User } = require('../../../../DB/models');


describe('GET /contacts/:id', () => {
  const v = 'v1';
  const API_PATH = `/${v}/contacts`;
  let contactId = null;
  let user = {};
  let authToken = null;

  beforeAll(async () => {
    await database.connect();
    contactId = (await Contact.create(testContact)).id;
    user = await registerTestUser();
    authToken = generateAuthToken(user);
  });

  afterAll(async () => {
    await Contact.destroy({ where: { id: contactId } });
    await User.destroy({ where: { username: 'johndoe' } });
    await database.disconnect();
  });

  describe('Authorization', () => {
    describe('With valid authorization', () => {

      test('should return 200 and contact details for valid ID', async () => {
        const response = await request(app)
          .get(`${API_PATH}/${contactId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send();

        expect(response.status).toBe(httpCodes.OK);
        expect(response.body.data).toMatchObject({
          firstName: testContact.firstName,
          lastName: testContact.lastName,
        });
      });

      test('should return 404 for non-existent contact', async () => {
        const response = await request(app)
          .get(`${API_PATH}/999`)
          .set('Authorization', `Bearer ${authToken}`)
          .send();

        expect(response.status).toBe(httpCodes.NOT_FOUND);
      });

      test('should return 422 for invalid ID format', async () => {
        const response = await request(app)
          .get(`${API_PATH}/invalid-id`)
          .set('Authorization', `Bearer ${authToken}`)
          .send();

        expect(response.status).toBe(httpCodes.UNPROCESSABLE_ENTITY);
      });
    });

    describe('Without authorization', () => {

      test('should return 401 unauthorized', async () => {
        const response = await request(app)
          .get(`${API_PATH}/${contactId}`)
          .send();

        expect(response.status).toBe(httpCodes.UNAUTHORIZED);
      });
    });
  });
});