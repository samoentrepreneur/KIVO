const mongoose = require("mongoose");

const adminLogSchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    action: { type: String, required: true },
    ip: String,
    userAgent: String,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AdminActivityLog", adminLogSchema);
