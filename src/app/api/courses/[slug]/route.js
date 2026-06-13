import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET - Fetch single course by slug for public website
export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();
    
    // Fetch course with syllabus and FAQs
    const { data: courses, error } = await supabase
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
      .eq('slug', slug)
      .eq('is_active', true)
      .limit(1);

    if (error) {
      console.error('Error fetching course:', error);
      return NextResponse.json(
        { error: 'Failed to fetch course' },
        { status: 500 }
      );
    }

    if (!courses || courses.length === 0) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    const course = courses[0];

    // Fetch upcoming batch for this course
    const { data: upcomingBatch } = await supabase
      .from('batches')
      .select('batch_name, start_date, status, current_students, max_students')
      .eq('course_slug', slug)
      .in('status', ['upcoming', 'active'])
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true })
      .limit(1)
      .single();

    // Transform data to match the format expected by the website
    const transformedCourse = {
      id: course.id,
      slug: course.slug,
      title: course.title,
      subtitle: course.subtitle || course.level,
      tagline: course.description,
      badge: course.badge,
      badgeType: course.badge_type,
      level: course.level,
      duration: `${course.duration_months} Months`,
      price: `₹${course.price.toLocaleString('en-IN')}`,
      students: `${course.students_enrolled || 0}+`,
      icon: course.icon || '📚',
      description: course.description,
      longDescription: course.long_description,
      skills: [], // Can be added to database if needed
      outcomes: [], // Can be added to database if needed
      whoIsItFor: [], // Can be added to database if needed
      curriculum: course.course_syllabus
        ?.sort((a, b) => a.month_number - b.month_number)
        .map((s) => ({
          week: `Month ${s.month_number}`,
          title: s.title,
          topics: s.topics,
        })) || [],
      faqs: course.course_faqs
        ?.sort((a, b) => a.display_order - b.display_order)
        .map((f) => ({
          q: f.question,
          a: f.answer,
        })) || [],
      // Upcoming batch information
      upcomingBatch: upcomingBatch ? {
        batchName: upcomingBatch.batch_name,
        startDate: upcomingBatch.start_date,
        status: upcomingBatch.status,
        currentStudents: upcomingBatch.current_students,
        maxStudents: upcomingBatch.max_students,
        seatsAvailable: upcomingBatch.max_students - upcomingBatch.current_students
      } : null,
      // Additional fields for compatibility
      gradient: 'linear-gradient(135deg, #1e1e2e 0%, #2a2a4a 100%)',
      heroGradient: 'linear-gradient(135deg, #6C3EE8 0%, #3776AB 100%)',
    };

    return NextResponse.json({
      success: true,
      course: transformedCourse,
    });
  } catch (error) {
    console.error('Error in GET /api/courses/[slug]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
