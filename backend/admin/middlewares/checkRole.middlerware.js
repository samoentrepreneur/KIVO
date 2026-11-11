const { Admin } = require("../models/admin.model");
exports.checkRole = async(req, res, next) => {
    if (!req.admin) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const admin = await Admin.findById(req.admin.id).select("-password");
    const allowedRoles = ["admin", "superadmin", "developer"];
    // console.log(admin)

    if (!allowedRoles.includes(admin.role)) {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next();
};
