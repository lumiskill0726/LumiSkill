import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { sendWelcomeEmail } from '@/lib/email';
import { generatePassword, hashPassword } from '@/lib/password';

export async function POST(request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseSlug,
      courseName,
      email,
      studentName,
      parentName,
      phone,
      studentClass,
      amount,
    } = await request.json();

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment verification fields' },
        { status: 400 }
      );
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json(
        { error: 'Payment verification failed', success: false },
        { status: 400 }
      );
    }

    // Payment is verified, now create/get student
    const supabase = supabaseAdmin();

    // Check if student exists
    let { data: student, error: studentError } = await supabase
      .from('students')
      .select('id, email')
      .eq('email', email)
      .single();

    // If student doesn't exist, create one
    if (studentError || !student) {
      // Generate password for new student
      const plainPassword = generatePassword(12);
      const hashedPassword = await hashPassword(plainPassword);

      const { data: newStudent, error: createError } = await supabase
        .from('students')
        .insert({
          email: email.toLowerCase(),
          password_hash: hashedPassword,
          name: studentName,
          phone: phone,
          parent_name: parentName,
          parent_email: email,
          student_class: studentClass,
          is_active: true,
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating student:', createError);
        return NextResponse.json(
          { 
            success: true, 
            verified: true,
            message: 'Payment verified but student creation failed. Please contact support.',
            paymentId: razorpay_payment_id 
          },
          { status: 200 }
        );
      }

      student = newStudent;
      
      // Send welcome email with credentials
      try {
        await sendWelcomeEmail({
          parentEmail: email,
          studentName,
          parentName,
          studentEmail: email,
          studentPassword: plainPassword,
          courseName,
          paymentId: razorpay_payment_id,
          amount,
          enrollmentDate: new Date().toISOString(),
        });
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
        // Don't fail the payment if email fails
      }
    }

    // Get course details from database
    console.log('🔍 Fetching course with slug:', courseSlug);
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('id, level, duration_months')
      .eq('slug', courseSlug)
      .eq('is_active', true)
      .single();

    if (courseError || !courseData) {
      console.error('❌ Error fetching course:', courseError);
      console.error('Course slug attempted:', courseSlug);
      return NextResponse.json(
        { 
          success: true, 
          verified: true,
          message: `Payment verified but course "${courseSlug}" not found in database. Please contact support.`,
          paymentId: razorpay_payment_id,
          debug: {
            courseSlug,
            error: courseError?.message
          }
        },
        { status: 200 }
      );
    }

    console.log('✅ Course found:', courseData);
    const courseLevel = courseData.level || 'Beginner';
    const courseDurationMonths = courseData.duration_months || 6;

    // Create enrollment
    const enrollmentDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + courseDurationMonths);

    console.log('📝 Creating enrollment for student:', student.id, 'course:', courseData.id);
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .insert({
        student_id: student.id,
        course_id: courseData.id,
        course_slug: courseSlug,
        course_name: courseName,
        course_level: courseLevel,
        course_duration_months: courseDurationMonths,
        enrollment_date: enrollmentDate.toISOString(),
        start_date: enrollmentDate.toISOString(), // Add start_date (required field)
        end_date: endDate.toISOString(),
        status: 'active',
        payment_status: 'paid',
        payment_id: razorpay_payment_id,
        amount_paid: amount / 100,
      })
      .select()
      .single();

    if (enrollmentError) {
      console.error('❌ Error creating enrollment:', enrollmentError);
      console.error('Enrollment data attempted:', {
        student_id: student.id,
        course_id: courseData.id,
        course_slug: courseSlug
      });
      return NextResponse.json(
        { 
          success: true, 
          verified: true,
          message: 'Payment verified but enrollment failed. Please contact support.',
          paymentId: razorpay_payment_id,
          debug: {
            error: enrollmentError?.message,
            details: enrollmentError?.details
          }
        },
        { status: 200 }
      );
    }

    console.log('✅ Enrollment created successfully:', enrollment.id);

    // Find and assign to nearest upcoming batch
    try {
      const { data: upcomingBatch, error: batchError } = await supabase
        .from('batches')
        .select('id, current_students, max_students')
        .eq('course_slug', courseSlug)
        .in('status', ['upcoming', 'active'])
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(1)
        .single();

      if (!batchError && upcomingBatch && upcomingBatch.current_students < upcomingBatch.max_students) {
        // Add student to batch
        const { error: batchStudentError } = await supabase
          .from('batch_students')
          .insert({
            batch_id: upcomingBatch.id,
            student_id: student.id,
            enrollment_id: enrollment.id,
            status: 'active'
          });

        if (!batchStudentError) {
          // Update batch student count
          await supabase
            .from('batches')
            .update({ current_students: upcomingBatch.current_students + 1 })
            .eq('id', upcomingBatch.id);
          
          console.log('✅ Student assigned to batch:', upcomingBatch.id);
        } else {
          console.error('⚠️ Error assigning student to batch:', batchStudentError);
        }
      } else {
        console.log('⚠️ No available upcoming batch found for course:', courseSlug);
      }
    } catch (batchErr) {
      console.error('⚠️ Error finding/assigning batch:', batchErr);
      // Don't fail the payment if batch assignment fails
    }

    // Populate syllabus tracking from course_syllabus
    try {
      const { data: courseSyllabus, error: syllabusError } = await supabase
        .from('course_syllabus')
        .select('*')
        .eq('course_id', courseData.id)
        .order('month_number', { ascending: true });

      if (!syllabusError && courseSyllabus && courseSyllabus.length > 0) {
        const syllabusTrackingData = courseSyllabus.map((module) => ({
          student_id: student.id,
          enrollment_id: enrollment.id,
          course_slug: courseSlug,
          month_number: module.month_number,
          month_title: module.title,
          topics: module.topics.map(topic => ({ topic, completed: false })),
          total_topics: module.topics.length,
          completed_topics: 0,
          completion_percentage: 0,
          status: 'not_started'
        }));

        const { error: trackingError } = await supabase
          .from('syllabus_tracking')
          .insert(syllabusTrackingData);

        if (trackingError) {
          console.error('⚠️ Error creating syllabus tracking:', trackingError);
        } else {
          console.log('✅ Syllabus tracking created for', courseSyllabus.length, 'modules');
        }
      }
    } catch (syllabusErr) {
      console.error('⚠️ Error populating syllabus:', syllabusErr);
      // Don't fail the payment if syllabus population fails
    }

    return NextResponse.json({
      success: true,
      verified: true,
      message: 'Payment successful and enrollment created!',
      paymentId: razorpay_payment_id,
      enrollmentId: enrollment.id,
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Payment verification failed', details: error.message },
      { status: 500 }
    );
  }
}
