const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },

    productName: {
        type: String,
        required: true,
    },

    variant: {
        price: { type: Number, required: true },
        diamonds: { type: Number, default: null },
    },

    quantity: {
        type: Number,
        default: 1,
        min: 1,
    },

    subtotal: {
        type: Number,
        required: true,
    },
});

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true, // <--- only ONE cart per user
        },

        items: [cartItemSchema],

        totalAmount: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
