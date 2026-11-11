const express = require("express");
const router = express.Router();

const {
    getNotifications,
    markAsRead,
} = require("../controllers/notification.controller");

const { verifyAdmin } = require("../middlewares/auth.middleware");

router.get("/", verifyAdmin, getNotifications);
router.patch("/:id/read", verifyAdmin, markAsRead);

module.exports = router;
