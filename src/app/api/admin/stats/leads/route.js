import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get total leads count
    const { count: totalCount } = await supabase
      .from('form_submissions')
      .select('*', { count: 'exact', head: true });

    // Get new leads count (status = 'new')
    const { count: newCount } = await supabase
      .from('form_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new');

    // Get recent leads (last 5)
    const { data: recentLeads } = await supabase
      .from('form_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    return NextResponse.json({
      total: totalCount || 0,
      new: newCount || 0,
      recent: recentLeads || [],
    });
  } catch (error) {
    console.error('Error fetching lead stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead stats' },
      { status: 500 }
    );
  }
}
