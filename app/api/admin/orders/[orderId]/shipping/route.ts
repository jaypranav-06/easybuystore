import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/db/prisma';
import { createShipment, getSupportedCarriers } from '@/lib/services/logistics';

// POST - Create shipment for an order
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = await params;

    // Support both order_number and numeric order_id
    const isNumericId = /^\d+$/.test(orderId);

    const body = await request.json();
    const { carrier } = body;

    // Get the order with items
    const order = await prisma.paymentOrder.findFirst({
      where: isNumericId
        ? { order_id: parseInt(orderId) }
        : { order_number: orderId },
      include: {
        order_items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if order already has tracking
    if (order.tracking_number) {
      return NextResponse.json(
        { error: 'Order already has tracking number' },
        { status: 409 }
      );
    }

    // Create shipment with logistics provider
    const shipmentRequest = {
      orderId: order.order_id,
      orderNumber: order.order_number,
      recipient: {
        name: order.shipping_name || 'Customer',
        address: order.shipping_address || '',
        city: order.shipping_city || '',
        state: order.shipping_state || undefined,
        zipCode: order.shipping_zip || undefined,
        country: order.shipping_country || 'Sri Lanka',
        phone: order.shipping_phone || '',
      },
      items: order.order_items.map((item) => ({
        name: item.product?.product_name || 'Product',
        quantity: item.quantity,
        weight: 1, // Default weight in kg
      })),
      preferredCarrier: carrier,
    };

    const shipmentResponse = await createShipment(shipmentRequest);

    if (!shipmentResponse.success) {
      return NextResponse.json(
        { error: shipmentResponse.error || 'Failed to create shipment' },
        { status: 500 }
      );
    }

    // Update order with tracking information
    const updatedOrder = await prisma.paymentOrder.update({
      where: { order_id: order.order_id },
      data: {
        tracking_number: shipmentResponse.trackingNumber,
        carrier: shipmentResponse.carrier,
        shipping_status: 'shipped',
        shipped_at: new Date(),
        estimated_delivery: shipmentResponse.estimatedDelivery,
        order_status: 'shipped',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Shipment created successfully',
      tracking: {
        trackingNumber: updatedOrder.tracking_number,
        carrier: updatedOrder.carrier,
        estimatedDelivery: updatedOrder.estimated_delivery,
      },
    });
  } catch (error) {
    console.error('Error creating shipment:', error);
    return NextResponse.json(
      { error: 'Failed to create shipment' },
      { status: 500 }
    );
  }
}

// PATCH - Update shipping status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = await params;

    // Support both order_number and numeric order_id
    const isNumericId = /^\d+$/.test(orderId);

    // First get the order to find its order_id
    const order = await prisma.paymentOrder.findFirst({
      where: isNumericId
        ? { order_id: parseInt(orderId) }
        : { order_number: orderId },
      select: { order_id: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const body = await request.json();
    const { shipping_status, delivered_at } = body;

    const updateData: any = {
      shipping_status,
    };

    // If status is delivered, update order status and delivered_at
    if (shipping_status === 'delivered') {
      updateData.delivered_at = delivered_at ? new Date(delivered_at) : new Date();
      updateData.order_status = 'delivered';
    }

    const updatedOrder = await prisma.paymentOrder.update({
      where: { order_id: order.order_id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: 'Shipping status updated',
      order: {
        order_id: updatedOrder.order_id,
        shipping_status: updatedOrder.shipping_status,
        delivered_at: updatedOrder.delivered_at,
      },
    });
  } catch (error) {
    console.error('Error updating shipping status:', error);
    return NextResponse.json(
      { error: 'Failed to update shipping status' },
      { status: 500 }
    );
  }
}

// GET - Get supported carriers
export async function GET() {
  try {
    const carriers = getSupportedCarriers();

    return NextResponse.json({
      success: true,
      carriers,
    });
  } catch (error) {
    console.error('Error fetching carriers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch carriers' },
      { status: 500 }
    );
  }
}
