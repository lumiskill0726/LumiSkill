import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const subscription = await request.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: 'Invalid subscription data' },
        { status: 400 }
      );
    }

    const { endpoint, keys } = subscription;
    const { p256dh, auth } = keys || {};

    if (!p256dh || !auth) {
      return NextResponse.json(
        { error: 'Missing subscription keys' },
        { status: 400 }
      );
    }

    // Get user agent
    const userAgent = request.headers.get('user-agent') || '';

    // Check if subscription already exists
    const { data: existing } = await supabase
      .from('push_subscriptions')
      .select('id')
      .eq('endpoint', endpoint)
      .single();

    if (existing) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Subscription already exists',
          alreadyExists: true
        },
        { status: 200 }
      );
    }

    // Insert new subscription
    const { data, error } = await supabase
      .from('push_subscriptions')
      .insert([
        {
          endpoint,
          p256dh,
          auth,
          user_agent: userAgent,
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save push subscription' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Push subscription saved successfully',
        data: data[0]
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in push-subscribe API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to unsubscribe
export async function DELETE(request) {
  try {
    const { endpoint } = await request.json();

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('endpoint', endpoint);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to delete push subscription' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Push subscription deleted successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting push subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
