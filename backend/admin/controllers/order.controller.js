const Order = require("../../models/order");
const Product = require("../../models/product");
const pushAdminNotification = require("../../utils/adminNotification");
const orderCancelledTemplate = require("../../utils/emailTemplate/orderCancelledByAdminTemplate");
const orderCompletedTemplate = require("../../utils/emailTemplate/orderCompletedEmailTemplate");
const refundIssuedTemplate = require("../../utils/emailTemplate/refundIssuedTemplate");
const sendEmail = require("../../utils/sendEmail");
const AdminActivityLog = require("../models/AdminActivityLog");
const { onOrderCompleted, onOrderCancelled } = require("./stats.controller");
const User=require("../../models/user")
exports.getAllOrders = async (req, res) => {
    try {
        let { page = 1, limit = 20, search = "" } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        /* ================= SEARCH QUERY ================= */
        const query = {};

        if (search) {
            query.$or = [
                { orderId: { $regex: search, $options: "i" } },
                { fullName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ];
        }

        /* ================= PAGINATION ================= */
        const skip = (page - 1) * limit;

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalOrders = await Order.countDocuments(query);

        return res.status(200).json({
            success: true,
            orders,
            pagination: {
                page,
                limit,
                totalOrders,
                totalPages: Math.ceil(totalOrders / limit),
                hasMore: skip + orders.length < totalOrders,
            },
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching orders.",
            error: error.message,
        });
    }
};

exports.getOrderById = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        order.isViewed = true;
        await order.save();

        return res.json({
            success: true,
            order,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({
                success: false,
                message: "Order ID and status are required",
            });
        }

        const order = await Order.findById(orderId);
       
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        const product = await Product.findById(order.productId);
        const variant = product.variants.id(order.variantSnapshot._id);


        if (["completed", "cancelled"].includes(order.orderStatus)) {
            return res.status(400).json({
                success: false,
                message: "Order can no longer be updated",
            });
        }

        const allowedTransitions = {
            pending: ["reviewing"],
            reviewing: ["processing"],
            processing: ["completed"],
        };

        const currentStatus = order.orderStatus;
        const allowedNext = allowedTransitions[currentStatus] || [];

        if (!allowedNext.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status transition from ${currentStatus} to ${status}`,
            });
        }

        order.orderStatus = status;

        if (status === "reviewing") {
            order.reviewingAt = new Date();
        }

        if (status === "processing") {
            order.processingAt = new Date();
        }

        if (status === "completed") {
            variant.reservedStock -= 1;
            await product.save();
            order.status = "completed";
            await order.save();
            await onOrderCompleted();
            order.completedAt = new Date();

            await sendEmail({
                to: order.email,
                subject: "Your order has been completed successfully",
                html: orderCompletedTemplate({
                    name: order.fullName,
                    orderId:order.orderId,
                    productName: order.productSnapshot.service,
                    quantity: 1,
                    price: order.variantSnapshot.price,
                    total: order.totalAmount,
                    paymentMethod: order.paymentMethod,
                    currency: order.currency
                })
            });

            await AdminActivityLog.create({
                adminId: req.admin.id,
                action: "Order completed",
                ip: req.ip,
                userAgent: req.headers["user-agent"]
            });
        }

        await order.save();

        return res.json({
            success: true,
            order,
        });

    } catch (error) {
        console.error("Update Order Status Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const generateRefundReferenceId = (orderId) => {
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `REF-${orderId}-${random}`;
};


exports.updateRefundStatus = async (req, res) => {
    try {
        const { orderId, refundStatus } = req.body;

        if (!orderId || !refundStatus) {
            return res.status(400).json({
                success: false,
                message: "Order ID and refund status are required",
            });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        if (order.orderStatus !== "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Refund allowed only for cancelled orders",
            });
        }

        const allowedRefundTransitions = {
            pending: ["initiated"],
            initiated: ["completed"],
        };

        const currentRefundStatus = order.refundStatus || "pending";
        const allowedNext = allowedRefundTransitions[currentRefundStatus] || [];

        if (!allowedNext.includes(refundStatus)) {
            return res.status(400).json({
                success: false,
                message: `Invalid refund transition from ${currentRefundStatus} to ${refundStatus}`,
            });
        }

        order.refundStatus = refundStatus;

        if (refundStatus === "initiated") {
            order.refundInitiatedAt = new Date();
        }

        if (refundStatus === "completed") {
            const refundReferenceId = generateRefundReferenceId(order.orderId);
            order.refundCompletedAt = new Date();
            await sendEmail({
                to: order.email,
                subject: `Refund Issued of your order ${order.productSnapshot.service}`,
                html: refundIssuedTemplate({
                    name: order.fullName,
                    orderId:order.orderId,
                    productName: order.productSnapshot.service,
                    quantity: 1,
                    refundAmount: order.totalAmount,
                    paymentMethod: order.paymentMethod,
                    currency: order.currency,
                    refundReference: refundReferenceId
                })
            });

            await AdminActivityLog.create({
                adminId: req.admin.id,
                action: "Refund Issued",
                ip: req.ip,
                userAgent: req.headers["user-agent"]
            });

            await pushAdminNotification({
                type: "refund_issued",
                title: "Refund Issued",
                message: `Refund Issued for order (#${order.orderId}) & refunded  by ${req.admin.name}`,
                userId: order.userId,
                data: {
                    orderId: order._id,
                    orderName: order.productSnapshot.service,
                    redirectTo: "/admin/dashboard/complete-order/",
                    refundReference: refundReferenceId
                },
            });

           const user=await User.findByIdAndUpdate(
                order.userId,
                { $inc: { totalAmountSpent: -order.totalAmount } }
            );
            if (user.totalAmountSpent >= 5000 && !user.isVerifiedBadge) {
                user.isVerifiedBadge = true;
                await user.save();
            }
        }

        await order.save();

        return res.json({
            success: true,
            order,
        });

    } catch (error) {
        console.error("Update Refund Status Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

exports.cancelOrderAndInitiateRefund = async (req, res) => {
    try {
        const { orderId, cancelReason } = req.body;

        const order = await Order.findOne({ _id: orderId });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        const product = await Product.findById(order.productId);
        const variant = product.variants.id(order.variantSnapshot._id);

        if (order.orderStatus === 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Completed orders cannot be cancelled',
            });
        }

        if (order.orderStatus === 'cancelled') {
            
            return res.status(400).json({
                success: false,
                message: 'Order already cancelled',
            });
        }
        variant.stock += 1;
        variant.reservedStock -= 1;
        await product.save();
        order.orderStatus = 'cancelled';
        order.cancelledAt = new Date();
        order.cancelReason = cancelReason;
        order.orderCancelledBy = 'admin';
        order.refundStatus = 'initiated';
        order.refundInitiatedAt = new Date();
        await onOrderCancelled();

        await order.save();

        await sendEmail({
            to: order.email,
            subject: `Your order has been cancelled by ${order.orderCancelledBy === "admin" ? "Easypay" : "You"}`,
            html: orderCancelledTemplate({
                name: order.fullName,
                orderId: order.orderId,
                productName: order.productSnapshot.service,
                quantity: 1,
                price: order.variantSnapshot.price,
                total: order.totalAmount,
                paymentMethod: order.paymentMethod,
                cancelledBy: order.orderCancelledBy,
                cancelReason: order.cancelReason,
                currency: order.currency
            })
        });

        await pushAdminNotification({
            type: "order_cancelled",
            title: "Order Cancelled",
            message: `Cancelled order (#${order.orderId}) & refund initiated by ${req.admin.name}`,
            userId: order.userId,
            data: {
                orderId: order._id,
                orderName:order.productSnapshot.service,
                redirectTo: "/admin/dashboard/complete-order/",
            },
        });

        return res.status(200).json({
            success: true,
            message: 'Order cancelled and refund initiated',
            order,
        });

    } catch (error) {
        console.error('Cancel & refund error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};