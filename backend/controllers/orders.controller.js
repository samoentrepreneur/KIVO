const Order = require("../models/order");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const { onOrderCompleted, onOrderCancelled } = require("../admin/controllers/stats.controller");
const sendEmail = require("../utils/sendEmail");
const orderReceivedTemplate = require("../utils/emailTemplate/orderRecievedTemplate");
const { Admin } = require("../admin/models/admin.model");
const adminOrderAssignedTemplate = require("../utils/emailTemplate/orderAssignedEmailTemplate");
const User = require("../models/user");
const Product = require("../models/product");
const orderCancelledByUserTemplate = require("../utils/emailTemplate/orderCancelledByUserTemplate");
const pushAdminNotification = require("../utils/adminNotification");
const orderCompletedTemplate = require("../utils/emailTemplate/orderCompletedEmailTemplate");
const adminOrderCancelledByUserTemplate = require("../utils/emailTemplate/notifyOrderCancellationToAdmin");

exports.createOrder = async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            paymentMethod,
            paymentPhone,
            transactionId,
            orderNotes,
            recipientEmail,
            product,
            variant,
            gameId,
            gameUsername,
            region,
            streamEmail,
            streamUsername,
            streamPassword,
            totalAmount,
            meruCardId,
            wiseEmailOrId,
            cardNumber,
            expiryDate,
            cvv,
        } = req.body;

        let screenshotUrl = null;
        let screenshotPublicId = null;

        if (req.file) {
            const upload = await cloudinary.uploader.upload(req.file.path, {
                folder: "easypay/orders",
            });

            screenshotUrl = upload.secure_url;
            screenshotPublicId = upload.public_id;
            fs.unlinkSync(req.file.path);
        }
        const admins = await Admin.find().select("email -_id").lean();
        const adminEmails = admins.map(admin => admin.email);

        const parsedProduct = typeof product === "string" ? JSON.parse(product) : product;
        const parsedVariant = typeof variant === "string" ? JSON.parse(variant) : variant;
        const dbProduct = await Product.findById(parsedProduct._id);

        if (!dbProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const dbVariant = dbProduct.variants.id(parsedVariant._id);
        console.log("DB VARIANT:", dbVariant);

        if (!dbVariant) {
            return res.status(404).json({ success: false, message: "Variant not found" });
        }

        if (dbVariant.stock < 1) {
            return res.status(400).json({
                success: false,
                message: "Selected variant is out of stock",
            });
        }

        dbVariant.stock -= 1;
        dbVariant.reservedStock += 1;
        await dbProduct.save();

        const orderId = "ORD-" + Date.now();
        const order = await Order.create({
            orderId,
            userId: req.user.id,

            productId: parsedProduct._id,
            productSnapshot: parsedProduct,
            variantSnapshot: parsedVariant,
            totalAmount,


            paymentMethod,
            paymentPhone,
            transactionId,
            paymentScreenshotUrl: screenshotUrl,
            paymentScreenshotPublicId: screenshotPublicId,

            fullName,
            email,
            phone,
            recipientEmail,
            orderNotes,

            gameDetails: gameId ? { gameId, username: gameUsername, region } : undefined,
            streamingDetails: streamEmail ? { streamEmail, streamUsername, streamPassword } : undefined,
            meruCardId,
            wiseEmailOrId,
            card: cardNumber? {
                cardNumber,
                expiryDate,
                cvv
            }:undefined
        });

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                $push: { orders: order._id },
                $inc: { totalAmountSpent: order.totalAmount }
            },
            { new: true }
        );

        if (user.totalAmountSpent >= 5000 && !user.isVerifiedBadge) {
            user.isVerifiedBadge = true;
            await user.save();
        }

        await sendEmail({
            to: email,
            subject: "Order Confirmation",
            html: orderReceivedTemplate({
                name: fullName,
                orderId,
                productName: parsedProduct.service,
                quantity: 1,
                price: parsedVariant.price,
                total: parsedVariant.price,
                paymentMethod,
                currency: parsedProduct.currency
            })
        });
        const dashboardUrl = `${process.env.CLIENT_URL}/admin/dashboard`;

        await sendEmail({
            to: adminEmails,
            subject: `Alert: New Order (#${orderId})`,
            html: adminOrderAssignedTemplate({
                orderId,
                productName: parsedProduct.service,
                quantity: 1,
                price: parsedVariant.price,
                customerName: fullName,
                customerEmail: email,
                total: parsedVariant.price,
                dashboardUrl,
                currency: parsedProduct.currency
            })
        });

        await pushAdminNotification({
            type: "order_created",
            title: "New Order Received",
            message: `Customer placed a new order (#${order.orderId})`,
            userId: req.user.id,
            data: {
                orderId: order._id,
                orderName: order.productSnapshot.service,
                redirectTo: "/admin/dashboard/complete-order",
            },
        });


        res.status(201).json({ success: true, message: "Order placed successfully", order });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.cancelOrderAndInitiateRefund = async (req, res) => {
    try {
        const { orderId, cancelReason } = req.body;

        const order = await Order.findOne({ _id: orderId });
        const admins = await Admin.find().select("email -_id").lean();
        const adminEmails = admins.map(admin => admin.email);

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
        // await User.findByIdAndUpdate(
        //     req.user.id,
        //     {
        //         $inc: { totalAmountSpent: -order.totalAmount }
        //     }
        // );

        variant.stock += 1;
        variant.reservedStock -= 1;
        await product.save();
        order.orderStatus = 'cancelled';
        order.cancelledAt = new Date();
        order.cancelReason = cancelReason;
        order.orderCancelledBy = 'user';
        order.refundStatus = 'initiated';
        order.refundInitiatedAt = new Date();


        await order.save();
        await onOrderCancelled();

        await sendEmail({
            to: order.email,
            subject: `You cancelled order ${order.productSnapshot.service}`,
            html: orderCancelledByUserTemplate({
                name: order.fullName,
                orderId: order.orderId,
                productName: order.productSnapshot.service,
                quantity: 1,
                price: order.variantSnapshot.price,
                total: order.totalAmount,
                paymentMethod: order.paymentMethod,
                cancelReason: order.cancelReason,
                currency: order.currency,
            })
        });
        await sendEmail({
            to: adminEmails,
            subject: `Alert: Order cancelled (#${order.orderId})`,
            html: adminOrderCancelledByUserTemplate({
                userName: order.fullName,
                userEmail: order.email,
                orderId: order.orderId,
                productName: order.productSnapshot.service,
                quantity: 1,
                totalAmount: order.totalAmount,
                paymentMethod: order.paymentMethod,
                cancelReason: order.cancelReason,
                currency: order.currency
            })
        });

        await pushAdminNotification({
            type: "order_cancelled",
            title: "Order Cancelled",
            message: `Customer cancelled order (#${order.orderId}) & initiate refund`,
            userId: order.userId,
            data: {
                orderId: order._id,
                orderName: order.productSnapshot.service,
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




// POST /cart/toggle
exports.toggleCart = async (req, res) => {
    try {
        const { productId, variantIndex } = req.body;
        const userId = req.user.id;
        const product = await Product.findById(productId).lean();
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });

        const variant = product.variants[variantIndex];
        if (!variant)
            return res.status(404).json({ success: false, message: "Invalid variant" });

        const user = await User.findById(userId);

        const existingItem = user.cart.find(
            (item) =>
                item.productId.toString() === productId &&
                item.variantIndex === variantIndex
        );

        if (existingItem) {
            // REMOVE ITEM
            user.cart = user.cart.filter(
                (item) =>
                    !(
                        item.productId.toString() === productId &&
                        item.variantIndex === variantIndex
                    )
            );

            await user.save();

            return res.json({
                success: true,
                removed: true,
                cart: user.cart
            });
        }

        // ADD ITEM
        user.cart.push({
            productId,
            variantIndex,
            productSnapshot: {
                _id: product._id,
                service: product.service,
                currency: product.currency,
                image: product.image,
                category: product.category,
                desc: product.description
            },
            variantSnapshot: variant,
            quantity: 1
        });

        await user.save();

        return res.json({
            success: true,
            added: true,
            cart: user.cart
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};




exports.getMyOrders = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate({
                path: "orders",
                options: { sort: { createdAt: -1 } }
            })
            .select("orders");


        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.json({
            success: true,
            orders: user.orders
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Server error" });
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
