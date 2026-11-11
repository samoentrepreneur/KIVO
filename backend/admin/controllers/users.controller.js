const User = require("../../models/user");

exports.fetchUserLists = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;      // page number
        const limit = parseInt(req.query.limit) || 20;   // items per page
        const search = req.query.search || "";

        const skip = (page - 1) * limit;

        // Search filter
        const query = search
            ? {
                $or: [
                    { fullName: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                    { phone: { $regex: search, $options: "i" } },
                ],
            }
            : {};

        const [users, total] = await Promise.all([
            User.find(query)
                .select("-password -__v")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            User.countDocuments(query),
        ]);

        res.status(200).json({
            success: true,
            users,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasMore: skip + users.length < total,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

    
