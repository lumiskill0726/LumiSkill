import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET(request) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('student_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const studentId = decoded.studentId;

    const supabase = supabaseAdmin();

    // Get student enrollments
    const { data: enrollments, error: enrollError } = await supabase
      .from('enrollments')
      .select('*')
      .eq('student_id', studentId)
      .order('enrollment_date', { ascending: false });

    if (enrollError) {
      console.error('Error fetching enrollments:', enrollError);
    }

    // Get active notices
    const { data: notices, error: noticeError } = await supabase
      .from('notices')
      .select('*')
      .eq('is_active', true)
      .or(`target_type.eq.all,target_student_ids.cs.{${studentId}}`)
      .order('created_at', { ascending: false })
      .limit(5);

    if (noticeError) {
      console.error('Error fetching notices:', noticeError);
    }

    // Get latest progress reports
    const { data: progressReports, error: progressError } = await supabase
      .from('progress_reports')
      .select('*')
      .eq('student_id', studentId)
      .order('report_date', { ascending: false })
      .limit(3);

    if (progressError) {
      console.error('Error fetching progress:', progressError);
    }

    // Get syllabus tracking for active enrollments
    let syllabusData = [];
    if (enrollments && enrollments.length > 0) {
      const activeEnrollment = enrollments.find(e => e.status === 'active');
      if (activeEnrollment) {
        const { data: syllabus, error: syllabusError } = await supabase
          .from('syllabus_tracking')
          .select('*')
          .eq('enrollment_id', activeEnrollment.id)
          .order('month_number', { ascending: true });

        if (!syllabusError) {
          syllabusData = syllabus || [];
        }
      }
    }

    // Calculate days left for active courses
    const enrollmentsWithDaysLeft = enrollments?.map(enrollment => {
      const endDate = new Date(enrollment.end_date);
      const today = new Date();
      const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
      const monthsLeft = Math.ceil(daysLeft / 30);

      return {
        ...enrollment,
        days_left: daysLeft > 0 ? daysLeft : 0,
        months_left: monthsLeft > 0 ? monthsLeft : 0,
        is_expired: daysLeft < 0
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        enrollments: enrollmentsWithDaysLeft || [],
        notices: notices || [],
        progressReports: progressReports || [],
        syllabus: syllabusData
      }
    });

  } catch (error) {
    console.error('Dashboard data error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
