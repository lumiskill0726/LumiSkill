import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET - Fetch all courses
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const isActive = searchParams.get('is_active');

    const supabase = supabaseAdmin();
    let query = supabase
      .from('courses')
      .select(`
        *,
        course_syllabus (
          id,
          month_number,
          title,
          topics
        ),
        course_faqs (
          id,
          question,
          answer,
          display_order
        )
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (isActive !== null && isActive !== undefined) {
      query = query.eq('is_active', isActive === 'true');
    }

    const { data: courses, error } = await query;

    if (error) {
      console.error('Error fetching courses:', error);
      return NextResponse.json(
        { error: 'Failed to fetch courses' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      courses: courses || [],
    });
  } catch (error) {
    console.error('Error in GET /api/admin/courses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new course
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      slug,
      title,
      subtitle,
      description,
      long_description,
      level,
      duration_months,
      price,
      icon,
      badge,
      badge_type,
      next_batch_date,
      is_active = true,
      syllabus = [],
      faqs = [],
    } = body;

    // Validate required fields
    if (!slug || !title || !level || !duration_months || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    // Create course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        slug,
        title,
        subtitle,
        description,
        long_description,
        level,
        duration_months,
        price,
        icon,
        badge,
        badge_type,
        next_batch_date,
        is_active,
      })
      .select()
      .single();

    if (courseError) {
      console.error('Error creating course:', courseError);
      return NextResponse.json(
        { error: courseError.message || 'Failed to create course' },
        { status: 500 }
      );
    }

    // Insert syllabus if provided
    if (syllabus.length > 0) {
      const syllabusData = syllabus.map((item) => ({
        course_id: course.id,
        month_number: item.month_number,
        title: item.title,
        topics: item.topics,
      }));

      const { error: syllabusError } = await supabase
        .from('course_syllabus')
        .insert(syllabusData);

      if (syllabusError) {
        console.error('Error creating syllabus:', syllabusError);
      }
    }

    // Insert FAQs if provided
    if (faqs.length > 0) {
      const faqsData = faqs.map((item, index) => ({
        course_id: course.id,
        question: item.question,
        answer: item.answer,
        display_order: item.display_order || index,
      }));

      const { error: faqsError } = await supabase
        .from('course_faqs')
        .insert(faqsData);

      if (faqsError) {
        console.error('Error creating FAQs:', faqsError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Course created successfully',
      course,
    });
  } catch (error) {
    console.error('Error in POST /api/admin/courses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update course
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, syllabus, faqs, ...courseData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    // Update course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .update(courseData)
      .eq('id', id)
      .select()
      .single();

    if (courseError) {
      console.error('Error updating course:', courseError);
      return NextResponse.json(
        { error: 'Failed to update course' },
        { status: 500 }
      );
    }

    // Update syllabus if provided
    if (syllabus) {
      // Delete existing syllabus
      await supabase.from('course_syllabus').delete().eq('course_id', id);

      // Insert new syllabus
      if (syllabus.length > 0) {
        const syllabusData = syllabus.map((item) => ({
          course_id: id,
          month_number: item.month_number,
          title: item.title,
          topics: item.topics,
        }));

        await supabase.from('course_syllabus').insert(syllabusData);
      }
    }

    // Update FAQs if provided
    if (faqs) {
      // Delete existing FAQs
      await supabase.from('course_faqs').delete().eq('course_id', id);

      // Insert new FAQs
      if (faqs.length > 0) {
        const faqsData = faqs.map((item, index) => ({
          course_id: id,
          question: item.question,
          answer: item.answer,
          display_order: item.display_order || index,
        }));

        await supabase.from('course_faqs').insert(faqsData);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Course updated successfully',
      course,
    });
  } catch (error) {
    console.error('Error in PUT /api/admin/courses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete course
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    // Delete course (syllabus and FAQs will be deleted automatically due to CASCADE)
    const { error } = await supabase.from('courses').delete().eq('id', id);

    if (error) {
      console.error('Error deleting course:', error);
      return NextResponse.json(
        { error: 'Failed to delete course' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /api/admin/courses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
