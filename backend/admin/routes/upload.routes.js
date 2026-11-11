const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { createOrUpdateProduct } = require("../controllers/upload.controller");
const { verifyAdmin } = require("../middlewares/auth.middleware");

router.post("/create-or-update", verifyAdmin, upload.single("image"), createOrUpdateProduct);

module.exports = router;
