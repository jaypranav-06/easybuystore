import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/db/prisma';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-03-25.dahlia',
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id, order_id } = body;

    if (!session_id || !order_id) {
      return NextResponse.json(
        { success: false, error: 'Missing session_id or order_id' },
        { status: 400 }
      );
    }

    const stripe = getStripe();

    // Retrieve the session from Stripe to verify payment
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Check if payment was successful
    if (session.payment_status === 'paid') {
      // Update the order in the database
      await prisma.paymentOrder.updateMany({
        where: { order_number: order_id },
        data: {
          payment_status: 'paid',
          order_status: 'processing',
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Order updated successfully',
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Payment not completed',
      });
    }
  } catch (error: any) {
    console.error('Error verifying Stripe session:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to verify session' },
      { status: 500 }
    );
  }
}
