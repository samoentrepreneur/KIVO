const mongoose = require("mongoose");

const adminNotificationSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: [
                "order_created",
                "order_cancelled",
                "message_received",
                "refund_requested",
            ],
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        message: {
            type: String,
            required: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        data: {
            type: Object,
            default: {},
            // Example:
            // { orderId, redirectTo: "order-details" }
        },

        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("AdminNotification", adminNotificationSchema);
