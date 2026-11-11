const otpTemplate = ({ name, otp }) => `
<html><body style="background:#f8fafc;font-family:sans-serif;padding:0;margin:0;">
<table width="100%"><tr><td align="center" style="padding:20px;">
<table width="450" style="border-radius:14px;background:#fff;">
<tr><td align="center" style="padding:40px;">
<h2 style="color:#0f172a;">Verification Code</h2>
<p style="color:#334155;font-size:16px;">Hello ${name},</p>
<p style="color:#334155;font-size:15px;">Use the OTP below to verify your account.</p>

<div style="border:2px dashed #cbd5e1;padding:20px;border-radius:10px;margin-top:20px;">
<p style="font-size:32px;font-weight:700;color:#0f172a;letter-spacing:6px;margin:0;">${otp}</p>
</div>

<p style="margin-top:20px;color:#64748b;font-size:14px;">
This code is valid for <strong>2 minutes</strong>.
</p>
</td></tr>

<tr><td align="center" style="padding:18px;background:#f8fafc;color:#94a3b8;font-size:12px;">
© ${new Date().getFullYear()} KIVO
</td></tr>
</table>
</td></tr></table>
</body></html>
`;

module.exports = otpTemplate;
