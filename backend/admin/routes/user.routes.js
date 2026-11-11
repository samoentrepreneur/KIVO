const express = require("express");
const router = express.Router();
const {fetchUserLists} = require("../controllers/users.controller");
const { verifyAdmin } = require("../middlewares/auth.middleware");

// GET: Fetch all users
router.get("/users-list",verifyAdmin, fetchUserLists);

module.exports = router;
