const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Admin } = require("../models/admin.model.js");
const sendEmail = require("../../utils/sendEmail.js");
const Token = require("../models/token.js");
const AdminActivityLog = require("../models/AdminActivityLog.js");
const { generateAccessToken, generateRefreshToken } = require("../../utils/generateToken.js");
const welcomeAdminTemplate = require("../../utils/emailTemplate/welcomeAdminTemplate.js");
const otpTemplate = require("../../utils/emailTemplate/otpTemplate.js");
const resetPassTemplate = require("../../utils/emailTemplate/resetPassTemplate.js");
const securityWarningTemplate = require("../../utils/emailTemplate/securityWarningTemplate.js");
const passwordResetSuccessTemplate = require("../../utils/emailTemplate/resetPasswordSuccessEmailtemplates.js");
const { default: mongoose } = require("mongoose");
const { Advertisement } = require("../models/ad.model.js");

// Same-host HTTP development (VPS IP) uses Lax cookies; HTTPS production uses cross-site cookies.
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: IS_PRODUCTION ? "none" : "lax",
};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const createAdmin = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existing = await Admin.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);

        const admin = await Admin.create({
            name,
            email,
            password: hashed,
            role: role || "admin",
            tokenVersion: 0
        });

        return res.status(201).json({
            success: true,
            message: "Admin created",
            admin
        });
    } catch (err) {
        console.error("Create Admin Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email, isActive: true });

        if (!admin) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (admin.lockUntil && admin.lockUntil > Date.now()) {
            const mins = Math.ceil((admin.lockUntil - Date.now()) / 60000);
            return res.status(429).json({ message: `Locked. Try again in ${mins} min.` });
        }

        const valid = await bcrypt.compare(password, admin.password);
        if (!valid) {
            admin.failedLoginAttempts = (admin.failedLoginAttempts || 0) + 1;

            if (admin.failedLoginAttempts >= 3) {
                admin.lockUntil = Date.now() + 30 * 60000;
                await admin.save();
                return res.status(429).json({ message: "Too many attempts. Locked for 30 minutes." });
            }

            await admin.save();
            return res.status(401).json({ message: "Invalid credentials" });
        }

        admin.failedLoginAttempts = 0;
        admin.lockUntil = null;

        admin.lastActivity = Date.now();

        // Reuse the global OTP switch: when disabled, issue the admin session directly.
        if (process.env.EMAIL_OTP_ENABLED !== "true") {
            admin.otp = null;
            admin.otpExpires = null;
            await admin.save();

            const access = generateAccessToken(admin);
            const refresh = generateRefreshToken(admin, {
                remember: true,
                deviceId: req.headers["user-agent"]
            });

            res.cookie("admin_access", access, {
                ...COOKIE_OPTIONS,
                maxAge: 60 * 60 * 1000
            });

            res.cookie("admin_refresh", refresh, {
                ...COOKIE_OPTIONS,
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            await AdminActivityLog.create({
                adminId: admin._id,
                action: "Admin logged in",
                ip: req.ip,
                userAgent: req.headers["user-agent"]
            });

            return res.json({
                success: true,
                requiresOtp: false,
                message: "Admin login successful",
                admin: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role
                }
            });
        }

        const otp = generateOtp();
        admin.otp = otp;
        admin.otpExpires = Date.now() + 2 * 60000;
        await admin.save();

        await sendEmail({
            to: email,
            subject: "OTP verification code for Admin Login",
            html: otpTemplate({ otp, name: admin.name })
        });

        return res.json({ success: true, requiresOtp: true, message: "OTP sent" });
    } catch (err) {
        console.error("[ADMIN AUTH][LOGIN]", err);
        return res.status(500).json({ message: "Server error" });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin || admin.otp !== otp || admin.otpExpires < Date.now()) {
            return res.status(401).json({ message: "Invalid or expired OTP" });
        }

        admin.otp = null;
        admin.otpExpires = null;
        admin.lastActivity = Date.now();
        await admin.save();

        const access = generateAccessToken(admin);
        const refresh = generateRefreshToken(admin, {
            remember: true,
            deviceId: req.headers["user-agent"]
        });

        res.cookie("admin_access", access, {
            ...COOKIE_OPTIONS,
            maxAge: 60 * 60 * 1000
        });

        res.cookie("admin_refresh", refresh, {
            ...COOKIE_OPTIONS,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({
            success: true,
            message: "OTP verified",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (err) {
        console.error("Verify OTP Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        if (admin.lockUntil && admin.lockUntil > Date.now()) {
            return res.status(429).json({ message: "Account locked. Try later." });
        }

        const otp = generateOtp();
        admin.otp = otp;
        admin.otpExpires = Date.now() + 2 * 60000;
        await admin.save();

        await sendEmail({
            to: email,
            subject: "Your Easypay Admin Verification Code",
            html: otpTemplate({ otp, name: admin.name })
        });

        return res.json({ success: true, message: "OTP resent" });
    } catch (err) {
        console.error("Resend OTP Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

const refreshAccessToken = async (req, res) => {
    try {
        const token = req.cookies.admin_refresh;
        
        if (!token) {
            return res.status(401).json({ message: "No refresh token" });
        }

        const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
        const admin = await Admin.findById(decoded.id);

        if (!admin || admin.tokenVersion !== decoded.tokenVersion) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = generateAccessToken(admin);

        res.cookie("admin_access", newAccessToken, {
            ...COOKIE_OPTIONS,
            maxAge: 60 * 60 * 1000
        });

        const newDecoded = jwt.decode(newAccessToken);
        return res.json({
            success: true,
            expiresAt: newDecoded.exp * 1000 
        });

    } catch (err) {
        res.clearCookie("admin_access", COOKIE_OPTIONS);
        res.clearCookie("admin_refresh", COOKIE_OPTIONS);
        console.error("Refresh Token Error:", err);
        return res.status(401).json({ message: "Session expired. Login again." });
    }
};

const getAdminProfile = async (req, res) => {
    try {
        if (!req.admin || !req.admin.id) {
            return res.status(401).json({ message: "Unauthorized or token missing" });
        }

        const admin = await Admin.findById(req.admin.id).select("-password");

        if (!admin) return res.status(404).json({ message: "Admin not found" });

        return res.json({ success: true, admin, expiresAt: req.admin.expiresAt });

    } catch (err) {
        console.error("Get Admin Profile Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

const logoutAdmin = async (req, res) => {
    try {
        const refreshToken = req.cookies.admin_refresh;

        if (refreshToken) {
            try {
                const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
                await Admin.findByIdAndUpdate(decoded.id, { $inc: { tokenVersion: 1 } });
            } catch (e) {
                // Ignore token verification errors during logout
            }
        }

        res.clearCookie("admin_access", COOKIE_OPTIONS);
        res.clearCookie("admin_refresh", COOKIE_OPTIONS);

        return res.json({ message: "Logged out successfully" });
    } catch (err) {
        console.error("Logout Error:", err);
        res.clearCookie("admin_access", COOKIE_OPTIONS);
        res.clearCookie("admin_refresh", COOKIE_OPTIONS);
        return res.json({ message: "Logged out" });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.json({ success: true, message: "Reset link sent if user exists." });
        }

        if (admin.lockUntil && admin.lockUntil > Date.now()) {
            return res.status(429).json({
                success: false,
                message: "Account locked. Try later."
            });
        }

        const recentAttempts = await AdminActivityLog.countDocuments({
            adminId: admin._id,
            action: "Requested password reset",
            createdAt: { $gte: new Date(Date.now() - 15 * 60000) }
        });

        if (recentAttempts >= 3) {
            if (recentAttempts === 3) {
                await sendEmail({
                    to: admin.email,
                    subject: "Security Warning",
                    html: securityWarningTemplate({ name: admin.name })
                });

                await AdminActivityLog.create({
                    adminId: admin._id,
                    action: "Security alert sent",
                    ip: req.ip,
                    userAgent: req.headers["user-agent"]
                });
            }

            return res.status(429).json({
                success: false,
                message: "Too many attempts. Try later."
            });
        }

        await AdminActivityLog.create({
            adminId: admin._id,
            action: "Requested password reset",
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        });

        await Token.deleteOne({ userId: admin._id });

        const resetToken = jwt.sign(
            { id: admin._id },
            process.env.RESET_SECRET,
            { expiresIn: "15m" }
        );

        await Token.create({ userId: admin._id, token: resetToken });

        const resetUrl = `${process.env.CLIENT_URL}/admin/reset-password?token=${resetToken}`;

        await sendEmail({
            to: admin.email,
            subject: "Reset Your Password",
            html: resetPassTemplate({ name: admin.name, resetLink: resetUrl })
        });

        return res.json({
            success: true,
            message: "Reset link sent if user exists."
        });
    } catch (err) {
        console.error("Forgot Password Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ message: "Token and password required" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.RESET_SECRET);
        } catch {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const storedToken = await Token.findOne({ token, userId: decoded.id });

        if (!storedToken) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        if (admin.lockUntil && admin.lockUntil > Date.now()) {
            return res.status(429).json({ message: "Account locked." });
        }

        const hashedPass = await bcrypt.hash(password, 10);
        admin.password = hashedPass;
        await admin.save();

        await Token.deleteOne({ _id: storedToken._id });

        await AdminActivityLog.create({
            adminId: admin._id,
            action: `Admin (${admin.name}) reset password`,
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        });

        await sendEmail({
            to: admin.email,
            subject: "Password Updated successfully",
            html: passwordResetSuccessTemplate({ name: admin.name })
        });

        return res.json({
            success: true,
            message: "Password updated successfully"
        });
    } catch (err) {
        console.error("Reset Password Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

const validateResetToken = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ valid: false });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.RESET_SECRET);
        } catch {
            return res.status(400).json({ valid: false });
        }

        const stored = await Token.findOne({ token });
        if (!stored) {
            return res.status(400).json({ valid: false });
        }

        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return res.status(400).json({ valid: false });
        }

        if (admin.lockUntil && admin.lockUntil > Date.now()) {
            return res.status(400).json({ valid: false });
        }

        return res.json({ valid: true });
    } catch (err) {
        console.error("Validate Reset Token Error:", err);
        return res.status(400).json({ valid: false });
    }
};

const changePassword = async (req, res) => {
    try {
        const { adminId, currentPassword, newPassword } = req.body;

        if (!adminId || !currentPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                message: "New Password must be at least 8 characters long"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);

        admin.password = newHashedPassword;
        await admin.save();

        await AdminActivityLog.create({
            adminId: admin._id,
            action: `Admin (${admin.name}) changed password`,
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        });

        await sendEmail({
            to: admin.email,
            subject: "Password Updated successfully",
            html: passwordResetSuccessTemplate({ name: admin.name })
        });

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });
    } catch (error) {
        console.error("Change Password Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const editProfile = async (req, res) => {
    try {
        const { adminId, name } = req.body;

        if (!adminId || !name) {
            return res.status(400).json({
                message: "Admin ID and name are required"
            });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }

        admin.name = name;
        await admin.save();

        await AdminActivityLog.create({
            adminId: admin._id,
            action: `Admin (${name}) updated profile`,
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        });

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully"
        });
    } catch (error) {
        console.error("Edit Profile Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const addAdmin = async (req, res) => {
    try {
        const { name, email, role } = req.body;

        if (!name || !email || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(409).json({ message: "Admin with this email already exists" });
        }

        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        const newAdmin = await Admin.create({
            name,
            email,
            role,
            password: hashedPassword
        });

        await AdminActivityLog.create({
            adminId: newAdmin._id,
            action: `Admin (${name}) created with role: ${role}`,
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        });

        await sendEmail({
            to: email,
            subject: "Admin Access Activated",
            html: welcomeAdminTemplate({ name, tempPassword, email })
        });

        return res.status(201).json({
            success: true,
            message:
                role === "superadmin"
                    ? "Super Admin added successfully"
                    : role === "developer"
                        ? "Developer added successfully"
                        : "Admin added successfully",
            admin: {
                _id: newAdmin._id,
                name: newAdmin.name,
                email: newAdmin.email,
                role: newAdmin.role
            }
        });
    } catch (error) {
        console.error("Add Admin Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getAdminList = async (req, res) => {
    try {
        const admins = await Admin.find({})
            .select("_id name email role isActive createdAt");

        if (!admins.length) {
            return res.status(404).json({
                success: false,
                message: "No admins found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Admin list fetched successfully",
            total: admins.length,
            admins
        });
    } catch (error) {
        console.error("Get Admin List Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;
        const requester = req.admin;

        if (!mongoose.Types.ObjectId.isValid(adminId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid admin ID.",
            });
        }

        if (!requester || requester.role !== "superadmin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only superadmin can remove admins.",
            });
        }

        if (requester.id.toString() === adminId) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own admin account.",
            });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found.",
            });
        }

        if (admin.role === "superadmin") {
            return res.status(403).json({
                success: false,
                message: "You cannot delete another superadmin.",
            });
        }

        await admin.deleteOne();

        await AdminActivityLog.create({
            adminId: admin._id,
            performedBy: requester._id,
            action: `Admin "${admin.name}" deleted`,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
        });

        return res.status(200).json({
            success: true,
            message: `Admin "${admin.name}" has been removed successfully.`,
            deletedId: admin._id,
        });

    } catch (error) {
        console.error("Delete Admin Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while deleting admin.",
        });
    }
};

const AddAdvertisement = async (req, res) => {
    const { ad } = req.body;

    try {
        if (!ad) {
            return res.status(400).json("Invalid ad content");
        }

        let advertisement = await Advertisement.findOne();

        if (advertisement) {
            advertisement.advertisement = ad;
            await advertisement.save();
        } else {
            advertisement = await Advertisement.create({
                advertisement: ad,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Advertisement saved successfully",
            data: advertisement,
        });

    } catch (err) {
        return res.status(500).json(err);
    }
};

const GetAdvertisement = async (req, res) => {
    try {
        const advertisement = await Advertisement.findOne().sort({ createdAt: -1 });

        if (!advertisement) {
            return res.status(404).json({ message: "No advertisement found" });
        }

        return res.status(200).json({
            success: true,
            advertisement: advertisement.advertisement,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};

const DeleteAdvertisement = async (req, res) => {
    try {
        const deletedAd = await Advertisement.findOneAndDelete();

        if (!deletedAd) {
            return res.status(404).json({
                success: false,
                message: "No advertisement found to delete",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Advertisement deleted successfully",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};

module.exports = {
    createAdmin,
    loginAdmin,
    resendOtp,
    verifyOtp,
    refreshAccessToken,
    getAdminProfile,
    logoutAdmin,
    forgotPassword,
    resetPassword,
    validateResetToken,
    changePassword,
    editProfile,
    addAdmin,
    getAdminList,
    deleteAdmin,
    AddAdvertisement,
    GetAdvertisement,
    DeleteAdvertisement
};
