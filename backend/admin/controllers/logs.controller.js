const mongoose = require("mongoose");
const AdminActivityLog = require("../models/AdminActivityLog");
const {Admin} = require("../models/admin.model");

const getActivityLogs = async (req, res) => {
    try {
        const { page = 1, limit = 10, adminId, search = "" } = req.query;

        const requestUser = await Admin.findById(adminId);

        if (!requestUser) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized request",
            });
        }

        const skip = (page - 1) * limit;
        const regex = new RegExp(search, "i");

        const pipeline = [
            {
                $lookup: {
                    from: "admins",
                    localField: "adminId",
                    foreignField: "_id",
                    as: "admin",
                },
            },
            { $unwind: { path: "$admin", preserveNullAndEmptyArrays: true } },
        ];

        if (requestUser.role !== "superadmin") {
            pipeline.push({
                $match: { adminId: new mongoose.Types.ObjectId(adminId) },
            });
        }

        if (search.trim()) {
            pipeline.push({
                $match: {
                    $or: [
                        { action: regex },
                        { ip: regex },
                        { userAgent: regex },
                        { "admin.name": regex },
                        { "admin.email": regex },
                        { "admin.role": regex },
                    ],
                },
            });
        }

        pipeline.push(
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: parseInt(limit) }
        );

        const logs = await AdminActivityLog.aggregate(pipeline);

        const totalLogsPipeline = [...pipeline];
        totalLogsPipeline.splice(-3); // remove sort, skip, limit

        const totalLogs = await AdminActivityLog.aggregate([
            ...totalLogsPipeline,
            { $count: "count" },
        ]);

        const total = totalLogs.length > 0 ? totalLogs[0].count : 0;

        res.status(200).json({
            success: true,
            page: Number(page),
            total,
            hasMore: total > page * limit,
            logs: logs.map((log) => ({
                id: log._id,
                adminId: log.admin?._id,
                admin: log.admin
                    ? {
                          name: log.admin.name,
                          email: log.admin.email,
                          role: log.admin.role,
                          createdAt: log.admin.createdAt,
                      }
                    : null,
                action: log.action,
                ip: log.ip,
                userAgent: log.userAgent,
                createdAt: log.createdAt,
            })),
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch logs",
            error: error.message,
        });
    }
};

module.exports = { getActivityLogs };
