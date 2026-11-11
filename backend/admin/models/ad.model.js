const mongoose = require("mongoose");

const adSchema = new mongoose.Schema(
    {
    advertisement:String,
    },
    { timestamps: true }
);

const Advertisement = mongoose.model("Advertisement", adSchema);

module.exports = { Advertisement };
