# 🎯 Razorpay Payment Integration - Setup Guide

Complete guide to set up Razorpay payment gateway for LumiSkill course purchases.

---

## 📋 Prerequisites

- Razorpay account (Sign up at https://razorpay.com/)
- Razorpay API Keys (Test & Live)
- Supabase database with `students` and `enrollments` tables

---

## 🔧 Step 1: Get Razorpay Credentials

1. **Sign up/Login** to Razorpay Dashboard
2. Go to **Settings → API Keys**
3. Generate/Copy your keys:
   - **Test Key ID**: `rzp_test_XXXXXXXXXXXXX`
   - **Test Key Secret**: `XXXXXXXXXXXXX`
   - **Live Key ID**: `rzp_live_XXXXXXXXXXXXX` (for production)
   - **Live Key Secret**: `XXXXXXXXXXXXX` (for production)

---

## 🔐 Step 2: Add Environment Variables

Add these to your `.env.local` file:

```env
# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE
```

**Important:**
- Use `rzp_test_` keys for testing
- Use `rzp_live_` keys for production
- Never commit `.env.local` to Git
- `NEXT_PUBLIC_` prefix makes the key available in browser (safe for Key ID only)

---

## 📦 Step 3: Install Dependencies

Already installed! ✅

```bash
npm install razorpay
```

---

## 🗂️ Step 4: Files Created

### **API Routes:**

1. **`/api/payment/create-order/route.js`**
   - Creates Razorpay order
   - Returns order ID and amount

2. **`/api/payment/verify/route.js`**
   - Verifies payment signature
   - Creates enrollment in database
   - Returns success/failure status

### **Pages:**

1. **`/checkout`** - Course selection & payment form
2. **`/payment/success`** - Payment success page
3. **`/payment/failure`** - Payment failure page

---

## 🎨 Step 5: How It Works

### **Payment Flow:**

```
1. User visits /checkout
   ↓
2. Selects course & fills details
   ↓
3. Clicks "Proceed to Payment"
   ↓
4. API creates Razorpay order
   ↓
5. Razorpay checkout modal opens
   ↓
6. User completes payment
   ↓
7. Payment verified via signature
   ↓
8. Enrollment created in database
   ↓
9. Redirect to success/failure page
```

---

## 🚀 Step 6: Testing

### **Test Cards (Razorpay Test Mode):**

**Success:**
- Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Failure:**
- Card: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date

### **Test UPI:**
- UPI ID: `success@razorpay`
- UPI ID: `failure@razorpay`

---

## 📝 Step 7: Usage

### **Link to Checkout:**

```jsx
// From any page
<Link href="/checkout?course=python-basics">
  Buy Python Course
</Link>

// Or programmatically
router.push('/checkout?course=web-development');
```

### **Available Courses:**

- `python-basics` - ₹15,000
- `web-development` - ₹18,000
- `ai-ml` - ₹20,000
- `game-development` - ₹17,000

---

## 🔒 Step 8: Security Features

✅ **Payment Signature Verification** - Prevents tampering
✅ **Server-side Validation** - All checks on backend
✅ **Secure Environment Variables** - Keys never exposed
✅ **HTTPS Required** - For production
✅ **Webhook Support** - Can be added for additional security

---

## 🌐 Step 9: Going Live

### **Before Production:**

1. **Get Live Keys** from Razorpay Dashboard
2. **Update `.env.local`** with live keys:
   ```env
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY
   RAZORPAY_KEY_SECRET=YOUR_LIVE_SECRET
   ```
3. **Complete KYC** on Razorpay
4. **Test thoroughly** with test keys first
5. **Enable Webhooks** (optional but recommended)

### **Webhook Setup (Optional):**

1. Go to Razorpay Dashboard → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/payment/webhook`
3. Select events: `payment.captured`, `payment.failed`
4. Save webhook secret in `.env.local`

---

## 📊 Step 10: Database Schema

Ensure your `enrollments` table has these columns:

```sql
- student_id (uuid, foreign key to students)
- course_slug (text)
- enrollment_date (timestamp)
- end_date (timestamp)
- status (text: 'active', 'completed', 'paused')
- payment_status (text: 'paid', 'pending', 'failed')
- payment_id (text, Razorpay payment ID)
- amount_paid (numeric)
```

---

## 🎯 Step 11: Customization

### **Change Course Prices:**

Edit `/checkout/page.js`:

```javascript
const courses = [
  {
    id: "python-basics",
    name: "Python Programming Basics",
    price: 15000, // Change price here
    // ...
  },
];
```

### **Change Course Duration:**

Edit `/api/payment/verify/route.js`:

```javascript
endDate.setMonth(endDate.getMonth() + 6); // Change duration
```

---

## 🐛 Troubleshooting

### **Payment not working?**

1. Check `.env.local` has correct keys
2. Restart dev server after adding env variables
3. Check browser console for errors
4. Verify Razorpay script loaded (check Network tab)

### **Enrollment not created?**

1. Check student exists in database with matching email
2. Check Supabase connection
3. Check API logs in terminal
4. Verify `enrollments` table structure

### **Signature verification failed?**

1. Ensure `RAZORPAY_KEY_SECRET` is correct
2. Check no extra spaces in `.env.local`
3. Verify payment response format

---

## 📞 Support

**Razorpay Support:**
- Dashboard: https://dashboard.razorpay.com/
- Docs: https://razorpay.com/docs/
- Support: support@razorpay.com

**LumiSkill Support:**
- Email: info@lumiskill.com
- Phone: +91-70212-17553

---

## ✅ Checklist

- [ ] Razorpay account created
- [ ] API keys obtained
- [ ] Keys added to `.env.local`
- [ ] Dev server restarted
- [ ] Test payment successful
- [ ] Enrollment created in database
- [ ] Success page displays correctly
- [ ] Failure page displays correctly
- [ ] Ready for production!

---

## 🎉 You're All Set!

Your Razorpay integration is complete! Students can now purchase courses directly from your website.

**Test URL:** http://localhost:3000/checkout

**Production URL:** https://yourdomain.com/checkout

---

*Last Updated: June 2, 2026*
