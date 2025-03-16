const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Users
    const adminPassword = await bcrypt.hash('admin123', 10);
    await queryInterface.bulkInsert('Users', [{
      username: 'admin',
      password: adminPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Contacts
    const contacts = await queryInterface.bulkInsert('Contacts', [
      {
        lastName: 'Иванов',
        firstName: 'Иван',
        middleName: 'Иванович',
        phone: '+7 (999) 123-45-67',
        email: 'ivanov@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        lastName: 'Петров',
        firstName: 'Петр',
        middleName: 'Петрович',
        phone: '+7 (999) 765-43-21',
        email: 'petrov@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    // Companies
    await queryInterface.bulkInsert('Companies', [
      {
        contactId: contacts[0].id,
        name: 'ООО Фирма «Перспективные захоронения»',
        shortName: 'Перспективные захоронения',
        businessEntity: 'ООО',
        contract: JSON.stringify({
          no: '12345',
          issue_date: '2015-03-12T00:00:00Z'
        }),
        type: ['agent', 'contractor'],
        status: 'active',
        address: '123 Проектная ул, 1',
        createdAt: new Date('2020-11-21T08:03:00Z'),
        updatedAt: new Date('2020-11-23T09:30:00Z')
      },
      {
        contactId: contacts[1].id,
        name: 'АО "Инновационные Технологии"',
        shortName: 'ИнноТех',
        businessEntity: 'АО',
        contract: JSON.stringify({
          no: '98765',
          issue_date: '2022-06-20T00:00:00Z'
        }),
        type: ['agent'],
        status: 'inactive',
        address: '123 Проектная ул, 1',
        createdAt: new Date('2022-06-20T14:30:00Z'),
        updatedAt: new Date('2023-12-01T09:15:00Z')
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Companies', null, {});
    await queryInterface.bulkDelete('Contacts', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
