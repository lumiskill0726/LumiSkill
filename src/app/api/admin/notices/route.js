import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// GET - Fetch all notices with filters
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
    const typeFilter = searchParams.get('type') || '';
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = supabaseAdmin();

    // Build query
    let query = supabase
      .from('notices')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,message.ilike.%${search}%`);
    }

    // Apply type filter
    if (typeFilter) {
      query = query.eq('notice_type', typeFilter);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: notices, error, count } = await query;

    if (error) {
      console.error('Error fetching notices:', error);
      return NextResponse.json(
        { error: 'Failed to fetch notices' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      notices: notices || [],
      total: count,
      limit,
      offset
    });

  } catch (error) {
    console.error('Error in notices API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new notice
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
      title,
      message,
      notice_type,
      target_audience,
      target_course,
      target_students,
      expiry_date
    } = body;

    // Validation
    if (!title || !message || !notice_type || !target_audience) {
      return NextResponse.json(
        { error: 'Title, message, notice type, and target audience are required' },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    // Create notice
    const { data: notice, error } = await supabase
      .from('notices')
      .insert({
        title,
        message,
        notice_type,
        target_audience,
        target_course: target_course || null,
        target_students: target_students || null,
        expiry_date: expiry_date || null,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating notice:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to create notice' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Notice created successfully',
      notice
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating notice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update notice
export async function PUT(request) {
  try {
    // Verify admin authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      title,
      message,
      notice_type,
      target_audience,
      target_course,
      target_students,
      expiry_date,
      is_active
    } = body;

    // Validation
    if (!id) {
      return NextResponse.json(
        { error: 'Notice ID is required' },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    // Update notice
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (message !== undefined) updateData.message = message;
    if (notice_type !== undefined) updateData.notice_type = notice_type;
    if (target_audience !== undefined) updateData.target_audience = target_audience;
    if (target_course !== undefined) updateData.target_course = target_course;
    if (target_students !== undefined) updateData.target_students = target_students;
    if (expiry_date !== undefined) updateData.expiry_date = expiry_date;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data: notice, error } = await supabase
      .from('notices')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating notice:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update notice' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Notice updated successfully',
      notice
    });

  } catch (error) {
    console.error('Error updating notice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete notice
export async function DELETE(request) {
  try {
    // Verify admin authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Notice ID is required' },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    const { error } = await supabase
      .from('notices')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting notice:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to delete notice' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Notice deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting notice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
