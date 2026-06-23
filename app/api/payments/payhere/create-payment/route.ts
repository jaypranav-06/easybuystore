import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      order_id,
      amount,
      currency = 'LKR',
      first_name,
      last_name,
      email,
      phone,
      address,
      city,
      country = 'Sri Lanka',
    } = body;

    // Validate required PayHere credentials
    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

    if (!merchantId || !merchantSecret) {
      return NextResponse.json(
        { error: 'PayHere credentials not configured' },
        { status: 500 }
      );
    }

    // Generate PayHere hash
    // Format: merchant_id + order_id + amount + currency (uppercase) + MD5(merchant_secret)
    const merchantSecretHash = crypto
      .createHash('md5')
      .update(merchantSecret)
      .digest('hex')
      .toUpperCase();

    const hashString = `${merchantId}${order_id}${Number(amount).toFixed(2)}${currency.toUpperCase()}${merchantSecretHash}`;

    const hash = crypto
      .createHash('md5')
      .update(hashString)
      .digest('hex')
      .toUpperCase();

    // Return payment data for frontend
    return NextResponse.json({
      success: true,
      payment: {
        merchant_id: merchantId,
        return_url: `${process.env.NEXTAUTH_URL}/checkout/payhere/return`,
        cancel_url: `${process.env.NEXTAUTH_URL}/checkout/payhere/cancel`,
        notify_url: `${process.env.NEXTAUTH_URL}/api/payments/payhere/notify`,
        order_id,
        items: `Order #${order_id}`,
        currency,
        amount: Number(amount).toFixed(2),
        first_name,
        last_name,
        email,
        phone,
        address,
        city,
        country,
        hash,
      },
    });
  } catch (error) {
    console.error('Error creating PayHere payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
