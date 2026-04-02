import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { order_id, amount, currency = 'lkr', items, customer_email } = body;

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.unit_amount * 100), // Stripe uses cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/checkout/stripe/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order_id}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout/stripe/cancel?order_id=${order_id}`,
      customer_email,
      metadata: {
        order_id: order_id.toString(),
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error: any) {
    console.error('Error creating Stripe checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
