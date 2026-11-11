const refundIssuedTemplate = ({
    name,
    orderId,
    productName,
    quantity,
    refundAmount,
    paymentMethod,
    currency = "HTG",
    refundReference, 
}) => {
    return `
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Refund Issued Successfully</title>
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">

<table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f8fafc;">
  <tr><td align="center" style="padding:10px;">

    <table width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:16px; box-shadow:0 4px 6px rgba(0,0,0,0.07); overflow:hidden;">

      <!-- Header -->
      <tr>
        <td align="center" style="padding:48px 40px 32px;">
          <div style="font-family:Arial,sans-serif;font-size:28px;font-weight:800;letter-spacing:-1px;color:#111827;">KIVO<span style="color:#C8F169;">.</span></div>
          <h1 style="margin:0; font-size:26px; font-weight:700; color:#065f46;">
            Refund Issued
          </h1>
        </td>
      </tr>

      <!-- Body -->
      <tr><td style="padding:0 22px 40px;">
        
        <p style="font-size:16px; color:#334155;">
          Hello <strong>${name}</strong>,
        </p>

        <p style="font-size:16px; color:#334155; line-height:1.6;">
          We've successfully processed your refund. The refunded amount will be credited
          back to your original payment method.
        </p>

        <!-- Refund Box -->
        <table width="100%" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9; border-radius:12px; padding:24px; margin-top:20px;">
          <tr><td>

            <p style="margin-bottom:14px; font-size:14px; font-weight:600; text-transform:uppercase; color:#64748b;">
              Refund Details
            </p>

            <p style="font-size:15px; color:#0f172a;">
              <strong>Order ID:</strong> ${orderId}
            </p>

            <p style="font-size:15px; margin:12px 0;">
              ${quantity} × ${productName}
            </p>

            <hr style="border:0; border-top:1px solid #cbd5e1; margin:16px 0;" />

            <p style="font-size:16px; font-weight:700; margin:0;">
              Refunded Amount:
              <span style="float:right;">${currency} ${refundAmount}</span>
            </p>

            <p style="margin-top:12px; font-size:14px; color:#64748b;">
              Refunded To: <strong>${paymentMethod}</strong>
            </p>

            ${refundReference
            ? `
            <p style="margin-top:8px; font-size:13px; color:#64748b;">
              Reference ID: <strong>${refundReference}</strong>
            </p>
            `
            : ""
        }

          </td></tr>
        </table>

        <!-- Info Note -->
        <div style="background:#ecfdf5; border-left:4px solid #22c55e; border-radius:6px; padding:14px; margin-top:25px;">
          <p style="font-size:14px; color:#065f46; margin:0;">
            Depending on your payment provider, the refund may take
            <strong>1–3 business days</strong> to reflect in your account.
          </p>
        </div>

        <p style="margin-top:20px; font-size:14px; color:#64748b;">
          If you have any questions or don't see the refund within the expected time,
          please contact us at
          the KIVO support team.
        </p>

      </td></tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f8fafc; padding:20px; border-top:1px solid #e2e8f0;">
          <p style="margin:0 0 10px; font-size:13px; color:#64748b; text-align:center;">
            We appreciate your patience and understanding.
          </p>
          <p style="margin:0; font-size:12px; color:#94a3b8; text-align:center;">
            © ${new Date().getFullYear()} KIVO — All rights reserved.
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

module.exports = refundIssuedTemplate;