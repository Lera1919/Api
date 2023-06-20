const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models")
const User = db.User;
const nodemailer = require("nodemailer");

exports.index = async (req, res) => {
    res.status(200).json(
        {
            "message": process.env.API_PORT,
            "status": "ok!"
        }
    );
};

exports.create = async (req, res) => {

    const { firstName, lastName, email, password } = req.body;

    const oldUser = await User.findOne({ where: {email} });

    if (oldUser) return res.status(409).json({"message": "Такой пользователь уже существует"});

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "vbaptidanova@gmail.com", // generated ethereal user
          pass: "rsxcyomvewjbkurm", // generated ethereal password
        },
      });



    const token = jwt.sign(
        {firstName, lastName, email, password},
        process.env.TOKEN_KEY,
        {expiresIn: 15 * 60 * 1000,}
    );

    let info = await transporter.sendMail({
        from: "Example <vbaptidanova@gmail.com>", // sender address
        to: "vbaptidanova@gmail.com", // list of receivers
        subject: "Регистрация в приложении Instagram", // Subject line
        text: `Привет, ${firstName}`, // plain text body
        html: `<h1>Привет, ${firstName}</h1>
        <p>Для завершения регистрации перейдите по ссылке ниже</p>
        <div><a href="https://instagram.lern.dev/api/v1/confirm?tkey=${token}">ЖМИ МЕНЯ</a></div>`, // html body
    });
      
  




    
    return res.status(200).json({"message":"письмо отправлено"});
};

exports.confirm = async (req, res) => {
    const data = jwt.verify(req.query.tkey, process.env.TOKEN_KEY);

    let encryptedPassword = await bcrypt.hash(data.password, 5);

    const user = await User.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: encryptedPassword,
    });

    const token = jwt.sign(
        { id: user.id, email: data.email},
        process.env.TOKEN_KEY,
        {expiresIn: 365 * 24 * 60 * 60 * 1000,}
    );
    // save user token
    user.token = token;
    await user.save({ fields: ['token'] });
    return res.status(201).json(user)
}

exports.login = async (req, res) => {

}


exports.update = async (req, res) => {
    return res.send("NOT IMPLEMENTED: Site Home Page");
};

exports.delete = async (req, res) => {
    return res.send("NOT IMPLEMENTED: Site Home Page");
};