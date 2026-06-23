import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { z } from 'zod';

// Validation schema for PayPal order creation
const createPayPalOrderSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  order_id: z.number().optional(), // Internal order ID reference
  items: z.array(z.object({
    name: z.string(),
    quantity: z.number(),
    unit_amount: z.number(),
  })).optional(),
});

// Get PayPal OAuth access token for API authentication
async function getPayPalAccessToken() {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
  const PAYPAL_API_URL = process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

  // Encode credentials in Base64 for Basic auth
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');

  // Request access token from PayPal OAuth endpoint
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

// Create a PayPal order for checkout
export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createPayPalOrderSchema.parse(body);

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    const PAYPAL_API_URL = process.env.PAYPAL_MODE === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    // Create PayPal order using REST API
    // Reference: https://developer.paypal.com/docs/api/orders/v2/#orders_create
    const createOrderResponse = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: validatedData.order_id?.toString() || 'default',
            amount: {
              currency_code: validatedData.currency,
              value: validatedData.amount.toFixed(2),
              breakdown: validatedData.items ? {
                item_total: {
                  currency_code: validatedData.currency,
                  value: validatedData.amount.toFixed(2),
                },
              } : undefined,
            },
            items: validatedData.items?.map(item => ({
              name: item.name,
              quantity: item.quantity.toString(),
              unit_amount: {
                currency_code: validatedData.currency,
                value: item.unit_amount.toFixed(2),
              },
            })),
          },
        ],
        application_context: {
          return_url: `${process.env.NEXTAUTH_URL}/checkout/success`,
          cancel_url: `${process.env.NEXTAUTH_URL}/checkout/cancel`,
          brand_name: 'EasyBuyStore',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
        },
      }),
    });

    if (!createOrderResponse.ok) {
      const errorData = await createOrderResponse.json();
      console.error('PayPal API Error:', errorData);
      throw new Error('Failed to create PayPal order');
    }

    const paypalOrder = await createOrderResponse.json();

    // Find the approve URL for customer to complete payment
    const approveLink = paypalOrder.links.find((link: any) => link.rel === 'approve');

    return NextResponse.json({
      success: true,
      paypal_order_id: paypalOrder.id,
      approve_url: approveLink?.href,
      status: paypalOrder.status,
      message: 'PayPal order created successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating PayPal order:', error);
    return NextResponse.json(
      { error: 'Failed to create PayPal order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
