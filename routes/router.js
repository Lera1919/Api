const express = require('express')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const auth = require("../middlewares/auth");
const validationRequest = require('../requests/validationRequest');
const router = express.Router()


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
router.post("/register", validationRequest.register, userController.register);

router.get("/confirm", validationRequest.confirm, userController.confirm);

module.exports = router