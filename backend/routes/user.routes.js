const express = require("express");
const router = express.Router();
const {register,verifyOtp,verifyLoginOtp,loginRequest,logout,getUserProfile, resendOtp,resetPassword, forgotPassword, validateResetToken, changePassword, editProfile, GetAdvertisement} = require("../controllers/user.auth.controller");
const verifyUser = require("../middlewares/user.middlerware");

// Protected – requires valid access token
router.get("/me", verifyUser, getUserProfile);

// AUTH FLOW
router.post("/register",register );
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

router.post("/login",loginRequest);
router.post("/verify-login-otp", verifyLoginOtp);
router.get("/validate-reset-token", validateResetToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/edit-profile", verifyUser, editProfile);
router.get("/advertisement", GetAdvertisement);

// Logout (protected)
router.post("/logout", verifyUser, logout);

module.exports = router;
