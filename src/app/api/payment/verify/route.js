import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { sendWelcomeEmail } from '@/lib/email';
import { generatePassword, hashPassword } from '@/lib/password';
import { getCourseBySlug } from '@/data/courses';

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

    // Get course details to extract level
    const courseData = getCourseBySlug(courseSlug);
    const courseLevel = courseData?.level || 'Beginner';

    // Create enrollment
    const enrollmentDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 6); // 6 months course duration

    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .insert({
        student_id: student.id,
        course_slug: courseSlug,
        course_name: courseName,
        course_level: courseLevel, // Dynamic level from course data
        course_duration_months: 6, // 6 months duration
        enrollment_date: enrollmentDate.toISOString(),
        end_date: endDate.toISOString(),
        status: 'active',
        payment_status: 'paid',
        payment_id: razorpay_payment_id,
        amount_paid: amount / 100, // Convert paise to rupees
      })
      .select()
      .single();

    if (enrollmentError) {
      console.error('Error creating enrollment:', enrollmentError);
      return NextResponse.json(
        { 
          success: true, 
          verified: true,
          message: 'Payment verified but enrollment failed. Please contact support.',
          paymentId: razorpay_payment_id 
        },
        { status: 200 }
      );
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
