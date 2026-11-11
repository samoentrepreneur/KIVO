const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
    totalUsers: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },

    lastMonthSnapshot: {
        totalUsers: { type: Number, default: 0 },
        totalOrders: { type: Number, default: 0 },
        totalRevenue: { type: Number, default: 0 },
        conversionRate: { type: Number, default: 0 },
    }
}, { timestamps: true });

module.exports = mongoose.model("DashboardStats", statsSchema);
