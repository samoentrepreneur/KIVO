const express = require("express");
const {
    createAdmin,
    loginAdmin,
    resendOtp,
    verifyOtp,
    getAdminProfile,
    logoutAdmin,
    forgotPassword,
    resetPassword,
    validateResetToken,
    refreshAccessToken,
    changePassword,
    editProfile,
    addAdmin,
    getAdminList,
    deleteAdmin,
    AddAdvertisement,
    DeleteAdvertisement
} = require("../controllers/admin.controller.js");
const { verifyAdmin } = require("../middlewares/auth.middleware.js");
const rateLimit = require("express-rate-limit");
const { GetAdvertisement } = require("../../controllers/user.auth.controller.js");

const router = express.Router();

// rate limit: forgot password
const resetLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 3,
    message: { message: "Too many reset attempts, try again later" },
    standardHeaders: true,
    legacyHeaders: false
});

// admin creation (optional seed)
router.post("/create", createAdmin);

// token refresh
router.get("/refresh-token", refreshAccessToken);

// authentication
router.post("/login", loginAdmin);
router.post("/resend-otp", resendOtp);
router.post("/verify-otp", verifyOtp);
router.delete("/remove/:id", verifyAdmin, deleteAdmin);
// profile
router.get("/me", verifyAdmin, getAdminProfile);
router.get("/advertisement", verifyAdmin, GetAdvertisement);
router.post("/advertisement", verifyAdmin, AddAdvertisement);
router.post("/delete-advertisement", verifyAdmin, DeleteAdvertisement);
router.get("/admin-list",verifyAdmin, getAdminList);

// logout
router.post("/logout",verifyAdmin, logoutAdmin);

// password reset workflow
router.post("/forgot-password", resetLimiter, forgotPassword);
router.get("/validate-reset-token", validateResetToken);
router.post("/reset-password", resetPassword);
router.post("/change-password",verifyAdmin, changePassword);
router.post("/edit-profile", verifyAdmin, editProfile);
router.post("/add-admin",verifyAdmin, addAdmin);

module.exports = router;
