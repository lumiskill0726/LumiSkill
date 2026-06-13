import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// GET - Fetch batch syllabus progress
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

    const { data: syllabus, error } = await supabase
      .from('batch_syllabus_progress')
      .select('*')
      .eq('batch_id', batch_id)
      .order('month_number', { ascending: true });

    if (error) {
      console.error('Error fetching batch syllabus:', error);
      return NextResponse.json(
        { error: 'Failed to fetch batch syllabus' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      syllabus: syllabus || []
    });

  } catch (error) {
    console.error('Error in batch syllabus API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update batch syllabus progress
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
    const { batch_id, month_number, topics } = body;

    if (!batch_id || month_number === undefined || !topics) {
      return NextResponse.json(
        { error: 'batch_id, month_number, and topics are required' },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    // Calculate completion stats
    const completedTopics = topics.filter(t => t.completed).length;
    const totalTopics = topics.length;
    const completionPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    
    // Determine status
    let status = 'not_started';
    if (completionPercentage === 100) {
      status = 'completed';
    } else if (completionPercentage > 0) {
      status = 'in_progress';
    }

    // Prepare update data
    const updateData = {
      topics,
      completed_topics: completedTopics,
      completion_percentage: completionPercentage,
      status,
      updated_at: new Date().toISOString()
    };

    // Set started_at if moving from not_started
    if (status !== 'not_started' && completedTopics > 0) {
      updateData.started_at = new Date().toISOString();
    }

    // Set completed_at if fully completed
    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('batch_syllabus_progress')
      .update(updateData)
      .eq('batch_id', batch_id)
      .eq('month_number', month_number)
      .select()
      .single();

    if (error) {
      console.error('Error updating batch syllabus:', error);
      return NextResponse.json(
        { error: 'Failed to update batch syllabus' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Batch syllabus updated successfully',
      data
    });

  } catch (error) {
    console.error('Error updating batch syllabus:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Bulk update batch syllabus
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
    const { batch_id, updates } = body;

    if (!batch_id || !updates || !Array.isArray(updates)) {
      return NextResponse.json(
        { error: 'batch_id and updates array are required' },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();
    const results = [];

    for (const update of updates) {
      const { month_number, topics } = update;

      // Calculate completion stats
      const completedTopics = topics.filter(t => t.completed).length;
      const totalTopics = topics.length;
      const completionPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
      
      let status = 'not_started';
      if (completionPercentage === 100) {
        status = 'completed';
      } else if (completionPercentage > 0) {
        status = 'in_progress';
      }

      const updateData = {
        topics,
        completed_topics: completedTopics,
        completion_percentage: completionPercentage,
        status,
        updated_at: new Date().toISOString()
      };

      if (status !== 'not_started' && completedTopics > 0) {
        updateData.started_at = new Date().toISOString();
      }

      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('batch_syllabus_progress')
        .update(updateData)
        .eq('batch_id', batch_id)
        .eq('month_number', month_number)
        .select()
        .single();

      if (!error && data) {
        results.push(data);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${results.length} syllabus modules`,
      data: results
    });

  } catch (error) {
    console.error('Error bulk updating batch syllabus:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
