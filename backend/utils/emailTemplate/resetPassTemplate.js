const resetPassTemplate = ({ name, resetLink }) => {

    return `
    <html lang="en">
        <head>
            <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Reset Your Password - KIVO</title>
                </head>
                <body style="margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f8fafc;">
                        <tr>
                            <td align="center" style="padding:10px 10px;">

                                <!-- Main Container -->
                                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:16px; box-shadow:0 4px 6px rgba(0,0,0,0.07); overflow:hidden;">

                                    <!-- Header with Brand -->
                                    <tr>
                                        <td align="center" style="padding:48px 40px 32px;">
                                            <div style="font-family:Arial,sans-serif;font-size:28px;font-weight:800;letter-spacing:-1px;color:#111827;">KIVO<span style="color:#C8F169;">.</span></div>
                                            <h1 style="margin:0; font-size:28px; font-weight:700; color:#0f172a; line-height:1.3;">
                                                Reset Your Password
                                            </h1>
                                        </td>
                                    </tr>

                                    <!-- Main Content -->
                                    <tr>
                                        <td style="padding:0 20px 40px;">

                                            <p style="margin:0 0 20px; font-size:16px; line-height:1.6; color:#334155;">
                                                Hello <strong>${name}</strong>,
                                            </p>

                                            <p style="margin:0 0 24px; font-size:16px; line-height:1.6; color:#334155;">
                                                We received a request to reset your password. Click the button below to create a new password for your KIVO account.
                                            </p>

                                            <!-- CTA Button -->
                                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:32px;">
                                                <tr>
                                                    <td align="center" style="padding:8px 0;">
                                                        <a href="${resetLink}"
                                                            style="display:inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color:#ffffff; padding:18px 48px; font-size:16px; font-weight:600; text-decoration:none; border-radius:10px; box-shadow:0 4px 12px rgba(37,99,235,0.3);">
                                                            Reset My Password
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>

                                            <!-- Alternative Link -->
                                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f1f5f9; border-radius:10px; padding:20px; margin-bottom:28px;">
                                                <tr>
                                                    <td>
                                                        <p style="margin:0 0 12px; font-size:14px; color:#475569;">
                                                            If the button above doesn't work, copy and paste this link into your browser:
                                                        </p>
                                                        <p style="margin:0; font-size:13px; color:#2563eb; word-break:break-all; font-family:'Courier New', monospace;">
                                                            ${resetLink}
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>

                                            <!-- Expiration Notice -->
                                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:28px;">
                                                <tr>
                                                    <td style="background-color:#fef3c7; padding:16px 20px; border-left:4px solid #f59e0b; border-radius:8px;">
                                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                            <tr>
                                                                <td width="30" valign="top">
                                                                    <div style="width:24px; height:24px; background-color:#f59e0b; border-radius:50%; text-align:center; line-height:24px;">
                                                                        <span style="color:#ffffff; font-size:14px; font-weight:700;">⏱</span>
                                                                    </div>
                                                                </td>
                                                                <td style="padding-left:12px;">
                                                                    <p style="margin:0; font-size:14px; color:#92400e; line-height:1.5;">
                                                                        <strong>Time Sensitive:</strong> This password reset link will expire in <strong>15 minutes</strong>. Please use it promptly.
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>

                                            <!-- Security Info -->
                                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f1f5f9; border-radius:10px; padding:24px; margin-bottom:28px;">
                                                <tr>
                                                    <td>
                                                        <p style="margin:0 0 12px; font-size:15px; font-weight:600; color:#0f172a;">
                                                            Security Tips
                                                        </p>
                                                        <ul style="margin:0; padding-left:20px; font-size:14px; color:#475569; line-height:1.7;">
                                                            <li style="margin-bottom:8px;">Choose a strong password with at least 8 characters</li>
                                                            <li style="margin-bottom:8px;">Use a mix of uppercase, lowercase, numbers, and symbols</li>
                                                            <li style="margin-bottom:8px;">Never share your password with anyone</li>
                                                            <li>Avoid using the same password across multiple sites</li>
                                                        </ul>
                                                    </td>
                                                </tr>
                                            </table>

                                            <!-- Didn't Request -->
                                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:2px solid #fee2e2; background-color:#fef2f2; border-radius:8px; padding:20px;">
                                                <tr>
                                                    <td>
                                                        <p style="margin:0 0 10px; font-size:15px; font-weight:600; color:#991b1b;">
                                                            Didn't request a password reset?
                                                        </p>
                                                        <p style="margin:0; font-size:14px; color:#7f1d1d; line-height:1.6;">
                                                            If you did not request this password reset, please ignore this email. Your password will remain unchanged. If you're concerned about your account security, please contact us immediately.
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>

                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color:#f8fafc; padding:20px 20px; border-top:1px solid #e2e8f0;">
                                            <p style="margin:0 0 12px; font-size:13px; color:#64748b; line-height:1.6; text-align:center;">
                                                This is an automated security message from KIVO. Please do not reply to this email.
                                            </p>
                                            <p style="margin:0; font-size:12px; color:#94a3b8; text-align:center;">
                                                © ${new Date().getFullYear()} KIVO. All rights reserved.
                                            </p>
                                        </td>
                                    </tr>

                                </table>

                            </td>
                        </tr>
                    </table>
                </body>
            </html>

            `;
};

            module.exports = resetPassTemplate;