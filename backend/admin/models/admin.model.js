// models/admin.model.js
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["admin", "superadmin","developer"], default: "admin" },
        isActive: { type: Boolean, default: true },

        // OTP FIELDS
        otp: { type: String, default: null },
        otpExpires: { type: Date, default: null },
        failedLoginAttempts: { type: Number, default: 0 },
        lockUntil: { type: Date, default: null },
        lastActivity: { type: Date, default: Date.now }


    },
    { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = { Admin };
