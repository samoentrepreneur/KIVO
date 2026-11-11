// Email delivery is optional at startup; authentication emails require a configured provider.
const { Resend } = require("resend");

const sendEmail = async ({ to, subject, html }) => {
    if (!to || !subject || !html) {
        throw new Error("Missing required email fields: to, subject, html");
    }

    if (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL) {
        throw new Error(
            "Email delivery is not configured. Set RESEND_API_KEY and FROM_EMAIL to enable OTP and password-reset emails."
        );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
        from: process.env.FROM_EMAIL,
        to,
        subject,
        html,
    });

    if (error) {
        throw new Error(error.message || "Email delivery failed");
    }

    return { success: true, message: "Email sent successfully", id: data?.id };
};

module.exports = sendEmail;
