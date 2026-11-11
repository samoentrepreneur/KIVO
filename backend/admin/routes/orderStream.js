const express = require("express");
const { verifyAdmin } = require("../middlewares/auth.middleware");
const { checkRole } = require("../middlewares/checkRole.middlerware");
const router = express.Router();

let clients = [];

router.get("/stream", verifyAdmin, checkRole, (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    clients.push(res);

    req.on("close", () => {
        clients = clients.filter(c => c !== res);
    });
});

module.exports = { router, clients };
