const AdminNotification = require("../admin/models/notification.model");

const pushAdminNotification = async ({
    type,
    title,
    message,
    userId,
    data = {},
}) => {
    try {
        await AdminNotification.create({
            type,
            title,
            message,
            userId,
            data,
        });
    } catch (error) {
        console.error("Admin notification error:", error);
    }
};

module.exports = pushAdminNotification;
