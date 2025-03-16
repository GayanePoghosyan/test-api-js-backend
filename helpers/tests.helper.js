const request = require('supertest');
const { app } = require('../app')
const JwtService = require('../services/jwt.service');
const config = require('../config');

const registerTestUser = async () => {
    const user = await request(app)
        .post('/v1/users/register')
        .send({
            firstname: 'John',
            lastname: 'Doe',
            username: 'johndoe',
            email: 'johndoe@example.com',
            password: 'password',
        })
        .then((res) => res.body);

    return user;
};

const generateAuthToken = (user) => {
    const jwtService = new JwtService(config.jwt);
    return jwtService.encode(user).data;
};

module.exports = {
    registerTestUser,
    generateAuthToken,
};