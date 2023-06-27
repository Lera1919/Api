const { validationResult, checkSchema } = require('express-validator');
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * components:
 *   schemas:
 *     registerRequest:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *       properties:
 *         firstName:
 *           type: string
 *           maxLength: 30
 *           description: Имя пользователя
 *         lastName:
 *           type: string
 *           maxLength: 30
 *           description: Фамилия пользователя
 *         email:
 *           type: string
 *           maxLength: 100
 *           description: Адрес почты
 *         password:
 *           type: string
 *           minLength: 3
 *           maxLength: 8
 *           description: Пароль пользователя
 *       example:
 *         firstName: "Jone"
 *         lastName: "Dou"
 *         email: "example@mail.com"
 *         password: "12345"
 */
exports.register = async (req, res, next) => {

    const schemaObject = checkSchema({
        firstName: {
            exists: {
                errorMessage: 'Отсутствует параметр',
                bail: true
            },
            trim: true,
            escape: true,
            notEmpty: {
                errorMessage: 'Поле не должно быть пустым',
                bail: true
            },
            isLength: {
                options: { max: 30 },
                errorMessage: 'Имя не должно быть больше 30 символов',
            }

        },
        lastName: {
            exists: {
                errorMessage: 'Отсутствует параметр',
                bail: true
            },
            trim: true,
            escape: true,
            notEmpty: {
                errorMessage: 'Поле не должно быть пустым',
                bail: true
            },
            isLength: {
                options: { max: 30 },
                errorMessage: 'Имя не должно быть больше 30 символов',
            }

        },
        email: {
            exists: {
                errorMessage: 'Отсутствует параметр',
                bail: true
            },
            trim: true,
            toLowerCase: true,
            notEmpty: {
                errorMessage: 'Поле не должно быть пустым',
                bail: true
            },
            isLength: {
                options: { max: 100 },
                errorMessage: 'Адрес электронной почты не должен превышать 100 символов',
            },
            isEmail: {
                errorMessage: 'Адрес электронной почты не корректный',
            }
        },
        password: {
            exists: {
                errorMessage: 'Поле должно быть заполнено',
                bail: true
            },
            isLength: {
                options: { min: 5, max: 8 },
                errorMessage: 'Пароль должен быть не меньше 5 и не больше 8 символов',
            }
        },
    });

    await schemaObject.run(req);

    const errors = validationResult(req);

    if (errors.isEmpty()) return next();

    return res.status(400).json({ errors: errors.array() });
}

exports.confirm = async (req, res, next) => {
    try {
        req.body = await jwt.verify(req.query.tkey, process.env.TOKEN_KEY);
    } catch (err) {
        return res.status(401).json({"message": "Не верный токен"});
    }

    return next();
}

/**
 * @swagger
 * components:
 *   schemas:
 *     loginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           maxLength: 100
 *           description: Адрес почты
 *         password:
 *           type: string
 *           minLength: 3
 *           maxLength: 8
 *           description: Пароль пользователя
 *       example:
 *         email: "example@mail.com"
 *         password: "12345"
 */
exports.login = async (req, res, next) => {

    const schemaObject = checkSchema({
        email: {
            exists: {
                errorMessage: 'Отсутствует параметр',
                bail: true
            },
            trim: true,
            toLowerCase: true,
            notEmpty: {
                errorMessage: 'Поле не должно быть пустым',
                bail: true
            },
            isLength: {
                options: { max: 100 },
                errorMessage: 'Адрес электронной почты не должен превышать 100 символов',
            },
            isEmail: {
                errorMessage: 'Адрес электронной почты не корректный',
            }
        },
        password: {
            exists: {
                errorMessage: 'Поле должно быть заполнено',
                bail: true
            },
            isLength: {
                options: { min: 5, max: 8 },
                errorMessage: 'Пароль должен быть не меньше 5 и не больше 8 символов',
            }
        },
    });

    await schemaObject.run(req);

    const errors = validationResult(req);

    if (errors.isEmpty()) return next();

    return res.status(400).json({ errors: errors.array() });
}