import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      formType, 
      name, 
      email, 
      phone, 
      message, 
      courseName, 
      studentClass, 
      parentName,
      additionalData 
    } = body;

    // Validation
    if (!formType || !name || !email) {
      return NextResponse.json(
        { error: 'Form type, name, and email are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('form_submissions')
      .insert([
        {
          form_type: formType,
          name,
          email,
          phone: phone || null,
          message: message || null,
          course_name: courseName || null,
          student_class: studentClass || null,
          parent_name: parentName || null,
          additional_data: additionalData || null,
          status: 'new',
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save form submission' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Form submitted successfully!',
        data: data[0]
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in form-submissions API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for admin to fetch submissions
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const formType = searchParams.get('formType');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('form_submissions')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    if (formType) {
      query = query.eq('form_type', formType);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch form submissions' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data,
        total: count,
        limit,
        offset
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching form submissions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
