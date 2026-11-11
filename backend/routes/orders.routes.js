const express = require("express");
const router = express.Router();
const upload = require("../admin/middlewares/upload");
const { createOrder, toggleCart, getMyOrders, getOrderById, cancelOrderAndInitiateRefund } = require("../controllers/orders.controller");
const verifyUser = require("../middlewares/user.middlerware");


// single image name must match frontend field name
router.post("/create", verifyUser, upload.single("screenshot"), createOrder);
router.post("/toggle-cart", verifyUser, toggleCart);
router.get("/get-my-orders", verifyUser, getMyOrders);
router.get("/track-order/:id", verifyUser, getOrderById);
router.post("/cancel-order", verifyUser, cancelOrderAndInitiateRefund);


module.exports = router;
