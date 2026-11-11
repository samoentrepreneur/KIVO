const bcrypt = require("bcryptjs");
const { Admin } = require("./models/admin.model.js");

const seedDefaultAdmin = async () => {
    const existing = await Admin.findOne({});

    if (existing) {
        console.log("Admin already exists; skipping default admin seed.");
        return;
    }

    const name = process.env.DEFAULT_ADMIN_NAME?.trim();
    const email = process.env.DEFAULT_ADMIN_EMAIL?.trim();
    const password = process.env.DEFAULT_ADMIN_PASSWORD;
    const role = process.env.DEFAULT_ADMIN_ROLE || "superadmin";

    const missing = [];
    if (!name) missing.push("DEFAULT_ADMIN_NAME");
    if (!email) missing.push("DEFAULT_ADMIN_EMAIL");
    if (!password) missing.push("DEFAULT_ADMIN_PASSWORD");

    if (missing.length) {
        throw new Error(
            `Cannot create the initial admin. Missing environment variable(s): ${missing.join(", ")}. Add them to backend/.env.local.`
        );
    }

    if (!["admin", "superadmin", "developer"].includes(role)) {
        throw new Error("DEFAULT_ADMIN_ROLE must be admin, superadmin, or developer.");
    }

    const hashedPass = await bcrypt.hash(password, 12);

    await Admin.create({
        name,
        email,
        password: hashedPass,
        role,
    });

    console.log(`Default admin created: ${email} (${role}).`);
};

module.exports = { seedDefaultAdmin };
