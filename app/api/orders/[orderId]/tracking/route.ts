import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/db/prisma';
import { trackShipment } from '@/lib/services/logistics';

// Get shipment tracking information for an order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    // Verify user authentication
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract and parse order ID from URL params
    const { orderId } = await params;
    const orderIdNum = parseInt(orderId);

    if (isNaN(orderIdNum)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    // Get the order
    const order = await prisma.paymentOrder.findFirst({
      where: {
        order_id: orderIdNum,
        user_id: parseInt(session.user.id),
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if order has tracking information
    if (!order.tracking_number || !order.carrier) {
      return NextResponse.json({
        success: true,
        hasTracking: false,
        message: 'Tracking information not yet available',
      });
    }

    // Get tracking details from logistics provider
    const trackingDetails = await trackShipment(order.tracking_number, order.carrier);

    if (!trackingDetails) {
      return NextResponse.json(
        { error: 'Unable to retrieve tracking information' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      hasTracking: true,
      tracking: {
        trackingNumber: order.tracking_number,
        carrier: order.carrier,
        status: order.shipping_status,
        estimatedDelivery: order.estimated_delivery,
        shippedAt: order.shipped_at,
        deliveredAt: order.delivered_at,
        details: trackingDetails,
      },
    });
  } catch (error) {
    console.error('Error fetching tracking information:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tracking information' },
      { status: 500 }
    );
  }
}
