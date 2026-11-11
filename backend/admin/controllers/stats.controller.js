const Stats = require("../models/stats.model");
const Order = require("../../models/order");
const User = require("../../models/user");


const safeNumber = (val) => Number(val) || 0;

const formatCompact = (num) => {
    num = safeNumber(num);
    if (num >= 1e9) return (num / 1e9).toFixed(2).replace(/\.00$/, "") + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2).replace(/\.00$/, "") + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2).replace(/\.00$/, "") + "K";
    return num.toLocaleString();
};

const calcChange = (current, previous) => {
    current = safeNumber(current);
    previous = safeNumber(previous);
    if (!previous) return { percent: 0, trend: "up" };
    const percent = (((current - previous) / previous) * 100).toFixed(1);
    return { percent, trend: percent >= 0 ? "up" : "down" };
};


const getStatsDoc = async () => {
    let stats = await Stats.findOne();
    if (!stats) stats = await Stats.create({});
    return stats;
};


const getLiveStats = async () => {
    const totalUsers = await User.countDocuments();

    const completedOrders = await Order.countDocuments({
        orderStatus: "completed",
    });

    const revenueAgg = await Order.aggregate([
        { $match: { orderStatus: "completed" } },
        {
            $group: {
                _id: null,
                total: { $sum: "$totalAmount" },
            },
        },
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    const uniqueCustomers = await Order.distinct("userId", {
        orderStatus: "completed",
    });

    const conversionRate =
        totalUsers > 0
            ? ((uniqueCustomers.length / totalUsers) * 100).toFixed(2)
            : "0.00";

    return {
        totalUsers,
        totalOrders: completedOrders,
        totalRevenue,
        uniqueCustomers: uniqueCustomers.length,
        conversionRate,
    };
};


exports.getStatsFormatted = async (req, res) => {
    try {
        const stats = await getStatsDoc();
        const live = await getLiveStats();

        // Sync stats snapshot
        stats.totalUsers = live.totalUsers;
        stats.totalOrders = live.totalOrders;
        stats.totalRevenue = live.totalRevenue;
        stats.conversionRate = live.conversionRate;
        stats.uniqueCustomers = live.uniqueCustomers;

        await stats.save();

        const last = stats.lastMonthSnapshot || {};

        const formatted = [
            {
                label: "Total Users",
                value: formatCompact(stats.totalUsers),
                change: `${calcChange(stats.totalUsers, last.totalUsers).percent}% from last month`,
                trend: calcChange(stats.totalUsers, last.totalUsers).trend,
                color: "purple",
                icon: "users",
            },
            {
                label: "Total Revenue",
                value: `G-${formatCompact(stats.totalRevenue)}`,
                change: `${calcChange(stats.totalRevenue, last.totalRevenue).percent}% from last month`,
                trend: calcChange(stats.totalRevenue, last.totalRevenue).trend,
                color: "blue",
                icon: "dollar",
            },
            {
                label: "Completed Orders",
                value: formatCompact(stats.totalOrders),
                change: `${calcChange(stats.totalOrders, last.totalOrders).percent}% from last month`,
                trend: calcChange(stats.totalOrders, last.totalOrders).trend,
                color: "teal",
                icon: "shopping",
            },
            {
                label: "Conversion Rate",
                value: `${stats.conversionRate}%`,
                change: `${calcChange(stats.conversionRate, last.conversionRate).percent}% from last month`,
                trend: calcChange(stats.conversionRate, last.conversionRate).trend,
                color: "orange",
                icon: "trend",
            },
        ];

        res.json({ success: true, data: formatted });
    } catch (err) {
        console.error("Stats error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};


exports.onUserCreated = async () => {
    const stats = await getStatsDoc();
    const live = await getLiveStats();
    Object.assign(stats, live);
    await stats.save();
};

exports.onOrderCompleted = async () => {
    const stats = await getStatsDoc();
    const live = await getLiveStats();
    Object.assign(stats, live);
    await stats.save();
};

exports.onOrderCancelled = async () => {
    const stats = await getStatsDoc();
    const live = await getLiveStats();
    Object.assign(stats, live);
    await stats.save();
};
