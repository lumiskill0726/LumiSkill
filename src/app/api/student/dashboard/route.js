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

    // Get student enrollments with batch information
    const { data: enrollments, error: enrollError } = await supabase
      .from('enrollments')
      .select(`
        *,
        batch_students (
          batch_id,
          batches (
            id,
            batch_name,
            start_date,
            end_date,
            status
          )
        )
      `)
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

    // Calculate dates based on batch start date and course duration
    const enrollmentsWithDaysLeft = enrollments?.map(enrollment => {
      // Get batch information
      const batch = enrollment.batch_students?.[0]?.batches;
      
      // Extract course duration (e.g., "4 Months" -> 4)
      const durationMatch = enrollment.course_duration?.match(/(\d+)\s*Month/i);
      const courseDurationMonths = durationMatch ? parseInt(durationMatch[1]) : 6;
      
      // Use batch start date if available, otherwise use enrollment date
      const startDate = batch?.start_date ? new Date(batch.start_date) : new Date(enrollment.enrollment_date);
      
      // Calculate end date based on batch start + course duration
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + courseDurationMonths);
      
      const today = new Date();
      const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
      const monthsLeft = Math.ceil(daysLeft / 30);

      return {
        ...enrollment,
        batch_info: batch || null,
        batch_start_date: batch?.start_date || enrollment.enrollment_date,
        calculated_end_date: endDate.toISOString(),
        course_duration_months: courseDurationMonths,
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
