const express = require('express')
const authController = require('../controllers/authController')
const validationRequest = require('../middlewares/validationRequest');
const hasUser = require('../middlewares/hasUser')
const auth = require("../middlewares/auth");

const router = express.Router()

/**
* @swagger
* tags:
*   name: Auth
*   description: API для регистрации, аутентификации и авторизации пользователя
* /register:
*   post:
*     summary: Начало процедуры создания пользователя, проверка данных и отправка письма с подтверждением
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/registerRequest'
*     responses:
*       201:
*         description: Пользователь создан.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/userModel'
*       400:
*         description: Ошибка валидации данных.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errors:
*                   type: array
*                   items:
*                     type: object
*                     properties:
*                       type:
*                         type: string
*                         description: Тип поля
*                       value:
*                         type: string
*                         description: Значение поля
*                       msg:
*                         type: string
*                         description: Текст ошибки
*                       path:
*                         type: string
*                         description: Имя поля с ошибкой
*                       location:
*                         type: string
*                         description: Место, где произошла ошибка
*                     example:
*                       type: "field"
*                       value: "1234577777"
*                       msg: "Пароль должен быть не меньше 5 и не больше 8 символов"
*                       path: "password"
*                       location: "body"
*       409:
*         description: Пользователь с такими данными уже существует.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   description: Текст ошибки
*               example:
*                 message: "Такой пользователь уже существует"
*       418:
*         description: Ошибка отправки письма.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   description: Текст ошибки
*               example:
*                 message: "Ошибка отправки письма"
*       500:
*         description: Что-то пошло не так.. гы гы
*
*/
router.post("/register", validationRequest.register, hasUser.check, authController.register);

/**
* @swagger
* /confirm:
*   get:
*     summary: Завершение процедуры создания пользователя, запись данных в базу
*     tags: [Auth]
*     parameters:
*       - in: query
*         name: tkey
*         type: string
*         required: true
*         description: Токен из письма подтверждения процедуры регистрации, время жизни 10 мин
*     responses:
*       201:
*         description: Пользователь создан.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/userModel'
*       401:
*         description: Не верный токен в параметре запроса.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   description: Текст ошибки
*               example:
*                 message: "Не верный токен"
*       409:
*         description: Пользователь с такими данными уже существует.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   description: Текст ошибки
*               example:
*                 message: "Такой пользователь уже существует"
*       500:
*         description: Что-то пошло не так.. гы гы
*
*/
router.get("/confirm", validationRequest.confirm, hasUser.check, authController.confirm);

/**
* @swagger
* /login:
*   post:
*     summary: Вход пользователя в свою учетную запись
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/loginRequest'
*     responses:
*       200:
*         description: Пользователь залогинен.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/userModel'
*       400:
*         description: Ошибка валидации данных.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 errors:
*                   type: array
*                   items:
*                     type: object
*                     properties:
*                       type:
*                         type: string
*                         description: Тип поля
*                       value:
*                         type: string
*                         description: Значение поля
*                       msg:
*                         type: string
*                         description: Текст ошибки
*                       path:
*                         type: string
*                         description: Имя поля с ошибкой
*                       location:
*                         type: string
*                         description: Место, где произошла ошибка
*                     example:
*                       type: "field"
*                       value: "1234577777"
*                       msg: "Пароль должен быть не меньше 5 и не больше 8 символов"
*                       path: "password"
*                       location: "body"
*       401:
*         description: Логин или пароль указан не верно.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   description: Текст ошибки
*               example:
*                 message: "Логин или пароль указан не верно"
*       500:
*         description: Что-то пошло не так.. гы гы
*
*/
router.post("/login", validationRequest.login, authController.login);


/**
* @swagger
* /logout:
*   get:
*     summary: Выход пользователя из учётки
*     tags: [Auth]
*     security:
*       - bearerAuth: []
*     description: В Header autorization должен быть указан токен
*     responses:
*       200:
*         description: Успешная операция выхода из учётки
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   description: Вы вышли из учётки
*               example:
*                 message: "Вы вышли из учётки"
*       401:
*         description: Токен не действителен
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/verifyTokenFailed'
*       403:
*         description: Токен не был передан
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/verifyTokenExist'
*/
router.get("/logout", auth, authController.logout);

// router.get("/user", auth, userController.index);

module.exports = router