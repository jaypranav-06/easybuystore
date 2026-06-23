import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/db/prisma';

// Get single order details by ID for authenticated user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    // Verify user authentication
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);
    // Extract and parse order ID from URL params
    const { orderId: orderIdParam } = await params;
    const orderId = parseInt(orderIdParam);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    const order = await prisma.paymentOrder.findFirst({
      where: {
        order_id: orderId,
        user_id: userId, // Ensure user can only access their own orders
      },
      include: {
        order_items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
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
      order,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
