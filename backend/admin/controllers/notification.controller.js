const Notification = require("../models/notification.model");

exports.getNotifications = async (req, res) => {
    try {

        const notifications = await Notification.find({ })
            .sort({ createdAt: -1 })
            .limit(100);

        const unreadCount = await Notification.countDocuments({
            isRead: false,
        });

        res.json({
            success: true,
            notifications,
            unreadCount,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch notifications",
        });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        await Notification.updateOne(
            { _id: id },
            { $set: { isRead: true } }
        );

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to mark notification as read",
        });
    }
};


