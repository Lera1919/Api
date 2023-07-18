'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Profile.belongsTo(models.User, {foreignKey: 'id'});
    }
  }
  Profile.init({
    id: {
      allowNull: false,      
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
      allowNull: false,
      unique: true,   
      type: DataTypes.INTEGER,
      references: {       
          model: 'User',
          key: 'id'
        },       
    
    },  
    phone: {        
      type: DataTypes.STRING(15),       
    },
    description: {        
      type: DataTypes.STRING
    },
    latitude: {        
      type: DataTypes.FLOAT
    },
    longitude: {        
      type: DataTypes.FLOAT
    },
    commercial: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
   }, {
    sequelize,
    modelName: 'Profile',
    timestamps: true,
    associate: (models) => {
      Profile.belongsTo(models.User);
    }  
  });
  return Profile;
};