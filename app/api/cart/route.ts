import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/db/prisma';
import { z } from 'zod';

const saveCartSchema = z.object({
  items: z.array(
    z.object({
      product_id: z.number(),
      quantity: z.number().min(1),
    })
  ),
});

// GET /api/cart - Get saved cart for logged-in user
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

    const cartItems = await prisma.cartItem.findMany({
      where: { user_id: userId },
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    // Get product details for each cart item
    const productIds = cartItems.map((item) => item.product_id);
    const products = await prisma.product.findMany({
      where: {
        product_id: { in: productIds },
        is_active: true,
      },
    });

    // Merge cart items with product details
    const cartWithProducts = cartItems.map((item) => {
      const product = products.find((p) => p.product_id === item.product_id);
      return {
        ...item,
        product,
      };
    });

    return NextResponse.json({
      success: true,
      cart: cartWithProducts,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Save cart for logged-in user
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
    const validatedData = saveCartSchema.parse(body);

    // Delete existing cart items
    await prisma.cartItem.deleteMany({
      where: { user_id: userId },
    });

    // Create new cart items
    if (validatedData.items.length > 0) {
      await prisma.cartItem.createMany({
        data: validatedData.items.map((item) => ({
          user_id: userId,
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Cart saved successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error saving cart:', error);
    return NextResponse.json(
      { error: 'Failed to save cart' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Clear cart for logged-in user
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);

    await prisma.cartItem.deleteMany({
      where: { user_id: userId },
    });

    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully',
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}
