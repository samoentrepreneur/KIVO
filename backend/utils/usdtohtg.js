const express = require("express");
const router = express.Router();
const { getUsdToHtgRate } = require("../config/currency.service");

router.get("/usd-to-htg-rate", async (req, res) => {
    try {
        const rate = await getUsdToHtgRate();
        return res.json({ rate });
    } catch (err) {
        return res.status(500).json({ error: "Rate fetch failed" });
    }
});

module.exports = router;
