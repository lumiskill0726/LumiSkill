import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get student from database
    const supabase = supabaseAdmin();
    const { data: student, error } = await supabase
      .from('students')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .single();

    if (error || !student) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, student.password_hash);
    
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last login
    await supabase
      .from('students')
      .update({ last_login: new Date().toISOString() })
      .eq('id', student.id);

    // Create session token
    const sessionToken = jwt.sign(
      { 
        studentId: student.id,
        email: student.email,
        name: student.name,
        type: 'student'
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Store session in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await supabase
      .from('student_sessions')
      .insert({
        student_id: student.id,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
        is_active: true
      });

    // Remove sensitive data
    delete student.password_hash;

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        parent_name: student.parent_name,
        student_class: student.student_class
      }
    });

    // Set HTTP-only cookie
    response.cookies.set('student_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Student login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
