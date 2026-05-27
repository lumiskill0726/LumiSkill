import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get total visitors count
    const { count: totalCount } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true });

    // Get recent visitors (last 5)
    const { data: recentVisitors } = await supabase
      .from('visitors')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    // Get push subscribers count
    const { count: pushCount } = await supabase
      .from('push_subscriptions')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      total: totalCount || 0,
      recent: recentVisitors || [],
      pushSubscribers: pushCount || 0,
    });
  } catch (error) {
    console.error('Error fetching visitor stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch visitor stats' },
      { status: 500 }
    );
  }
}
