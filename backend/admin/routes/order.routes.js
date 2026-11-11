const express = require("express");
const { getAllOrders, getOrderById, updateRefundStatus, updateOrderStatus, cancelOrderAndInitiateRefund } = require("../controllers/order.controller");
const { verifyAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", verifyAdmin, getAllOrders);
router.get("/order-details/:id", verifyAdmin, getOrderById);
router.patch("/update-status", verifyAdmin, updateOrderStatus);
router.patch("/update-refund", verifyAdmin, updateRefundStatus);
router.post("/cancel-order", verifyAdmin, cancelOrderAndInitiateRefund);


module.exports = router;
