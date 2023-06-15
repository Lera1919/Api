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
 *   name: User Authentification
 *   description: User Authentification managing API
 * /register:
 *   post:
 *     summary: Create a new user account
 *     tags: [User Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       201:
 *         description: The created user account.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Register'
 *       500:
 *         description: Some server error
 *
 */
router.post("/register", validationRequest.request, userController.create);
router.post("/login", authController.login);

router.get("/", userController.index);

module.exports = router