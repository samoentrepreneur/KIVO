const adminOrderAssignedTemplate = ({
    orderId,
    customerName,
    customerEmail,
    productName,
    quantity,
    currency = "HTG",
    price,
    total,
    dashboardUrl
}) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>New Order Assigned</title>
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
<table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f8fafc;">
<tr><td align="center" style="padding:10px;">

<table width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:16px; box-shadow:0 4px 6px rgba(0,0,0,0.07); overflow:hidden;">

<!-- Header -->
<tr>
<td align="center" style="padding:48px 40px 32px;">
<div style="font-family:Arial,sans-serif;font-size:28px;font-weight:800;letter-spacing:-1px;color:#111827;">KIVO<span style="color:#C8F169;">.</span></div>
<h1 style="margin:0;font-size:26px;font-weight:700;color:#0f172a;">
New Order Assigned
</h1>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:0 28px 35px;">
<p style="font-size:16px;color:#334155;margin-bottom:18px;">
Hello,
</p>

<p style="font-size:16px;color:#334155;line-height:1.6;">
A new customer order has been assigned to you. Please review the details and process it as soon as possible.
</p>



<!-- Order Summary -->
<div style="background:#f1f5f9;border-radius:12px;padding:24px;margin-top:28px;">
<p style="margin:0 0 14px;font-size:14px;font-weight:600;color:#64748b;text-transform:uppercase;">
Order Summary
</p>

<p style="margin:0;font-size:15px;color:#0f172a;">
<strong>Order ID:</strong> ${orderId}
</p>

<hr style="border:0;border-top:1px solid #cbd5e1;margin:16px 0;" />

<p style="margin:0 0 12px;font-size:15px;color:#334155;">
${quantity} × ${productName}
<span style="float:right;font-weight:600;">${currency} ${price}</span>
</p>

<hr style="border:0;border-top:1px solid #cbd5e1;margin:16px 0;" />

<p style="margin:0;font-size:16px;font-weight:700;color:#0f172a;">
Total: <span style="float:right;">${currency} ${total}</span>
</p>
</div>

<!-- Customer Info -->
<div style="margin-top:20px;padding:20px;background:#fff7ed;border-left:4px solid #fb923c;border-radius:10px;">
<p style="margin:0;font-size:15px;color:#0f172a;">
<strong>Customer:</strong> ${customerName}
</p>
<p style="margin:8px 0 0;font-size:14px;color:#475569;">
${customerEmail}
</p>
</div>

<!-- CTA Button -->
<div style="text-align:center;margin:35px 0 10px;">
<a href="${dashboardUrl}" style="background:#2563eb;color:#ffffff;padding:16px 50px;text-decoration:none;font-weight:600;border-radius:10px;display:inline-block;box-shadow:0 4px 6px rgba(37,99,235,0.25);">
Open Order Details
</a>
</div>

<p style="margin-top:15px;font-size:14px;color:#64748b;">
Please update the status once reviewed.
</p>
</td>
</tr>

<!-- Footer -->
<tr>
<td style="background:#f8fafc;padding:18px;border-top:1px solid #e2e8f0;text-align:center;">
<p style="margin:0;font-size:12px;color:#94a3b8;">
© ${new Date().getFullYear()} KIVO — Admin Notification
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

module.exports = adminOrderAssignedTemplate;