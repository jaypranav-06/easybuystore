import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/db/prisma';
import { z } from 'zod';

const capturePayPalOrderSchema = z.object({
  paypal_order_id: z.string(),
  internal_order_id: z.number(),
});

// Get PayPal access token
async function getPayPalAccessToken() {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
  const PAYPAL_API_URL = process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');

  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get PayPal access token');
  }

  const data = await response.json();
  return data.access_token;
}

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

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    const PAYPAL_API_URL = process.env.PAYPAL_MODE === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    // Capture PayPal order using REST API
    // Reference: https://developer.paypal.com/docs/api/orders/v2/#orders_capture
    const captureResponse = await fetch(
      `${PAYPAL_API_URL}/v2/checkout/orders/${validatedData.paypal_order_id}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!captureResponse.ok) {
      const errorData = await captureResponse.json();
      console.error('PayPal Capture Error:', errorData);
      throw new Error('Failed to capture PayPal order');
    }

    const captureData = await captureResponse.json();

    // Extract transaction ID from capture response
    const paypalTransactionId = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id;
    const captureStatus = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.status;

    // Update order with PayPal details
    const order = await prisma.paymentOrder.update({
      where: { order_id: validatedData.internal_order_id },
      data: {
        paypal_order_id: validatedData.paypal_order_id,
        paypal_transaction_id: paypalTransactionId || `TXN-${Date.now()}`,
        payment_status: captureStatus === 'COMPLETED' ? 'paid' : 'pending',
        order_status: captureStatus === 'COMPLETED' ? 'processing' : 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      transaction_id: paypalTransactionId,
      capture_status: captureStatus,
      paypal_data: {
        id: captureData.id,
        status: captureData.status,
        payer: {
          email: captureData.payer?.email_address,
          name: captureData.payer?.name?.given_name + ' ' + captureData.payer?.name?.surname,
        },
      },
      order,
      message: 'Payment captured successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error capturing PayPal order:', error);
    return NextResponse.json(
      { error: 'Failed to capture PayPal order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
