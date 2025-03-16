const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize-configs");
const User = require("./User");
const Contact = require("./Contact");
const Company = require("./Company");

const models = {
    Company,
    Contact,
    User,
};

Object.keys(models).forEach((modelName) => {
    models[modelName] = models[modelName](sequelize, DataTypes);
});

Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
