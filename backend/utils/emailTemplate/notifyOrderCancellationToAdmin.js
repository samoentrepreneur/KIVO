const adminOrderCancelledByUserTemplate = ({
    adminName = "Admin",
    userName,
    userEmail,
    orderId,
    productName,
    quantity,
    totalAmount,
    paymentMethod,
    cancelReason,
    currency = "HTG",
    cancelledAt = new Date(),
}) => {
    return `
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Cancelled by Customer</title>
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">

<table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f8fafc;">
  <tr>
    <td align="center" style="padding:10px;">

      <table width="600" cellspacing="0" cellpadding="0" border="0"
        style="max-width:600px; width:100%; background-color:#ffffff; border-radius:16px; box-shadow:0 4px 6px rgba(0,0,0,0.07); overflow:hidden;">

        <!-- Header -->
        <tr>
          <td align="center" style="padding:36px 40px 28px;">
            <div style="font-family:Arial,sans-serif;font-size:28px;font-weight:800;letter-spacing:-1px;color:#111827;">KIVO<span style="color:#C8F169;">.</span></div>
            <h1 style="margin:0; font-size:24px; font-weight:700; color:#991b1b;">
              Order Cancelled by Customer
            </h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:0 24px 36px;">

            <p style="font-size:15px; color:#334155;">
              Hello <strong>${adminName}</strong>,
            </p>

            <p style="font-size:15px; color:#334155; line-height:1.6;">
              A customer has cancelled an order. Please review the details below and
              take necessary action if required.
            </p>

            <!-- Order Details -->
            <table width="100%" cellspacing="0" cellpadding="0"
              style="background-color:#f1f5f9; border-radius:12px; padding:20px; margin-top:20px;">
              <tr>
                <td>

                  <p style="margin-bottom:12px; font-size:13px; font-weight:600; text-transform:uppercase; color:#64748b;">
                    Order Information
                  </p>

                  <p style="font-size:14px; color:#0f172a;">
                    <strong>Order ID:</strong> ${orderId}
                  </p>

                  <p style="font-size:14px; color:#0f172a;">
                    <strong>Customer:</strong> ${userName} (${userEmail})
                  </p>

                  <hr style="border:0; border-top:1px solid #cbd5e1; margin:14px 0;" />

                  <p style="font-size:14px; margin:0 0 10px;">
                    ${quantity} × ${productName}
                    <span style="float:right; font-weight:600;">
                      ${currency} ${totalAmount}
                    </span>
                  </p>

                  <p style="font-size:13px; color:#64748b; margin-top:10px;">
                    Payment Method: <strong>${paymentMethod}</strong>
                  </p>

                </td>
              </tr>
            </table>

            <!-- Cancellation Reason -->
            <div style="background:#fef2f2; border-left:4px solid #ef4444; border-radius:6px; padding:14px; margin-top:24px;">
              <p style="font-size:14px; color:#7f1d1d; margin:0;">
                <strong>Cancellation Reason:</strong>
                ${cancelReason || "Not provided by user"}
              </p>
            </div>

            <!-- Action Note -->
            <div style="background:#fff7ed; border-left:4px solid #f97316; border-radius:6px; padding:14px; margin-top:20px;">
              <p style="font-size:14px; color:#9a3412; margin:0;">
                Please verify payment status and initiate refund if applicable.
              </p>
            </div>

            <p style="margin-top:22px; font-size:13px; color:#64748b;">
              Cancelled on: ${new Date(cancelledAt).toLocaleString()}
            </p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc; padding:18px; border-top:1px solid #e2e8f0;">
            <p style="margin:0; font-size:12px; color:#94a3b8; text-align:center;">
              This is an automated admin notification.
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

module.exports = adminOrderCancelledByUserTemplate;
