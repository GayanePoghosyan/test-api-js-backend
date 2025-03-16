module.exports = (sequelize, DataTypes) => {

  const Contact = sequelize.define('Contact', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    middleName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    timestamps: true,
    createdAt: true,
    updatedAt: true
  });

  Contact.associate = (models) => {
    Contact.hasMany(models.Company, { foreignKey: 'contactId', as: 'companies' });
  };

  return Contact;
};  
