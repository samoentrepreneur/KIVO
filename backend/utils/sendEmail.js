// utils/sendEmail.js
require("dotenv").config();
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Universal Email Sender (Uses Resend)
 * @param {Object} options
 */
const sendEmail = async ({ to, subject, html }) => {
    try {
        if (!to || !subject || !html) {
            throw new Error("Missing required fields: to, subject, html");
        }

        const res=await resend.emails.send({
            from: process.env.FROM_EMAIL, 
            to,
            subject,
            html,
        });
 
        // console.log("Email sent successfully",res);
        return { success: true, message: "Email sent successfully" };

    } catch (err) {
        console.error("Email Error:", err.message);
        return { success: false, message: "Email sending failed", error: err.message };
    }
};

module.exports = sendEmail;
