# Push Notifications Setup Guide for LumiSkill

## 📱 How Push Notifications Work in This Project

### Overview
The push notification system allows you to send notifications to users who have subscribed, even when they're not actively on your website.

### Flow:
1. **User visits website** → Visitor modal appears
2. **User submits form** → Browser asks for notification permission
3. **User allows** → Subscription is saved to Supabase
4. **Admin sends notification** → All subscribed users receive it

---

## 🔑 How to Get VAPID Keys

VAPID (Voluntary Application Server Identification) keys are required for web push notifications.

### Method 1: Using web-push CLI (Recommended)

#### Step 1: Install web-push globally
```bash
npm install -g web-push
```

#### Step 2: Generate VAPID keys
```bash
web-push generate-vapid-keys
```

#### Step 3: Copy the output
You'll see something like:

```
=======================================

Public Key:
BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U

Private Key:
UUxI4O8-FYa_9qOUrq0gP_3bR7s3pSQPsXcXBWWnOvc

=======================================
```

#### Step 4: Add to .env.local
```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U
VAPID_PRIVATE_KEY=UUxI4O8-FYa_9qOUrq0gP_3bR7s3pSQPsXcXBWWnOvc
```

---

### Method 2: Using Node.js Script

Create a file `scripts/generate-vapid-keys.js`:

```javascript
const webpush = require('web-push');

const vapidKeys = webpush.generateVAPIDKeys();

console.log('\n=======================================');
console.log('VAPID Keys Generated!');
console.log('=======================================\n');
console.log('Public Key:');
console.log(vapidKeys.publicKey);
console.log('\nPrivate Key:');
console.log(vapidKeys.privateKey);
console.log('\n=======================================');
console.log('Add these to your .env.local file:');
console.log('=======================================\n');
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`);
console.log('\n=======================================\n');
```

Then run:
```bash
npm install web-push
node scripts/generate-vapid-keys.js
```

---

## 🔧 Current Implementation

### 1. Service Worker (`public/sw.js`)
- Handles incoming push notifications
- Shows notification to user
- Handles notification clicks

### 2. Visitor Modal (`src/components/VisitorModal/VisitorModal.js`)
- After form submission, requests notification permission
- Subscribes user to push notifications
- Sends subscription to `/api/push-subscribe`

### 3. API Endpoint (`src/app/api/push-subscribe/route.js`)
- Stores push subscriptions in Supabase
- Saves: endpoint, p256dh key, auth key

### 4. Database (`push_subscriptions` table)
- Stores all active subscriptions
- Used to send notifications to users

---

## 📤 How to Send Push Notifications

### Option 1: Using web-push CLI

```bash
web-push send-notification \
  --endpoint="https://fcm.googleapis.com/fcm/send/..." \
  --key="YOUR_P256DH_KEY" \
  --auth="YOUR_AUTH_KEY" \
  --vapid-subject="mailto:admin@lumiskill.com" \
  --vapid-pubkey="YOUR_PUBLIC_KEY" \
  --vapid-pvtkey="YOUR_PRIVATE_KEY" \
  --payload='{"title":"New Course!","body":"Check out our Python course"}'
```

### Option 2: Create Admin API Endpoint (Recommended)

Create `src/app/api/admin/send-notification/route.js`:

```javascript
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import webpush from 'web-push';

// Configure web-push
webpush.setVapidDetails(
  'mailto:admin@lumiskill.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export async function POST(request) {
  try {
    const { title, body, url } = await request.json();

    // Get all push subscriptions
    const { data: subscriptions } = await supabase
      .from('push_subscriptions')
      .select('*');

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json(
        { message: 'No subscribers found' },
        { status: 200 }
      );
    }

    const payload = JSON.stringify({
      title: title || 'LumiSkill',
      body: body || 'You have a new notification',
      url: url || '/',
    });

    // Send to all subscribers
    const promises = subscriptions.map((sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      return webpush.sendNotification(pushSubscription, payload)
        .catch((error) => {
          console.error('Error sending to:', sub.endpoint, error);
          // If subscription is invalid, delete it
          if (error.statusCode === 410) {
            supabase.from('push_subscriptions').delete().eq('id', sub.id);
          }
        });
    });

    await Promise.all(promises);

    return NextResponse.json({
      success: true,
      message: `Notification sent to ${subscriptions.length} subscribers`,
    });
  } catch (error) {
    console.error('Error sending notifications:', error);
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}
```

Then send notifications via:
```bash
curl -X POST http://localhost:3000/api/admin/send-notification \
  -H "Content-Type: application/json" \
  -d '{"title":"New Course!","body":"Python for beginners is now live!","url":"/courses"}'
```

---

## 🎯 Testing Push Notifications

### 1. Local Testing

1. Start your dev server: `npm run dev`
2. Visit `http://localhost:3000`
3. Fill the visitor modal form
4. Allow notification permission when prompted
5. Check Supabase `push_subscriptions` table - you should see your subscription
6. Send a test notification using the API endpoint above

### 2. Browser DevTools

- Open DevTools → Application → Service Workers
- Check if `sw.js` is registered
- Open DevTools → Application → Push Messaging
- See your subscription details

---

## 🚀 Production Deployment

### Important Notes:

1. **HTTPS Required**: Push notifications only work on HTTPS (or localhost)
2. **Service Worker**: Must be served from root (`/sw.js`)
3. **Environment Variables**: Add VAPID keys to your hosting platform (Netlify/Vercel)

### Netlify/Vercel Setup:

1. Go to Site Settings → Environment Variables
2. Add:
   ```
   NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key
   VAPID_PRIVATE_KEY=your_private_key
   ```
3. Redeploy your site

---

## 📊 Monitoring Subscriptions

Check active subscriptions in Supabase:

```sql
SELECT COUNT(*) as total_subscribers 
FROM push_subscriptions;

SELECT created_at, user_agent 
FROM push_subscriptions 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## 🔒 Security Best Practices

1. **Never expose VAPID_PRIVATE_KEY** in client-side code
2. **Only use NEXT_PUBLIC_VAPID_PUBLIC_KEY** in browser
3. **Validate subscriptions** before sending notifications
4. **Remove invalid subscriptions** (410 status code)
5. **Rate limit** notification sending

---

## 🐛 Troubleshooting

### Issue: "Notification permission denied"
**Solution**: User must manually allow notifications in browser settings

### Issue: "Service worker not registered"
**Solution**: Check if `public/sw.js` exists and is accessible at `/sw.js`

### Issue: "VAPID key invalid"
**Solution**: Regenerate VAPID keys and update `.env.local`

### Issue: "Notifications not received"
**Solution**: 
- Check browser console for errors
- Verify subscription exists in database
- Test with browser DevTools → Application → Push Messaging

---

## 📚 Additional Resources

- [Web Push Protocol](https://web.dev/push-notifications-overview/)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [web-push library](https://github.com/web-push-libs/web-push)

---

## ✅ Quick Start Checklist

- [ ] Install web-push: `npm install -g web-push`
- [ ] Generate VAPID keys: `web-push generate-vapid-keys`
- [ ] Add keys to `.env.local`
- [ ] Restart dev server
- [ ] Test visitor modal → allow notifications
- [ ] Check Supabase for subscription
- [ ] Send test notification
- [ ] Verify notification received

---

**Need Help?** Check the browser console for detailed error messages!
