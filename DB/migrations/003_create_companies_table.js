const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Companies', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      contactId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Contacts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      shortName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      businessEntity: {
        type: DataTypes.STRING,
        allowNull: true
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      contract: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      type: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: ['agent']
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active'
      },
      photos: {
        type: DataTypes.JSONB,
        defaultValue: []
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });

    await queryInterface.addIndex('Companies', ['status']);
    await queryInterface.addIndex('Companies', ['type']);
    await queryInterface.addIndex('Companies', ['name']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Companies');
  }
};
