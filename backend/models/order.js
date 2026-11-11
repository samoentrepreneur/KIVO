const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        orderId: {
            type: String,
            required: true,
            unique: true,
        },

        // Single product details
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        productSnapshot: {
            type: Object,
            required: true,
        },

        variantSnapshot: {
            type: Object,
            required: true,
        },

        quantity: {
            type: Number,
            default: 1,
        },

        totalAmount: {
            type: Number,
            required: true,
        },

        // Payment details
        paymentMethod: {
            type: String,
            enum: ["moncash", "natcash", "paypal", "card"],
            required: true,
        },

        paymentPhone: String,
        transactionId: String,

        paymentScreenshotUrl: String,
        paymentScreenshotPublicId: String,

        // Customer Info
        fullName: String,
        email: String,
        phone: String,
        recipientEmail: String,
        orderNotes: String,


        // Dynamic (depending on product type)
        gameDetails: {
            gameId: String,
            username: String,
            region: String,
        },

        streamingDetails: {
            streamEmail: String,
            streamUsername: String,
            streamPassword: String,
            region: String,
        },
        wiseEmailOrId: String,
        meruCardId: String,
        card: {
            cardNumber: String,
            expiryDate: String,
            cvv: String,
        },
        orderStatus: {
            type: String,
            enum: ["pending", "reviewing", "processing", "completed", "cancelled"],
            default: "pending",
        },

        refundStatus: {
            type: String,
            enum: ["pending", "initiated", "completed"],
            default: "pending",
        },

        reviewingAt: Date,
        processingAt: Date,
        completedAt: Date,
        cancelledAt: Date,

        refundInitiatedAt: Date,
        refundCompletedAt: Date,
        cancelReason: String,
        orderCancelledBy: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        isViewed: {
            type: Boolean,
            default: false
        }

    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
