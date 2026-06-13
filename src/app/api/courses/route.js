import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET - Fetch all active courses for public website
export async function GET() {
  try {
    const supabase = supabaseAdmin();
    
    // Fetch only active courses with their syllabus, FAQs, and upcoming batch
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
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching courses:', error);
      return NextResponse.json(
        { error: 'Failed to fetch courses' },
        { status: 500 }
      );
    }

    // Fetch upcoming batches for all courses
    const { data: upcomingBatches } = await supabase
      .from('batches')
      .select('course_slug, batch_name, start_date, status')
      .in('status', ['upcoming', 'active'])
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true });

    // Create a map of course_slug to nearest batch
    const batchMap = {};
    if (upcomingBatches) {
      upcomingBatches.forEach(batch => {
        if (!batchMap[batch.course_slug]) {
          batchMap[batch.course_slug] = batch;
        }
      });
    }

    // Transform data to match the format expected by the website
    const transformedCourses = courses.map((course) => {
      const upcomingBatch = batchMap[course.slug];
      
      return {
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
          status: upcomingBatch.status
        } : null,
        // Additional fields for compatibility
        gradient: 'linear-gradient(135deg, #1e1e2e 0%, #2a2a4a 100%)',
        heroGradient: 'linear-gradient(135deg, #6C3EE8 0%, #3776AB 100%)',
      };
    });

    return NextResponse.json({
      success: true,
      courses: transformedCourses,
    });
  } catch (error) {
    console.error('Error in GET /api/courses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
