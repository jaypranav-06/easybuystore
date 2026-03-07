import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/db/prisma';
import { z } from 'zod';

const capturePayPalOrderSchema = z.object({
  paypal_order_id: z.string(),
  internal_order_id: z.number(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = capturePayPalOrderSchema.parse(body);

    // PayPal SDK capture implementation will be added here
    // For now, simulate successful capture

    const paypalTransactionId = `TXN-${Date.now()}`;

    // Update order with PayPal details
    const order = await prisma.paymentOrder.update({
      where: { order_id: validatedData.internal_order_id },
      data: {
        paypal_order_id: validatedData.paypal_order_id,
        paypal_transaction_id: paypalTransactionId,
        payment_status: 'completed',
        order_status: 'processing',
      },
    });

    return NextResponse.json({
      success: true,
      transaction_id: paypalTransactionId,
      order,
      message: 'Payment captured successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error capturing PayPal order:', error);
    return NextResponse.json(
      { error: 'Failed to capture PayPal order' },
      { status: 500 }
    );
  }
}
