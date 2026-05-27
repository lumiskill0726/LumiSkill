import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token');

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated', authenticated: false },
        { status: 401 }
      );
    }

    try {
      const decoded = verify(token.value, JWT_SECRET);

      return NextResponse.json(
        {
          authenticated: true,
          user: {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
          },
        },
        { status: 200 }
      );
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid token', authenticated: false },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error in admin verify:', error);
    return NextResponse.json(
      { error: 'Internal server error', authenticated: false },
      { status: 500 }
    );
  }
}
