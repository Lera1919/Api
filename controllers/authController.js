
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {v4: uuidv4} = require('uuid');

const mailConfirmTemplate = require("../templates/mailConfirmTemplate");
const sendMail = require("../services/mailer");
const User = require("../models").User;

exports.register = async (req, res) => {

    let { firstName, lastName, email, password } = req.body;

    password = await bcrypt.hash(password, 5);

    // Время жизни токена 10 мин, только для проверки письма
    const token = jwt.sign(
        { firstName, lastName, email, password },
        process.env.TOKEN_KEY,
        {
            expiresIn: "600s",
        }
    );

    const data = {
        userName: firstName + ' ' + lastName,
        token: token
    };

    const options = {
        from: `TESTING <${process.env.MAIL}>`,
        to: email,
        subject: "Регистрация аккаунта в приложении Instagram",
        text: `Скопируйте адрес, вставьте в адресную строку вашего браузера и нажмите ввод - https://instagram.lern.dev/api/v1/confirm?tkey=${token}`,
        html: mailConfirmTemplate(data),
    };

    try {
        const resultSentMail = await sendMail(options);
    } catch (err) {
        return res.status(418).json({ "message": "Ошибка отправки письма" });
    }

    return res.status(200).json({ "message": "Письмо отправлено" });
};

exports.confirm = async (req, res) => {

    const { firstName, lastName, email, password } = req.body;

    const user = await User.create({
        firstName,
        lastName,
        email,
        password
    });

    const tokenId = uuidv4();
    const token = jwt.sign(
        {
            id: user.id,
            firstName,
            lastName,
            email,
            avatar: user.avatar,
            tokenId
        },
        process.env.TOKEN_KEY,
        {
            expiresIn: "60d",
        }
    );

    user.token = token;

    return res.status(201).json(user);
};

exports.login = async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {

        const tokenId = uuidv4();
        const token = jwt.sign(
            {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                avatar: user.avatar,
                tokenId
            },
            process.env.TOKEN_KEY,
            {
                expiresIn: "60d",
            }
        );
        user.token = token;

        return res.status(200).json(user);
    }

    return res.status(401).send("Логин или пароль указан не верно");

};


exports.logout = async (req, res) => {

    

    

};

// exports.update = async (req, res) => {
//     return res.send("NOT IMPLEMENTED: Site Home Page");
// };

// exports.delete = async (req, res) => {
//     return res.send("NOT IMPLEMENTED: Site Home Page");
// };

// exports.index = async (req, res) => {
//     res.status(200).json(
//         {
//             "message": process.env.API_PORT,
//             "status": "ok!"
//         }
//     );
// };
