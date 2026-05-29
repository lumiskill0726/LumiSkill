import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import webpush from 'web-push';

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  'mailto:admin@lumiskill.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export async function POST(request) {
  try {
    const { title, body, url, image } = await request.json();

    // Validation
    if (!title || !body) {
      return NextResponse.json(
        { error: 'Title and body are required' },
        { status: 400 }
      );
    }

    // Get all push subscriptions from database
    const { data: subscriptions, error: fetchError } = await supabase
      .from('push_subscriptions')
      .select('*');

    if (fetchError) {
      console.error('Error fetching subscriptions:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch subscriptions' },
        { status: 500 }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json(
        { message: 'No subscribers found. No notifications sent.' },
        { status: 200 }
      );
    }

    // Prepare notification payload with LumiSkill branding
    const payload = JSON.stringify({
      title: title,
      body: body,
      icon: '/logo-white.png', // LumiSkill logo as icon
      badge: '/logo-white.png', // LumiSkill logo as badge
      image: image || null, // Optional large image
      url: url || '/',
      data: {
        url: url || '/',
        timestamp: Date.now(),
      },
    });

    let successCount = 0;
    let failureCount = 0;

    // Send notification to all subscribers
    const promises = subscriptions.map(async (sub) => {
      try {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        await webpush.sendNotification(pushSubscription, payload);
        successCount++;
      } catch (error) {
        console.error('Error sending to:', sub.endpoint, error);
        failureCount++;

        // If subscription is invalid (410 Gone), delete it from database
        if (error.statusCode === 410) {
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('id', sub.id);
          console.log('Deleted invalid subscription:', sub.id);
        }
      }
    });

    await Promise.all(promises);

    return NextResponse.json({
      success: true,
      message: `Notification sent to ${successCount} subscriber(s). ${failureCount} failed.`,
      stats: {
        total: subscriptions.length,
        success: successCount,
        failed: failureCount,
      },
    });
  } catch (error) {
    console.error('Error sending notifications:', error);
    return NextResponse.json(
      { error: 'Failed to send notifications: ' + error.message },
      { status: 500 }
    );
  }
}
