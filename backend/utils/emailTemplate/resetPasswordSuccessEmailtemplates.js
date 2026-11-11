const passwordResetSuccessTemplate = ({ name }) => `
<html>
<body style="background:#f8fafc;font-family:sans-serif;padding:0;margin:0;">
<table width="100%">
<tr>
<td align="center" style="padding:20px;">

<table width="450" style="border-radius:14px;background:#fff;">
<tr>
<td align="center" style="padding:40px;">
<h2 style="color:black;margin:0 0 10px;">Password Reset Successful</h2>

<p style="color:#334155;font-size:16px;margin:0 0 18px;">
Hello ${name},
</p>

<p style="color:#334155;font-size:15px;line-height:1.6;margin:0 0 20px;">
Your password has been updated successfully.  
You can now log in using your new password.
</p>

<div style="background:#ecfdf5;border-left:4px solid #10b981;padding:12px 16px;border-radius:8px;margin-top:20px;">
<p style="margin:0;font-size:14px;color:#065f46;">
If this action was not performed by you, please contact support immediately at: the KIVO support team
</p>
 
         

</div>

</td>
</tr>

<tr>
<td align="center" style="padding:18px;background:#f8fafc;color:#94a3b8;font-size:12px;">
© ${new Date().getFullYear()} Easypay — Security Notification
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>
`;

module.exports = passwordResetSuccessTemplate;
