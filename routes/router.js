const express = require('express')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const auth = require("../middlewares/auth");
const validationRequest = require('../requests/validationRequest');

const router = express.Router()

router.get("/user", auth, userController.index);

router.post("/logout", auth, userController.create);


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Это роуты для регистрации и логина
 * /register:
 *   post:
 *     summary: Создание пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/registerRequest'
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/userModel'
 *       409:
 *         description: Такой пользователь уже создан
 *       500:
 *         description: Зови на помощь
 *
 */
router.post("/register", validationRequest.register, userController.create);
router.get("/confirm", userController.confirm);

router.post("/login", authController.login);

router.get("/", userController.index);

module.exports = router