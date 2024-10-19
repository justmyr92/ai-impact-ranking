const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (user_id, user_role) => {
    const payload = {
        user_id: user_id,
        role: user_role,
    };
    const options = {
        expiresIn: "24h",
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, options);
    return token;
};

module.exports = generateToken;
