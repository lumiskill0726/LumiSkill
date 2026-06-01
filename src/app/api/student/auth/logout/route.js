import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('student_token')?.value;

    if (token) {
      // Invalidate session in database
      const supabase = supabaseAdmin();
      await supabase
        .from('student_sessions')
        .update({ is_active: false })
        .eq('session_token', token);
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    // Clear cookie
    response.cookies.delete('student_token');

    return response;

  } catch (error) {
    console.error('Student logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
