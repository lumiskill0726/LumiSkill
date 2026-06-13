import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// GET - Fetch syllabus tracking for a specific enrollment or course
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
    const enrollmentId = searchParams.get('enrollment_id');
    const courseSlug = searchParams.get('course_slug');

    const supabase = supabaseAdmin();

    let query = supabase
      .from('syllabus_tracking')
      .select(`
        *,
        students (
          id,
          name,
          email
        ),
        enrollments (
          id,
          course_name,
          course_slug
        )
      `)
      .order('month_number', { ascending: true });

    if (enrollmentId) {
      query = query.eq('enrollment_id', enrollmentId);
    } else if (courseSlug) {
      query = query.eq('course_slug', courseSlug);
    }

    const { data: syllabusTracking, error } = await query;

    if (error) {
      console.error('Error fetching syllabus tracking:', error);
      return NextResponse.json(
        { error: 'Failed to fetch syllabus tracking' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: syllabusTracking || [],
    });

  } catch (error) {
    console.error('Error in syllabus tracking API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update syllabus tracking (mark topics as completed)
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
    const { id, topics, month_number, enrollment_id } = body;

    if (!id && (!enrollment_id || !month_number)) {
      return NextResponse.json(
        { error: 'Either id or (enrollment_id + month_number) is required' },
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

    // Update by id or by enrollment_id + month_number
    let query = supabase.from('syllabus_tracking').update(updateData);
    
    if (id) {
      query = query.eq('id', id);
    } else {
      query = query.eq('enrollment_id', enrollment_id).eq('month_number', month_number);
    }

    const { data, error } = await query.select().single();

    if (error) {
      console.error('Error updating syllabus tracking:', error);
      return NextResponse.json(
        { error: 'Failed to update syllabus tracking' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Syllabus tracking updated successfully',
      data
    });

  } catch (error) {
    console.error('Error updating syllabus tracking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Bulk update multiple topics at once
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
    const { updates } = body; // Array of { id, topics } or { enrollment_id, month_number, topics }

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json(
        { error: 'Updates array is required' },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();
    const results = [];

    for (const update of updates) {
      const { id, enrollment_id, month_number, topics } = update;

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

      let query = supabase.from('syllabus_tracking').update(updateData);
      
      if (id) {
        query = query.eq('id', id);
      } else if (enrollment_id && month_number) {
        query = query.eq('enrollment_id', enrollment_id).eq('month_number', month_number);
      } else {
        continue; // Skip invalid updates
      }

      const { data, error } = await query.select().single();

      if (!error && data) {
        results.push(data);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${results.length} syllabus tracking records`,
      data: results
    });

  } catch (error) {
    console.error('Error bulk updating syllabus tracking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
