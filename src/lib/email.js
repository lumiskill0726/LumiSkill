import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail({
  parentEmail,
  studentName,
  parentName,
  studentEmail,
  studentPassword,
  courseName,
  paymentId,
  amount,
  enrollmentDate,
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'LumiSkill <info@lumiskill.com>',
      to: [parentEmail],
      subject: `Welcome to LumiSkill - ${courseName} Enrollment Confirmed! 🎉`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to LumiSkill</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #6C3EE8 0%, #5a2ec4 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🎉 Welcome to LumiSkill!</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Your coding journey starts now</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dear ${parentName},
              </p>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for enrolling <strong>${studentName}</strong> in <strong>${courseName}</strong>! We're excited to have them join our learning community.
              </p>

              <!-- Payment Confirmation -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <tr>
                  <td>
                    <h3 style="color: #6C3EE8; margin: 0 0 15px 0; font-size: 18px;">✅ Payment Confirmed</h3>
                    <table width="100%" cellpadding="5" cellspacing="0">
                      <tr>
                        <td style="color: #666; font-size: 14px;">Payment ID:</td>
                        <td style="color: #333; font-size: 14px; font-weight: bold; text-align: right;">${paymentId}</td>
                      </tr>
                      <tr>
                        <td style="color: #666; font-size: 14px;">Amount Paid:</td>
                        <td style="color: #333; font-size: 14px; font-weight: bold; text-align: right;">₹${(amount / 100).toLocaleString('en-IN')}</td>
                      </tr>
                      <tr>
                        <td style="color: #666; font-size: 14px;">Enrollment Date:</td>
                        <td style="color: #333; font-size: 14px; font-weight: bold; text-align: right;">${new Date(enrollmentDate).toLocaleDateString('en-IN')}</td>
                      </tr>
                      <tr>
                        <td style="color: #666; font-size: 14px;">Course:</td>
                        <td style="color: #333; font-size: 14px; font-weight: bold; text-align: right;">${courseName}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Login Credentials -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #6C3EE8 0%, #5a2ec4 100%); border-radius: 8px; padding: 20px; margin: 20px 0;">
                <tr>
                  <td>
                    <h3 style="color: #ffffff; margin: 0 0 15px 0; font-size: 18px;">🔐 Student Login Credentials</h3>
                    <table width="100%" cellpadding="8" cellspacing="0" style="background-color: rgba(255,255,255,0.1); border-radius: 6px;">
                      <tr>
                        <td style="color: rgba(255,255,255,0.9); font-size: 14px;">Email:</td>
                        <td style="color: #ffffff; font-size: 14px; font-weight: bold; text-align: right;">${studentEmail}</td>
                      </tr>
                      <tr>
                        <td style="color: rgba(255,255,255,0.9); font-size: 14px;">Password:</td>
                        <td style="color: #ffffff; font-size: 14px; font-weight: bold; text-align: right; font-family: monospace;">${studentPassword}</td>
                      </tr>
                    </table>
                    <p style="color: rgba(255,255,255,0.9); font-size: 13px; margin: 10px 0 0 0;">
                      ⚠️ Please keep these credentials safe and change the password after first login.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Next Steps -->
              <h3 style="color: #333; margin: 30px 0 15px 0; font-size: 18px;">📋 What's Next?</h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 10px 0;">
                    <span style="color: #6C3EE8; font-size: 20px; margin-right: 10px;">✓</span>
                    <span style="color: #333; font-size: 15px;">Login to the student dashboard using the credentials above</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;">
                    <span style="color: #6C3EE8; font-size: 20px; margin-right: 10px;">✓</span>
                    <span style="color: #333; font-size: 15px;">Our team will contact you within 24 hours with class schedule</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;">
                    <span style="color: #6C3EE8; font-size: 20px; margin-right: 10px;">✓</span>
                    <span style="color: #333; font-size: 15px;">Join our community Discord server for support</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;">
                    <span style="color: #6C3EE8; font-size: 20px; margin-right: 10px;">✓</span>
                    <span style="color: #333; font-size: 15px;">Start learning immediately with course materials</span>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://www.lumiskill.com/student/login" style="display: inline-block; background: linear-gradient(135deg, #6C3EE8 0%, #5a2ec4 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 16px; font-weight: bold;">
                      Login to Dashboard →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Support -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <tr>
                  <td>
                    <h3 style="color: #333; margin: 0 0 10px 0; font-size: 16px;">💬 Need Help?</h3>
                    <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0;">
                      Our support team is here to help!<br>
                      📧 Email: <a href="mailto:info@lumiskill.com" style="color: #6C3EE8; text-decoration: none;">info@lumiskill.com</a><br>
                      📱 WhatsApp: <a href="https://wa.me/919876543210" style="color: #6C3EE8; text-decoration: none;">+91 98765 43210</a>
                    </p>
                  </td>
                </tr>
              </table>

              <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
                We're thrilled to be part of ${studentName}'s coding journey!
              </p>

              <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 10px 0 0 0;">
                Best regards,<br>
                <strong>Team LumiSkill</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #999; font-size: 12px; margin: 0 0 10px 0;">
                © 2026 LumiSkill. All rights reserved.
              </p>
              <p style="color: #999; font-size: 12px; margin: 0;">
                <a href="https://www.lumiskill.com" style="color: #6C3EE8; text-decoration: none;">Website</a> | 
                <a href="https://www.lumiskill.com/about" style="color: #6C3EE8; text-decoration: none;">About Us</a> | 
                <a href="https://www.lumiskill.com/contact" style="color: #6C3EE8; text-decoration: none;">Contact</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in sendWelcomeEmail:', error);
    return { success: false, error };
  }
}
