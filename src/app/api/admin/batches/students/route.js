import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// GET - Fetch students in a batch
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
    const batch_id = searchParams.get('batch_id');

    if (!batch_id) {
      return NextResponse.json(
        { error: 'batch_id is required' },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    // Fetch students in the batch
    const { data: batchStudents, error } = await supabase
      .from('batch_students')
      .select(`
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
      `)
      .eq('batch_id', batch_id);

    if (error) {
      console.error('Error fetching batch students:', error);
      return NextResponse.json(
        { error: 'Failed to fetch batch students' },
        { status: 500 }
      );
    }

    // Transform the data to flatten the students object
    const students = (batchStudents || []).map(bs => ({
      id: bs.students.id,
      name: bs.students.name,
      email: bs.students.email,
      phone: bs.students.phone,
      status: bs.status,
      joined_date: bs.joined_date
    }));

    return NextResponse.json({
      success: true,
      students
    });

  } catch (error) {
    console.error('Error in batch students API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Add student to batch
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
    const { batch_id, student_id, enrollment_id } = body;

    if (!batch_id || !student_id || !enrollment_id) {
      return NextResponse.json(
        { error: 'batch_id, student_id, and enrollment_id are required' },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    // Check if student is already in batch
    const { data: existing } = await supabase
      .from('batch_students')
      .select('id')
      .eq('batch_id', batch_id)
      .eq('student_id', student_id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Student is already in this batch' },
        { status: 400 }
      );
    }

    // Add student to batch
    const { data: batchStudent, error: insertError } = await supabase
      .from('batch_students')
      .insert({
        batch_id,
        student_id,
        enrollment_id,
        status: 'active'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error adding student to batch:', insertError);
      return NextResponse.json(
        { error: 'Failed to add student to batch' },
        { status: 500 }
      );
    }

    // Update batch student count
    const { error: updateError } = await supabase.rpc('increment_batch_students', {
      batch_id_param: batch_id
    });

    if (updateError) {
      // If RPC doesn't exist, update manually
      const { data: batch } = await supabase
        .from('batches')
        .select('current_students')
        .eq('id', batch_id)
        .single();

      if (batch) {
        await supabase
          .from('batches')
          .update({ current_students: (batch.current_students || 0) + 1 })
          .eq('id', batch_id);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Student added to batch successfully',
      batchStudent
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding student to batch:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Remove student from batch
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
    const batch_id = searchParams.get('batch_id');
    const student_id = searchParams.get('student_id');

    if (!batch_id || !student_id) {
      return NextResponse.json(
        { error: 'batch_id and student_id are required' },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    // Remove student from batch
    const { error: deleteError } = await supabase
      .from('batch_students')
      .delete()
      .eq('batch_id', batch_id)
      .eq('student_id', student_id);

    if (deleteError) {
      console.error('Error removing student from batch:', deleteError);
      return NextResponse.json(
        { error: 'Failed to remove student from batch' },
        { status: 500 }
      );
    }

    // Update batch student count
    const { data: batch } = await supabase
      .from('batches')
      .select('current_students')
      .eq('id', batch_id)
      .single();

    if (batch && batch.current_students > 0) {
      await supabase
        .from('batches')
        .update({ current_students: batch.current_students - 1 })
        .eq('id', batch_id);
    }

    return NextResponse.json({
      success: true,
      message: 'Student removed from batch successfully'
    });

  } catch (error) {
    console.error('Error removing student from batch:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
