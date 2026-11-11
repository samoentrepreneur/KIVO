const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies?.user_access;

        if (!token)
            return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

        const user = await User.findById(decoded.id);
        if (!user)
            return res.status(404).json({ message: "User not found" });

        req.user = { id: user._id, email: user.email };
        next();

    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = verifyUser;
