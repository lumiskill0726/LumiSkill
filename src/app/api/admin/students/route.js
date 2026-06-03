import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// GET - Fetch all students with filters
export async function GET(request) {
  try {
    // Verify admin authentication
    const cookieStore = await cookies();
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
    const statusFilter = searchParams.get('status') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = supabaseAdmin();

    // Build query
    let query = supabase
      .from('students')
      .select(`
        *,
        enrollments (
          id,
          course_name,
          course_slug,
          course_level,
          status,
          amount_paid,
          payment_status,
          enrollment_date,
          start_date,
          end_date
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: students, error, count } = await query;

    if (error) {
      console.error('Error fetching students:', error);
      return NextResponse.json(
        { error: 'Failed to fetch students' },
        { status: 500 }
      );
    }

    // Filter by course if specified
    let filteredStudents = students;
    if (courseFilter) {
      filteredStudents = students.filter(student => 
        student.enrollments?.some(e => e.course_slug === courseFilter)
      );
    }

    // Filter by enrollment status if specified
    if (statusFilter) {
      filteredStudents = filteredStudents.filter(student =>
        student.enrollments?.some(e => e.status === statusFilter)
      );
    }

    return NextResponse.json({
      success: true,
      students: filteredStudents,
      total: count,
      limit,
      offset
    });

  } catch (error) {
    console.error('Error in students API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new student (for manual enrollment)
export async function POST(request) {
  try {
    // Verify admin authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      email,
      name,
      phone,
      parent_name,
      parent_email,
      student_class,
      password
    } = body;

    // Validation
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Email, name, and password are required' },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    // Hash password
    const bcrypt = require('bcrypt');
    const password_hash = await bcrypt.hash(password, 10);

    // Create student
    const { data: student, error } = await supabase
      .from('students')
      .insert({
        email: email.toLowerCase(),
        password_hash,
        name,
        phone,
        parent_name,
        parent_email,
        student_class,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating student:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create student' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Student created successfully',
      student: {
        id: student.id,
        email: student.email,
        name: student.name
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
