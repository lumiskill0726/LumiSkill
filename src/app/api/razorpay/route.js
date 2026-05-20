import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { amount, currency = 'INR', courseName, studentName } = await request.json();

    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Lazy initialize Razorpay client inside the handler
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      console.error('Razorpay credentials missing');
      return NextResponse.json(
        { error: 'Payment service configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects paise (multiply by 100)
      currency,
      receipt: `lumiskill_${Date.now()}`,
      notes: {
        courseName: courseName || 'LumiSkill Course',
        studentName: studentName || 'Student',
        website: 'www.lumiskill.com',
      },
    });

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order. Please try again.' },
      { status: 500 }
    );
  }
}
