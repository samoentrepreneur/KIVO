// seedAdmin.js
const bcrypt = require("bcryptjs");
const { Admin } = require("./models/admin.model.js");

const seedDefaultAdmin = async () => {
    try {
        const existing = await Admin.findOne({});

        if (existing) {
            console.log("🟢 Admin already exists — skipping seed.");
            return;
        }

        const hashedPass = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, 10);

        await Admin.create({
            name: process.env.DEFAULT_ADMIN_NAME,
            email: process.env.DEFAULT_ADMIN_EMAIL,
            password: hashedPass,
            role: process.env.DEFAULT_ADMIN_ROLE || "superadmin",
        });
    } catch (error) {
        console.error("❌ Failed to seed default admin:", error);
    }
};

module.exports = { seedDefaultAdmin };
