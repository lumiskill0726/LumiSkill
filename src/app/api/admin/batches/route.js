import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// GET - Fetch all batches or specific batch
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
    const batchId = searchParams.get('id');
    const courseSlug = searchParams.get('course_slug');

    const supabase = supabaseAdmin();

    if (batchId) {
      // Fetch specific batch with students and syllabus
      const { data: batch, error } = await supabase
        .from('batches')
        .select(`
          *,
          batch_students (
            id,
            student_id,
            enrollment_id,
            status,
            joined_date,
            students (
              id,
              name,
              email,
              phone
            )
          ),
          batch_syllabus_progress (
            *
          )
        `)
        .eq('id', batchId)
        .single();

      if (error) {
        console.error('Error fetching batch:', error);
        return NextResponse.json({ error: 'Failed to fetch batch' }, { status: 500 });
      }

      return NextResponse.json({ success: true, batch });
    }

    // Fetch all batches
    let query = supabase
      .from('batches')
      .select(`
        *,
        batch_students (
          id
        )
      `)
      .order('created_at', { ascending: false });

    if (courseSlug) {
      query = query.eq('course_slug', courseSlug);
    }

    const { data: batches, error } = await query;

    if (error) {
      console.error('Error fetching batches:', error);
      return NextResponse.json({ error: 'Failed to fetch batches' }, { status: 500 });
    }

    // Add student_count to each batch
    const batchesWithCount = (batches || []).map(batch => ({
      ...batch,
      student_count: batch.batch_students?.length || 0
    }));

    return NextResponse.json({ success: true, batches: batchesWithCount });

  } catch (error) {
    console.error('Error in batches API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new batch
export async function POST(request) {
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

    const body = await request.json();
    const {
      course_id,
      course_slug,
      batch_name,
      batch_code,
      start_date,
      end_date,
      max_students,
      status
    } = body;

    // Validation
    if (!course_id || !course_slug || !batch_name || !batch_code || !start_date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    // Create batch
    const { data: batch, error: batchError } = await supabase
      .from('batches')
      .insert({
        course_id,
        course_slug,
        batch_name,
        batch_code,
        start_date,
        end_date,
        max_students: max_students || 30,
        status: status || 'upcoming',
        current_students: 0
      })
      .select()
      .single();

    if (batchError) {
      console.error('Error creating batch:', batchError);
      return NextResponse.json(
        { error: batchError.message || 'Failed to create batch' },
        { status: 500 }
      );
    }

    // Get course syllabus and create batch syllabus progress
    const { data: courseSyllabus, error: syllabusError } = await supabase
      .from('course_syllabus')
      .select('*')
      .eq('course_id', course_id)
      .order('month_number', { ascending: true });

    if (!syllabusError && courseSyllabus && courseSyllabus.length > 0) {
      const batchSyllabusData = courseSyllabus.map((module) => ({
        batch_id: batch.id,
        month_number: module.month_number,
        month_title: module.title,
        topics: module.topics.map(topic => ({ 
          topic, 
          completed: false,
          completed_date: null
        })),
        total_topics: module.topics.length,
        completed_topics: 0,
        completion_percentage: 0,
        status: 'not_started'
      }));

      const { error: progressError } = await supabase
        .from('batch_syllabus_progress')
        .insert(batchSyllabusData);

      if (progressError) {
        console.error('Error creating batch syllabus:', progressError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Batch created successfully',
      batch
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating batch:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update batch
export async function PUT(request) {
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

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Batch ID is required' }, { status: 400 });
    }

    const supabase = supabaseAdmin();

    const { data: batch, error } = await supabase
      .from('batches')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating batch:', error);
      return NextResponse.json({ error: 'Failed to update batch' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Batch updated successfully',
      batch
    });

  } catch (error) {
    console.error('Error updating batch:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete batch
export async function DELETE(request) {
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Batch ID is required' }, { status: 400 });
    }

    const supabase = supabaseAdmin();

    const { error } = await supabase
      .from('batches')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting batch:', error);
      return NextResponse.json({ error: 'Failed to delete batch' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Batch deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting batch:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
