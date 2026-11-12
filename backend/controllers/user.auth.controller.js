const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");
const { generateAccessToken } = require("../utils/user.generateToken");
const Token = require("../models/token");
const resetPassTemplate = require("../utils/emailTemplate/resetPassTemplate");
const { onUserCreated } = require("../admin/controllers/stats.controller");
const otpTemplate = require("../utils/emailTemplate/otpTemplate");
const { Advertisement } = require("../admin/models/ad.model");

// Same-host HTTP development (VPS IP) uses Lax cookies; HTTPS production uses cross-site cookies.
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: IS_PRODUCTION ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

const generateOtp = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

const sendOtpEmail = async (email, otp, subject, minutes) => {
    await sendEmail({
        to: email,
        subject,
        html: `<b>${otp}</b> is your code. Valid for ${minutes} minutes.`,
    });
};

const createOtpForUser = async (user, expiresInMinutes) => {
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = Date.now() + expiresInMinutes * 60 * 1000;
    await user.save();
    return otp;
};

const completeLogin = (user, res) => {
    const token = generateAccessToken(user);
    res.cookie("user_access", token, COOKIE_OPTIONS);

    return res.json({
        success: true,
        message: "Login successful",
        user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar || null,
            phone: user.phone || null,
            isVerifiedBadge: user.isVerifiedBadge,
            lastActive: user.lastActive || null,
        },
    });
};

// REGISTER
exports.register = async (req, res) => {
    try {
        const { fullName, phone, email, password } = req.body;
        const emailOtpEnabled = process.env.EMAIL_OTP_ENABLED === "true";

        if (!fullName || !phone || !email || !password)
            return res.status(400).json({ message: "All fields are required" });

        let user = await User.findOne({ email: email.trim().toLowerCase() });

        if (user && user.isVerified)
            return res.status(400).json({ message: "Email already exists" });

        if (user) {
            user.fullName = fullName.trim();
            user.phone = phone;
            user.password = await bcrypt.hash(password, 10);
        } else {
            user = new User({
                fullName: fullName.trim(),
                phone,
                email: email.trim().toLowerCase(),
                password: await bcrypt.hash(password, 10),
            });
        }

        if (emailOtpEnabled) {
            const otp = await createOtpForUser(user, 2);
            await sendOtpEmail(user.email, otp, "Verify your email", 2);

            return res.json({
                success: true,
                requiresOtp: true,
                message: "Registration successful. Verify your email with the OTP.",
            });
        }

        // OTP disabled: verify the account immediately and establish the session.
        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        await onUserCreated();

        return completeLogin(user, res);

    } catch (error) {
        console.error("[AUTH][REGISTER]", error);
        return res.status(500).json({ message: "Registration failed. Please try again." });
    }
};
    try {
        const { fullName, phone, email, password } = req.body;

        if (!fullName || !phone || !email || !password)
            return res.status(400).json({ message: "All fields are required" });

        let user = await User.findOne({ email });

        if (user && user.isVerified)
            return res.status(400).json({ message: "Email already exists" });

        if (user && !user.isVerified) {
            const otp = await createOtpForUser(user, 2);

            user.fullName = fullName;
            user.phone = phone;
            user.password = await bcrypt.hash(password, 10);
            await user.save();

            await sendOtpEmail(email, otp, "Verify your email", 2);

            return res.json({
                success: true,
                message: "User exists but not verified. New OTP sent.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            fullName,
            phone,
            email,
            password: hashedPassword,
        });

        const otp = await createOtpForUser(newUser, 2);
        await sendOtpEmail(email, otp, "Verify your email", 2);

        return res.json({ success: true, message: "Registered. OTP sent." });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

// VERIFY REGISTER OTP
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.isVerified)
            return res.status(400).json({ message: "Already verified" });

        if (user.otp !== otp || Date.now() > user.otpExpires)
            return res.status(400).json({ message: "Invalid or expired OTP" });

        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();
        await onUserCreated();

        return completeLogin(user, res);

    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

// LOGIN REQUEST
exports.loginRequest = async (req, res) => {
    try {
        const {
            email,
            password,
            googleId,
            avatar,
            fullName
        } = req.body;

        let user = await User.findOne({ email });

        if (googleId) {
            if (!user) {
                user = await User.create({
                    email,
                    fullName,
                    googleId,
                    avatar: avatar || null,
                    isVerified: true,
                    lastActive: Date.now(),
                });

                return completeLogin(user, res);
            }

            if (!user.googleId) {
                user.googleId = googleId;
            }

            user.isVerified = true;
            user.avatar = avatar || user.avatar;
            user.lastActive = Date.now();

            await user.save();
            return completeLogin(user, res);
        }

        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return res.status(400).json({ message: "Invalid credentials" });

        if (process.env.EMAIL_OTP_ENABLED !== "true") {
            user.lastActive = Date.now();
            await user.save();
            return completeLogin(user, res);
        }

        const otp = await createOtpForUser(user, 10);

        await sendEmail({
            to: email,
            subject: "Login verification code",
            html: otpTemplate({ name: user.fullName, otp }),
        });

        return res.json({
            success: true,
            message: "OTP sent",
            requiresOtp: true,
        });

    } catch (error) {
        console.error("[AUTH][LOGIN]", error);
        return res.status(500).json({ message: "Login failed. Please try again." });
    }
};

// VERIFY LOGIN OTP
exports.verifyLoginOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.otp || user.otp !== otp || Date.now() > user.otpExpires)
            return res.status(400).json({ message: "Invalid or expired OTP" });

        user.otp = null;
        user.otpExpires = null;
        user.lastActive = Date.now();

        await user.save();

        return completeLogin(user, res);

    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

