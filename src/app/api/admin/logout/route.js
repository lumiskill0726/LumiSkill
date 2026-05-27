import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logout successful',
      },
      { status: 200 }
    );

    // Clear the admin token cookie
    response.cookies.set('admin_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error in admin logout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
