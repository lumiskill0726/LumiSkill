# Email Setup Guide - Resend

This guide will help you set up email functionality for LumiSkill using Resend.

## 📧 What Was Implemented

After successful payment, the system now:
- ✅ Creates a student account automatically
- ✅ Generates secure login credentials
- ✅ Sends a welcome email to parents with:
  - Payment confirmation & invoice
  - Student login credentials (email + password)
  - Course details
  - Next steps
  - Support information

---

## 🚀 Setup Steps

### 1. Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### 2. Add Your Domain

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter: `lumiskill.com`
4. Follow the DNS verification steps:
   - Add the provided DNS records to your Cloudflare DNS
   - Wait for verification (usually takes a few minutes)

### 3. Get API Key

1. In Resend dashboard, go to **API Keys**
2. Click **Create API Key**
3. Name it: `LumiSkill Production`
4. Copy the API key (starts with `re_`)

### 4. Add API Key to Environment

Add this line to your `.env.local` file:

```env
RESEND_API_KEY=re_your_api_key_here
```

Replace `re_your_api_key_here` with your actual API key from step 3.

### 5. Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 🧪 Testing

### Test the Email Flow:

1. Go to: `http://localhost:3000/enroll/java-basics`
2. Fill in the enrollment form
3. Use Razorpay test credentials:
   - Card: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date
4. Complete payment
5. Check the parent's email inbox for the welcome email

---

## 📧 Email Template Features

The welcome email includes:

### Header
- 🎉 Welcome message with LumiSkill branding
- Purple gradient design matching your website

### Payment Confirmation
- ✅ Payment ID
- ✅ Amount paid
- ✅ Enrollment date
- ✅ Course name

### Login Credentials
- 🔐 Student email
- 🔐 Auto-generated secure password
- ⚠️ Security reminder

### Next Steps
- ✓ Login to dashboard
- ✓ Team will contact within 24 hours
- ✓ Join Discord community
- ✓ Start learning immediately

### Support Information
- 📧 Email: info@lumiskill.com
- 📱 WhatsApp link
- 🌐 Website links

---

## 🔒 Security Features

- ✅ Passwords are 12 characters long
- ✅ Include uppercase, lowercase, numbers, and symbols
- ✅ Passwords are hashed with bcrypt before storing
- ✅ Plain password only sent once via email
- ✅ Parents advised to change password after first login

---

## 📝 Important Notes

### Sending Email Address
- Emails are sent from: `LumiSkill <info@lumiskill.com>`
- Make sure `info@lumiskill.com` is verified in Resend
- Your Cloudflare email routing will forward replies to `lumiskill0726@gmail.com`

### Free Tier Limits
- Resend free tier: **3,000 emails/month**
- More than enough for starting out
- Upgrade if you need more

### Email Deliverability
- Make sure your domain is verified in Resend
- Add SPF, DKIM records as instructed by Resend
- This ensures emails don't go to spam

---

## 🐛 Troubleshooting

### Email Not Sending?

1. **Check API Key**
   ```bash
   # Make sure RESEND_API_KEY is in .env.local
   # Restart server after adding it
   ```

2. **Check Domain Verification**
   - Go to Resend dashboard
   - Verify domain status is "Verified"

3. **Check Server Logs**
   - Look for email errors in terminal
   - Check: `Error sending email:` messages

4. **Check Spam Folder**
   - First emails might go to spam
   - Mark as "Not Spam" to train filters

### Student Not Created?

- Check Supabase logs
- Verify `students` table structure
- Check for duplicate email errors

---

## 📊 Monitoring

### Check Email Status:
1. Go to Resend dashboard
2. Click **Logs**
3. See all sent emails and their status
4. Check delivery, opens, clicks

---

## 🎨 Customization

### Want to customize the email template?

Edit: `src/lib/email.js`

You can change:
- Email subject
- Header text
- Colors and styling
- Support information
- Footer links

---

## ✅ Checklist

Before going live, make sure:

- [ ] Resend account created
- [ ] Domain `lumiskill.com` added and verified
- [ ] API key generated and added to `.env.local`
- [ ] Server restarted
- [ ] Test payment completed successfully
- [ ] Welcome email received
- [ ] Login credentials work
- [ ] Email not in spam folder

---

## 🚀 You're All Set!

Once setup is complete, every successful payment will automatically:
1. Create student account
2. Generate secure credentials
3. Send welcome email with all details
4. Parents can login immediately

**Need help?** Check the Resend documentation or contact support.
