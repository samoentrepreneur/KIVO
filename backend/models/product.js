const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true,
        min: 0
    },


    // "unit" | "plan"
    priceType: {
        type: String,
        enum: ["unit", "plan"],
        default: "unit",
    },

    // e.g. "100 + 10"
    unitValue: {
        type: String,
        default: null
    },

    // e.g. "Diamonds", "UC"
    unitLabel: {
        type: String,
        default: null
    },

    // e.g. "Weekly Subscription"
    planName: {
        type: String,
        default: null
    },

    stock: {
        type: Number,
        default: 0,
        min: 0
    },

    reservedStock: {
        type: Number,
        default: 0,
        min: 0
    }
});


const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        unique: true,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    service: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },
    currency: { type: String, required: true },

    image: String,
    imagePublicId: String,

    variants: {
        type: [variantSchema],
        required: true,
        validate: v => Array.isArray(v) && v.length > 0
    }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
