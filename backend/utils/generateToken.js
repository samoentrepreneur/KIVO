const jwt = require("jsonwebtoken");

const generateAccessToken = (admin) => {
    return jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.ACCESS_SECRET,
        { expiresIn: "1h" }
    );
};

const generateRefreshToken = (admin) => {
    return jwt.sign(
        { id: admin._id, tokenVersion: admin.tokenVersion },
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" }
    );
};

module.exports = { generateAccessToken, generateRefreshToken };
