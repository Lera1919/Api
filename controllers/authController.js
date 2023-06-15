
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;

exports.login = async (req, res) => {

    const { email, password } = req.body;

    if (!(email && password)) {
        return res.status(400).send("All input is required");
    }

    const user = await User.findOne({ where: {email} });

    if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: 1 * 24 * 60 * 60 * 1000,
            }
        );

        // save user token
        user.token = token;

        // user
        return res.status(200).json(user);
    }
    
    return res.status(400).send("Invalid Credentials");

};