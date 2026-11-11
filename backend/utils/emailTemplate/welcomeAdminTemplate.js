const welcomeAdminTemplate = ({ name, tempPassword, email }) => {
    const dashboardLink = `${process.env.CLIENT_URL}/admin/dashboard`;

    return `
  
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to KIVO Admin</title>
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f8fafc;">
    <tr>
      <td align="center" style="padding:10px">

        <!-- Main Container -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:16px; box-shadow:0 4px 6px rgba(0,0,0,0.07); overflow:hidden;">

          <!-- Header with Brand -->
          <tr>
            <td align="center" style="padding:48px 40px 32px;">
              <div style="font-family:Arial,sans-serif;font-size:28px;font-weight:800;letter-spacing:-1px;color:#111827;">KIVO<span style="color:#C8F169;">.</span></div>
              <h1 style="margin:0; font-size:28px; font-weight:700; color:#0f172a; line-height:1.3;">
                Welcome to the Admin Team
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
                Your administrative account has been successfully created. You now have access to the KIVO admin dashboard with permissions based on your assigned role.
              </p>

              <!-- Credentials Section -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background-color:#f1f5f9; border-radius:12px; padding:28px;">
                    <p style="margin:0 0 16px; font-size:14px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:0.5px;">
                      Temporary Login Credentials
                    </p>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding-bottom:12px;">
                          <p style="margin:0; font-size:13px; color:#64748b;">Email Address</p>
                          <p style="margin:4px 0 0; font-size:15px; font-weight:600; color:#0f172a;">${email}</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p style="margin:0; font-size:13px; color:#64748b;">Temporary Password</p>
                          <div style="background-color:#ffffff; margin-top:8px; padding:16px; border-radius:8px; border:2px dashed #cbd5e1;">
                            <code style="font-size:18px; font-weight:700; color:#0f172a; letter-spacing:1.5px; font-family:'Courier New', monospace;">
                              ${tempPassword}
                            </code>
                          </div>
                        </td>
                      </tr>
                    </table>
                    <div style="margin-top:16px; padding:12px; background-color:#fef2f2; border-left:3px solid #dc2626; border-radius:6px;">
                      <p style="margin:0; font-size:13px; color:#991b1b; line-height:1.5;">
                        <strong>Security Notice:</strong> You must change this password upon first login.
                      </p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="padding:8px 0 32px;">
                    <a href="${dashboardLink}" 
                       style="display:inline-block; background-color:#2563eb; color:#ffffff; padding:16px 48px; font-size:16px; font-weight:600; text-decoration:none; border-radius:10px; box-shadow:0 4px 12px rgba(37,99,235,0.3);">
                      Access Admin Dashboard
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Support Info -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-top:1px solid #e2e8f0; padding-top:24px;">
                <tr>
                  <td>
                    <p style="margin:0 0 16px; font-size:15px; line-height:1.6; color:#334155;">
                      <strong>Need Assistance?</strong>
                    </p>
                    <p style="margin:0; font-size:14px; line-height:1.6; color:#64748b;">
                      If you encounter any issues accessing your account or have questions about your permissions, please contact our support team at the KIVO support team.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc; padding:20px 20px; border-top:1px solid #e2e8f0;">
              <p style="margin:0 0 12px; font-size:13px; color:#64748b; line-height:1.6;">
                This email was sent to you because an administrator created an account for you on the KIVO platform. If you did not expect this email, please contact us immediately.
              </p>
              <p style="margin:0; font-size:12px; color:#94a3b8;">
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

module.exports = welcomeAdminTemplate;