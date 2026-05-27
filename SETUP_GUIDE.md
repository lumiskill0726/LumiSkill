# LumiSkill - Complete Setup Guide

This guide will help you set up the complete customer data management system with Supabase, admin panel, visitor tracking, and push notifications.

## 🎯 Features Implemented

✅ **Visitor Tracking Modal** - Captures visitor data (Name, Email, Phone) on first visit
✅ **Form Submissions** - Stores all contact form data in Supabase
✅ **Push Notifications** - Web push notifications with service worker
✅ **Admin Panel** - Secure login system with encrypted passwords
✅ **Admin Dashboard** - View analytics and leads (to be built)
✅ **Database Integration** - Supabase for all data storage

---

## 📋 Prerequisites

- Node.js 20+ installed
- A Supabase account (free tier works)
- Basic knowledge of Next.js

---

## 🚀 Step 1: Supabase Setup

### 1.1 Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click "New Project"
4. Fill in:
   - **Project Name**: LumiSkill
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your users
5. Wait for project to be created (~2 minutes)

### 1.2 Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the SQL from `SUPABASE_SCHEMA.md`
3. Click **Run** to execute all the SQL commands
4. Verify tables are created in **Table Editor**

### 1.3 Get API Keys

1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

---

## 🔐 Step 2: Environment Variables

### 2.1 Update `.env.local`

Open `.env.local` and fill in your actual values:

```env
# Razorpay Configuration (if you have it)
RAZORPAY_KEY_ID=your_actual_razorpay_key_id
RAZORPAY_KEY_SECRET=your_actual_razorpay_key_secret

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Admin Configuration
ADMIN_EMAIL=admin@lumiskill.com
ADMIN_PASSWORD_HASH=your_bcrypt_hashed_password
JWT_SECRET=your_random_jwt_secret_min_32_chars

# Push Notifications (Optional - see Step 4)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

### 2.2 Generate JWT Secret

Run this in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET`.

---

## 👤 Step 3: Create Admin User

### 3.1 Generate Password Hash

Create a file `scripts/hash-password.js`:

```javascript
const bcrypt = require('bcryptjs');

const password = 'YourSecurePassword123!'; // Change this
const hash = bcrypt.hashSync(password, 10);

console.log('Password Hash:');
console.log(hash);
```

Run it:

```bash
node scripts/hash-password.js
```

### 3.2 Insert Admin User

1. Go to Supabase **SQL Editor**
2. Run this SQL (replace the hash with your generated hash):

```sql
INSERT INTO admin_users (email, password_hash, name, role)
VALUES (
  'admin@lumiskill.com',
  '$2a$10$YOUR_GENERATED_HASH_HERE',
  'Admin User',
  'admin'
);
```

3. Update `.env.local` with the same hash:

```env
ADMIN_PASSWORD_HASH=$2a$10$YOUR_GENERATED_HASH_HERE
```

---

## 🔔 Step 4: Push Notifications Setup (Optional)

### 4.1 Generate VAPID Keys

Install web-push globally:

```bash
npm install -g web-push
```

Generate keys:

```bash
web-push generate-vapid-keys
```

### 4.2 Add Keys to `.env.local`

Copy the output and add to `.env.local`:

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
```

---

## 🏃 Step 5: Run the Application

### 5.1 Install Dependencies

```bash
npm install
```

### 5.2 Start Development Server

```bash
npm run dev
```

### 5.3 Test the Features

1. **Visit Homepage**: `http://localhost:3000`
   - After 2 seconds, visitor modal should appear
   - Fill in Name, Email, Phone and submit
   - Check Supabase `visitors` table

2. **Test Push Notifications**:
   - After submitting visitor form, browser will ask for notification permission
   - Allow it
   - Check Supabase `push_subscriptions` table

