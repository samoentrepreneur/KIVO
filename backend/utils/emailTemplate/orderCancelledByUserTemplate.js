const orderCancelledByUserTemplate = ({
    name,
    orderId,
    productName,
    quantity,
    price,
    total,
    paymentMethod,
    cancelReason,
    currency = "HTG"
}) => {
    return `
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Cancelled Successfully</title>
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">

<table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f8fafc;">
  <tr><td align="center" style="padding:10px;">

    <table width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:16px; box-shadow:0 4px 6px rgba(0,0,0,0.07); overflow:hidden;">

      <!-- Header -->
      <tr>
        <td align="center" style="padding:48px 40px 32px;">
          <div style="font-family:Arial,sans-serif;font-size:28px;font-weight:800;letter-spacing:-1px;color:#111827;">KIVO<span style="color:#C8F169;">.</span></div>
          <h1 style="margin:0; font-size:26px; font-weight:700; color:#166534;">
            Order Cancelled Successfully
          </h1>
        </td>
      </tr>

      <!-- Body -->
      <tr><td style="padding:0 22px 40px;">
        
        <p style="font-size:16px; color:#334155;">
          Hello <strong>${name}</strong>,
        </p>

        <p style="font-size:16px; color:#334155; line-height:1.6;">
          Your order has been <strong>successfully cancelled</strong> as requested.
          No further action is required from your side.
        </p>

        <!-- Order Box -->
        <table width="100%" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9; border-radius:12px; padding:24px; margin-top:20px;">
          <tr><td>

            <p style="margin-bottom:14px; font-size:14px; font-weight:600; text-transform:uppercase; color:#64748b;">
              Cancelled Order Details
            </p>

            <p style="font-size:15px; color:#0f172a;">
              <strong>Order ID:</strong> ${orderId}
            </p>

            <hr style="border:0; border-top:1px solid #cbd5e1; margin:16px 0;" />

            <p style="font-size:15px; margin:0 0 12px;">
              ${quantity} × ${productName}
              <span style="float:right; font-weight:600;">${currency} ${price}</span>
            </p>

            <hr style="border:0; border-top:1px solid #cbd5e1; margin:16px 0;" />

            <p style="font-size:16px; font-weight:700; margin:0;">
              Total: <span style="float:right;">${currency} ${total}</span>
            </p>

            <p style="margin-top:12px; font-size:14px; color:#64748b;">
              Payment Method: <strong>${paymentMethod}</strong>
            </p>

          </td></tr>
        </table>

        <!-- Confirmation Note -->
        <div style="background:#ecfdf5; border-left:4px solid #22c55e; border-radius:6px; padding:14px; margin-top:25px;">
          <p style="font-size:14px; color:#065f46; margin:0;">
            This cancellation was completed successfully by you.
            ${cancelReason ? `Reason: <strong>${cancelReason}</strong>.` : ``}
          </p>
        </div>

        <p style="margin-top:20px; font-size:14px; color:#64748b;">
          If you had already made a payment, any applicable refund will be processed
          according to our refund policy.
        </p>

        <p style="margin-top:10px; font-size:14px; color:#64748b;">
          Need help? Contact us at
          the KIVO support team.
        </p>

      </td></tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f8fafc; padding:20px; border-top:1px solid #e2e8f0;">
          <p style="margin:0 0 10px; font-size:13px; color:#64748b; text-align:center;">
            You can place a new order anytime from our website.
          </p>
          <p style="margin:0; font-size:12px; color:#94a3b8; text-align:center;">
            © ${new Date().getFullYear()} Easypay — All rights reserved.
          </p>
        </td>
      </tr>

    </table>

  </td></tr>
</table>

</body>
</html>
`;
};

module.exports = orderCancelledByUserTemplate;
