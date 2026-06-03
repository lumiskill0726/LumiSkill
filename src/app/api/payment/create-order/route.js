import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request) {
  try {
    const { amount, currency, courseId, courseName, studentEmail, studentName } = await request.json();

    // Validate required fields
    if (!amount || !courseId || !studentEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Create order options
    const options = {
      amount: amount * 100, // Amount in paise (multiply by 100)
      currency: currency || 'INR',
      receipt: `receipt_${courseId}_${Date.now()}`,
      notes: {
        courseId,
        courseName,
        studentEmail,
        studentName,
      },
    };

    // Create Razorpay order
    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to create order', details: error.message },
      { status: 500 }
    );
  }
}