3. **Test Admin Login**: `http://localhost:3000/admin/login` (you'll need to create this page)
   - Use email: `admin@lumiskill.com`
   - Use password: (the one you used to generate hash)

---

## 📊 Step 6: Admin Dashboard (To Be Built)

The admin dashboard pages need to be created. Here's the structure:

### Pages to Create:

1. **`/admin/login`** - Admin login page
2. **`/admin/dashboard`** - Main dashboard with analytics
3. **`/admin/visitors`** - View all visitor data
4. **`/admin/leads`** - View all form submissions
5. **`/admin/notifications`** - Send push notifications

### API Routes Already Created:

- ✅ `/api/admin/login` - Admin authentication
- ✅ `/api/admin/logout` - Logout
- ✅ `/api/admin/verify` - Verify JWT token
- ✅ `/api/visitors` - Store visitor data
- ✅ `/api/form-submissions` - Store & fetch form data
- ✅ `/api/push-subscribe` - Store push subscriptions

---

## 🔍 Step 7: Verify Everything Works

### 7.1 Check Supabase Tables

Go to Supabase **Table Editor** and verify:

- ✅ `visitors` table has data
- ✅ `form_submissions` table exists
- ✅ `push_subscriptions` table has subscriptions
- ✅ `admin_users` table has your admin user

### 7.2 Test API Endpoints

Use Postman or curl to test:

```bash
# Test visitor submission
curl -X POST http://localhost:3000/api/visitors \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"1234567890"}'

# Test admin login
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lumiskill.com","password":"YourPassword123!"}'
```

---

## 🎨 Step 8: Customize

### 8.1 Visitor Modal

Edit `src/components/VisitorModal/VisitorModal.js`:
- Change title/subtitle
- Modify form fields
- Adjust timing (currently 2 seconds)

### 8.2 Disable Visitor Modal

If you want to temporarily disable it, comment out in `src/app/layout.js`:

```javascript
// <VisitorModal />
```

---

## 🐛 Troubleshooting

### Issue: Visitor Modal Not Showing

**Solution**: Check browser console for errors. Clear localStorage:

```javascript
localStorage.removeItem('visitor_form_filled')
```

### Issue: Supabase Connection Error

**Solution**: 
1. Verify `.env.local` has correct Supabase URL and keys
2. Restart dev server after changing `.env.local`
3. Check Supabase project is not paused

### Issue: Admin Login Fails

**Solution**:
1. Verify password hash in database matches `.env.local`
2. Check JWT_SECRET is set
3. Verify admin user exists in `admin_users` table

### Issue: Push Notifications Not Working

**Solution**:
1. HTTPS is required (or localhost)
2. Check VAPID keys are set correctly
3. Verify service worker is registered (check browser DevTools → Application → Service Workers)

---

## 📱 Step 9: Production Deployment

### 9.1 Netlify/Vercel Setup

1. Add all environment variables in your hosting platform
2. Make sure to add:
   - All Supabase keys
   - JWT_SECRET
   - VAPID keys (if using push notifications)
   - Razorpay keys (if using payments)

### 9.2 Update Supabase RLS Policies

For production, review and tighten Row Level Security policies in Supabase.

### 9.3 Service Worker

The service worker (`public/sw.js`) will automatically work in production.

---

## 📚 Next Steps

1. **Build Admin Dashboard Pages**:
   - Create login page UI
   - Build dashboard with charts
   - Add data tables for visitors/leads

2. **Add Analytics**:
   - Visitor count by date
   - Form submission rates
   - Conversion tracking

3. **Send Push Notifications**:
   - Create admin interface to send notifications
   - Use `web-push` library to send notifications to all subscribed users

4. **Export Data**:
   - Add CSV export functionality
   - Email reports

---

## 🆘 Need Help?

- Check Supabase docs: https://supabase.com/docs
- Next.js docs: https://nextjs.org/docs
- Web Push docs: https://web.dev/push-notifications-overview/

---

## 📝 Summary

You now have:
- ✅ Visitor tracking with overlay form
- ✅ Form submission storage
- ✅ Push notification infrastructure
- ✅ Admin authentication system
- ✅ Supabase database integration
- ✅ Service worker for offline support

**What's left to build:**
- Admin dashboard UI pages
- Analytics visualization
- Push notification sender interface
- Data export features

Good luck! 🚀
