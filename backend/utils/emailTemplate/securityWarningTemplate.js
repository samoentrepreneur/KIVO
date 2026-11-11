const securityWarningTemplate = ({ name }) => `
<html><body style="background:#f8fafc;font-family:sans-serif;padding:0;margin:0;">
<table width="100%">
<tr><td align="center" style="padding:20px;">
<table width="450" style="background:#fff;border-radius:14px;overflow:hidden;">

<tr><td align="center" style="padding:40px;">
<h2 style="color:#b91c1c;margin-bottom:12px;">⚠ Security Warning</h2>

<p style="color:#334155;font-size:16px;margin:0 0 18px;">
Hello ${name},
</p>

<p style="color:#334155;font-size:15px;line-height:1.6;margin:0 0 18px;">
We detected multiple password reset attempts on your account. If this action was not initiated by you, please review your account security.
</p>

<div style="background:#fef2f2;border-left:4px solid #dc2626;padding:14px;border-radius:8px;margin-top:10px;">
<p style="margin:0;font-size:14px;color:#991b1b;">
If this wasn't you, <strong>change your password immediately</strong> and contact support the KIVO support team
</p>
</div>

</td></tr>

<tr><td align="center" style="padding:18px;background:#f8fafc;color:#94a3b8;font-size:12px;">
© ${new Date().getFullYear()} Easypay — Security Notification
</td></tr>

</table>
</td></tr>
</table>
</body></html>
`;

module.exports = securityWarningTemplate;
