import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// GET - Fetch all progress reports with filters
export async function GET(request) {
  try {
    // Verify admin authentication
    const cookieStore = cookies();
    const token = cookieStore.get('admin_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const courseFilter = searchParams.get('course') || '';
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = supabaseAdmin();

    // Build query to get progress reports with student info
    let query = supabase
      .from('progress_reports')
      .select(`
        *,
        students (
          id,
          name,
          email,
          student_class
        )
      `, { count: 'exact' })
      .order('report_date', { ascending: false });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: reports, error, count } = await query;

    if (error) {
      console.error('Error fetching progress reports:', error);
      return NextResponse.json(
        { error: 'Failed to fetch progress reports' },
        { status: 500 }
      );
    }

    // Filter by search if specified
    let filteredReports = reports;
    if (search) {
      filteredReports = reports.filter(report => 
        report.students?.name?.toLowerCase().includes(search.toLowerCase()) ||
        report.students?.email?.toLowerCase().includes(search.toLowerCase()) ||
        report.report_title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by course if specified
    if (courseFilter) {
      filteredReports = filteredReports.filter(report => 
        report.course_slug === courseFilter
      );
    }

    return NextResponse.json({
      success: true,
      reports: filteredReports,
      total: count,
      limit,
      offset
    });

  } catch (error) {
    console.error('Error in progress reports API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new progress report
export async function POST(request) {
  try {
    // Verify admin authentication
    const cookieStore = cookies();
    const token = cookieStore.get('admin_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      student_id,
      course_slug,
      report_title,
      report_date,
      progress_percentage,
      attendance_percentage,
      assignments_completed,
      total_assignments,
      projects_completed,
      mentor_feedback,
      strengths,
      areas_to_improve,
      next_steps
    } = body;

    // Validation
    if (!student_id || !course_slug || !report_title) {
      return NextResponse.json(
        { error: 'Student ID, course, and report title are required' },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    // Create progress report
    const { data: report, error } = await supabase
      .from('progress_reports')
      .insert({
        student_id,
        course_slug,
        report_title,
        report_date: report_date || new Date().toISOString(),
        progress_percentage: progress_percentage || 0,
        attendance_percentage: attendance_percentage || 0,
        assignments_completed: assignments_completed || 0,
        total_assignments: total_assignments || 0,
        projects_completed: projects_completed || 0,
        mentor_feedback,
        strengths,
        areas_to_improve,
        next_steps
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating progress report:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create progress report' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Progress report created successfully',
      report
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating progress report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
