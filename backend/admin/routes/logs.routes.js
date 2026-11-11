const express = require("express");
const router = express.Router();

const verifyAdmin = require("../middlewares/auth.middleware.js").verifyAdmin;
const { getActivityLogs } = require("../controllers/logs.controller");

// Fetch logs (supports pagination + search + role restrictions)
router.get("/", verifyAdmin, getActivityLogs);

module.exports = router;
