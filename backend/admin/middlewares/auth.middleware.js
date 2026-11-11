const jwt = require("jsonwebtoken");
const { Admin } = require("../models/admin.model");
const { generateAccessToken } = require("../../utils/generateToken");

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const COOKIE_CLEAR_OPTIONS = {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: IS_PRODUCTION ? "none" : "lax"
};

const verifyAdmin = async (req, res, next) => {
    try {
        const accessToken = req.cookies.admin_access;
        const refreshToken = req.cookies.admin_refresh;

        if (!accessToken && !refreshToken) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        // 1️⃣ Try access token
        if (accessToken) {
            try {
                const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET);

                req.admin = {
                    id: decoded.id,
                    role: decoded.role,
                    expiresAt: decoded.exp * 1000,
                };

                return next();
            } catch {
                // fallback to refresh
            }
        }

        // 2️⃣ Refresh token required
        if (!refreshToken) {
            return res.status(401).json({ message: "Session expired, login again" });
        }

        let refreshDecoded;
        try {
            refreshDecoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        } catch {
            res.clearCookie("admin_access", COOKIE_CLEAR_OPTIONS);
            res.clearCookie("admin_refresh", COOKIE_CLEAR_OPTIONS);
            return res.status(401).json({ message: "Session expired, login again" });
        }

        const admin = await Admin.findById(refreshDecoded.id);
        if (!admin || admin.tokenVersion !== refreshDecoded.tokenVersion) {
            res.clearCookie("admin_access", COOKIE_CLEAR_OPTIONS);
            res.clearCookie("admin_refresh", COOKIE_CLEAR_OPTIONS);
            return res.status(401).json({ message: "Invalid session, login again" });
        }

        // 3️⃣ Issue new access token
        const newAccess = generateAccessToken(admin);
        const newDecoded = jwt.verify(newAccess, process.env.ACCESS_SECRET);

        res.cookie("admin_access", newAccess, {
            httpOnly: true,
            secure: IS_PRODUCTION,
            sameSite: IS_PRODUCTION ? "none" : "lax",
            maxAge: 60 * 60 * 1000,
        });

        req.admin = {
            id: admin._id.toString(),
            role: admin.role,
            expiresAt: newDecoded.exp * 1000,
        };

        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Authentication error" });
    }
};

module.exports = { verifyAdmin };
