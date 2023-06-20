'use strict';
const { Model } = require('sequelize');

/**
* @swagger
*  components:
*    schemas:
*      userModel:
*        type: object
*        properties:
*          id:
*            type: integer
*            description: ID пользователя
*          firstName:
*            type: string
*            maxLength: 30
*            description: Имя пользователя
*          lastName:
*            type: string
*            maxLength: 30
*            description: Фамилия пользователя
*          email:
*            type: string
*            maxLength: 100
*            description: Адрес почты
*          password:
*            type: string
*            minLength: 3
*            maxLength: 8
*            description: Пароль пользователя
*          token:
*            type: string
*            maxLength: 512
*            description: Токен доступа  
*          avatar:
*            type: string
*            maxLength: 255
*            description: URL аватарки пользователя 
*          status:
*            type: boolean
*            description: Статус пользователя 
*          createdAt:
*            type: string
*            description: Время создания пользователя
*          updatedAt:
*            type: string
*            description: Время обновления данных пользователя      
*        example:
*          id: 56
*          firstName: "Jone"
*          lastName: "Dou"
*          email: "example@mail.com"
*          password: "12345"   
*          token: "nejkwuhfrio48729"
*          avatar: "https://instagram.lern.dev/avatar.jpg"
*          status: "true"
*          createdAt: "2023-06-04"
*          updatedAt: "2023-06-06"
 
 
*/

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }

    User.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        firstName: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(100),
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING(512),
        },
        avatar: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        verifyEmail: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    }, {
        sequelize,
        modelName: 'User',
        timestamps: true,
    });
    
    return User;
};
