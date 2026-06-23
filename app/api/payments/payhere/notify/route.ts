import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const merchant_id = formData.get('merchant_id') as string;
    const order_id = formData.get('order_id') as string;
    const payhere_amount = formData.get('payhere_amount') as string;
    const payhere_currency = formData.get('payhere_currency') as string;
    const status_code = formData.get('status_code') as string;
    const md5sig = formData.get('md5sig') as string;
    const payment_id = formData.get('payment_id') as string;

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

    if (!merchantSecret) {
      console.error('PayHere merchant secret not configured');
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
    }

    // Verify the hash to ensure authenticity
    const merchantSecretHash = crypto
      .createHash('md5')
      .update(merchantSecret)
      .digest('hex')
      .toUpperCase();

    const localMd5sig = crypto
      .createHash('md5')
      .update(
        `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${merchantSecretHash}`
      )
      .digest('hex')
      .toUpperCase();

    if (localMd5sig !== md5sig) {
      console.error('PayHere signature verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Find the order
    const order = await prisma.paymentOrder.findFirst({
      where: { order_number: order_id },
    });

    if (!order) {
      console.error('Order not found:', order_id);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update order based on payment status
    // status_code: 2 = success, 0 = pending, -1 = canceled, -2 = failed, -3 = chargedback
    if (status_code === '2') {
      // Payment successful
      await prisma.paymentOrder.update({
        where: { order_id: order.order_id },
        data: {
          payment_status: 'paid',
          order_status: 'processing',
          payment_method: 'payhere',
        },
      });

      console.log('PayHere payment successful:', order_id, payment_id);
    } else if (status_code === '0') {
      // Payment pending
      await prisma.paymentOrder.update({
        where: { order_id: order.order_id },
        data: {
          payment_status: 'pending',
          payment_method: 'payhere',
        },
      });

      console.log('PayHere payment pending:', order_id, payment_id);
    } else {
      // Payment failed, canceled, or chargedback
      await prisma.paymentOrder.update({
        where: { order_id: order.order_id },
        data: {
          payment_status: 'failed',
          payment_method: 'payhere',
        },
      });

      console.log('PayHere payment failed:', order_id, status_code, payment_id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing PayHere notification:', error);
    return NextResponse.json(
      { error: 'Failed to process notification' },
      { status: 500 }
    );
  }
}
