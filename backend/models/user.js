const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        phone: {
            type: String,
            default: null,
        },

        password: {
            type: String,
            required: function () {
                return !this.googleId; 
            },
        },

        googleId: {
            type: String,
            default: null,
        },

        // Admin-controlled verification badge
        isVerifiedBadge: {
            type: Boolean,
            default: false,
        },

        // Login security
        loginAttempts: {
            type: Number,
            default: 0,
        },

        isBlocked: {
            type: Boolean,
            default: false,
        },

        lastActive: {
            type: Date,
            default: null,
        },

        // Linked collections
        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order",
            },
        ],


        cart: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
                variantIndex: { type: Number },

                productSnapshot: Object,
                variantSnapshot: Object,

                quantity: { type: Number, default: 1 },
                addedAt: { type: Date, default: Date.now }
            }
        ],


        otp: { type: String, default: null },
        otpExpires: { type: Date, default: null },
        isVerified: { type: Boolean, default: false },
        avatar: { type: String, default: null },
        totalAmountSpent:{type:Number,default:0.00},

    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
