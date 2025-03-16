

module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    contactId: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
      allowNull: false
    },
    contract: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
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
    }
  }, {
    timestamps: true,
    createdAt: true,
    updatedAt: true
  });

  Company.associate = (models) => {
    Company.belongsTo(models.Contact, { foreignKey: 'contactId', as: 'contact' });
  };

  return Company;
};

