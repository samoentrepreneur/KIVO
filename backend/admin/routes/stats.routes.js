const express = require("express");
const router = express.Router();
const { getStatsFormatted } = require("../controllers/stats.controller");

router.get("/", getStatsFormatted);

module.exports = router;