// LOGOUT
exports.logout = (req, res) => {
    try {
        res.clearCookie("user_access", {
            httpOnly: true,
            secure: IS_PRODUCTION,
            sameSite: IS_PRODUCTION ? "none" : "lax",
        });
        return res.json({ success: true, message: "Logged out" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

// PROFILE
exports.getUserProfile = async (req, res) => {
    try {
        if (!req.user?.id)
            return res.status(401).json({ message: "Unauthorized" });

        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json("user not found");
      
        const userProfile = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone || null,
            isVerified: user.isVerified,
            avatar: user.avatar || null,
            lastActive: user.lastActive || null,
            isVerifiedBadge: user.isVerifiedBadge || false,
            orders: user.orders || null,
            cart: user.cart || null,
            createdAt: user.createdAt || null,
            totalAmountSpents: user.totalAmountSpent || 0
        };

        return res.json({ success: true, user: userProfile });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

exports.GetAdvertisement = async (req, res) => {
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

// RESEND OTP
exports.resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        const otp = await createOtpForUser(user, 2);
        await sendEmail({
            to: email,
            subject: "Login verification code",
            html: otpTemplate({ name: user.fullName, otp }),
        });

        return res.json({
            success: true,
            message: "New OTP sent to your email",
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        await Token.deleteOne({ userId: user._id });

        const resetToken = jwt.sign(
            { id: user._id },
            process.env.RESET_SECRET,
            { expiresIn: "15m" }
        );
        await Token.create({ userId: user._id, token: resetToken });

        const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password?token=${resetToken}`;

        await sendEmail({
            to: user.email,
            subject: "Reset Your Password",
            html: resetPassTemplate({ name: user.fullName, resetLink: resetUrl })
        });

        return res.json({
            success: true,
            message: "OTP sent to your email",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", error });
    }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
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

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const hashedPass = await bcrypt.hash(password, 10);
        user.password = hashedPass;
        await user.save();

        await Token.deleteOne({ _id: storedToken._id });

        return res.json({
            success: true,
            message: "Password updated successfully"
        });
    } catch (err) {
        console.error("Reset Password Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// VALIDATE RESET TOKEN
exports.validateResetToken = async (req, res) => {
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

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(400).json({ valid: false });
        }

        return res.json({ valid: true });
    } catch (err) {
        console.error("Validate Reset Token Error:", err);
        return res.status(400).json({ valid: false });
    }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;

        if (!userId || !currentPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
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

        user.password = newHashedPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });
    } catch (error) {
        console.error("Change Password Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// EDIT PROFILE
exports.editProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const { fullName, phone } = req.body;

        if (!fullName && !phone) {
            return res.status(400).json({
                message: "Nothing to update"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (fullName) user.fullName = fullName.trim();
        if (phone) user.phone = phone.trim();

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
        });

    } catch (error) {
        console.error("Edit Profile Error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
