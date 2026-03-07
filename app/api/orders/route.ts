import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/db/prisma';
import { z } from 'zod';

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      product_id: z.number(),
      quantity: z.number().min(1),
      price: z.number(),
    })
  ),
  subtotal: z.number(),
  tax: z.number().optional(),
  shipping: z.number().optional(),
  discount: z.number().optional(),
  total: z.number(),
  payment_method: z.string(),
  shipping_name: z.string(),
  shipping_address: z.string(),
  shipping_city: z.string(),
  shipping_state: z.string(),
  shipping_zip: z.string(),
  shipping_country: z.string(),
  shipping_phone: z.string(),
});

// GET /api/orders - Get all orders for logged-in user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit');
    const page = searchParams.get('page');

    const take = limit ? parseInt(limit) : undefined;
    const skip = page && limit ? (parseInt(page) - 1) * parseInt(limit) : undefined;

    const [orders, total] = await Promise.all([
      prisma.paymentOrder.findMany({
        where: { user_id: userId },
        include: {
          order_items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        take,
        skip,
      }),
      prisma.paymentOrder.count({ where: { user_id: userId } }),
    ]);

    return NextResponse.json({
      success: true,
      orders,
      total,
      page: page ? parseInt(page) : 1,
      limit: take || total,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);
    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);

    // Generate unique order number
    const orderNumber = `VV-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Create order with order items
    const order = await prisma.paymentOrder.create({
      data: {
        order_number: orderNumber,
        user_id: userId,
        subtotal: validatedData.subtotal,
        tax: validatedData.tax,
        shipping: validatedData.shipping,
        discount: validatedData.discount,
        total: validatedData.total,
        payment_method: validatedData.payment_method,
        shipping_name: validatedData.shipping_name,
        shipping_address: validatedData.shipping_address,
        shipping_city: validatedData.shipping_city,
        shipping_state: validatedData.shipping_state,
        shipping_zip: validatedData.shipping_zip,
        shipping_country: validatedData.shipping_country,
        shipping_phone: validatedData.shipping_phone,
        order_status: 'pending',
        payment_status: 'pending',
        order_items: {
          create: validatedData.items.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity,
          })),
        },
      },
      include: {
        order_items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Clear user's cart after order creation
    await prisma.cartItem.deleteMany({
      where: { user_id: userId },
    });

    return NextResponse.json({
      success: true,
      order,
      message: 'Order created successfully',
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
