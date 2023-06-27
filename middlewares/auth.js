const jwt = require("jsonwebtoken");
const BlackList = require("../models").BlackList;

/**
* @swagger
* components:
*   schemas:
*     verifyTokenFailed:
*       type: object
*       properties:
*         message:
*           type: string
*           description: Токен не действителен
*       example:
*         message: "Токен не действителен"
*     verifyTokenExist:
*       type: object
*       properties:
*         message:
*           type: string
*           description: Токен не найден
*       example:
*         message: "Токен не найден"
*/

const verifyToken = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["authorization"];

    if (!token) {
        return res.status(403).send("Токен обязателен для авторизации");
    }
    try {
        req.body = jwt.verify(token, process.env.TOKEN_KEY);

        const ban = await BlackList.findOne({ where: {id: req.body.tokenId} });

        if (ban) throw new Error();

    } catch (err) {
        return res.status(401).send("Не верный токен");
    }
    return next();
};

module.exports = verifyToken;