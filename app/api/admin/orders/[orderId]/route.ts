import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/db/prisma';

// GET /api/admin/orders/[orderId] - Get single order by order_number or ID (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = await params;

    // Try to find by order_number first (if it's not a pure number)
    // Otherwise treat it as order_id for backward compatibility
    const isNumericId = /^\d+$/.test(orderId);

    const order = await prisma.paymentOrder.findFirst({
      where: isNumericId
        ? { order_id: parseInt(orderId) }
        : { order_number: orderId },
      include: {
        order_items: {
          include: {
            product: {
              select: {
                product_name: true,
                image_url: true,
              },
            },
          },
        },
        user: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.order_id,
        order_number: order.order_number,
        created_at: order.created_at,
        total: order.total,
        subtotal: order.subtotal,
        tax: order.tax,
        shipping: order.shipping,
        order_status: order.order_status,
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        shipping_address: order.shipping_address,
        user: order.user,
        order_items: order.order_items,
      },
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = await params;
    const body = await request.json();
    const { order_status, payment_status } = body;

    // Support both order_number and numeric order_id
    const isNumericId = /^\d+$/.test(orderId);

    const order = await prisma.paymentOrder.updateMany({
      where: isNumericId
        ? { order_id: parseInt(orderId) }
        : { order_number: orderId },
      data: {
        order_status,
        payment_status,
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
