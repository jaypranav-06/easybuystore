/**
 * SHOPPING CART API ENDPOINT
 *
 * This API manages the user's shopping cart in Supabase database.
 * URL: /api/cart
 * Methods: GET, POST, DELETE
 *
 * Key Concepts for VIVA:
 * - Cart persists across sessions (saved in database, not just browser)
 * - Requires user authentication (must be logged in)
 * - Synchronizes local cart (browser) with server cart (database)
 * - Each user has their own cart items
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/db/prisma';
import { z } from 'zod';

/**
 * CART VALIDATION SCHEMA
 *
 * Validates cart data before saving to database.
 * Ensures data is in correct format and prevents errors.
 */
const saveCartSchema = z.object({
  items: z.array(
    z.object({
      product_id: z.number(),         // Must be a number
      quantity: z.number().min(1),    // Quantity must be at least 1
    })
  ),
});

/**
 * GET /api/cart
 *
 * Fetch the logged-in user's saved cart from database.
 *
 * Use case:
 * - When user logs in, load their saved cart
 * - Sync cart across devices (phone, laptop)
 * - Restore cart if browser is closed
 *
 * Returns: Array of cart items with product details
 */
export async function GET(request: NextRequest) {
  try {
    /**
     * CHECK AUTHENTICATION
     *
     * Only logged-in users can access their cart.
     * If not logged in, return 401 Unauthorized.
     */
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 } // Unauthorized - must login first
      );
    }

    const userId = parseInt(session.user.id);

    /**
     * FETCH CART ITEMS FROM DATABASE
     *
     * Get all cart items for this user, including user details.
     */
    const cartItems = await prisma.cartItem.findMany({
      where: { user_id: userId }, // Only this user's items
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    /**
     * GET PRODUCT DETAILS
     *
     * Cart items only store product_id and quantity.
     * We need to fetch full product details (name, price, image, etc.)
     */
    const productIds = cartItems.map((item) => item.product_id);
    const products = await prisma.product.findMany({
      where: {
        product_id: { in: productIds }, // Get multiple products at once
        is_active: true,                // Only active products
      },
    });

    /**
     * MERGE CART ITEMS WITH PRODUCT DETAILS
     *
     * Combine cart data (quantity) with product data (name, price, image).
     * This gives us everything needed to display the cart.
     */
    const cartWithProducts = cartItems.map((item) => {
      const product = products.find((p) => p.product_id === item.product_id);
      return {
        ...item,
        product, // Add complete product information
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

/**
 * POST /api/cart
 *
 * Save/update the user's cart to database.
 *
 * Use case:
 * - User adds item to cart → save to database
 * - User changes quantity → update database
 * - Sync local cart to server when user logs in
 *
 * Process:
 * 1. Delete all existing cart items for user
 * 2. Insert new cart items
 * This ensures cart is always in sync (no duplicates)
 */
export async function POST(request: NextRequest) {
  try {
    /**
     * CHECK AUTHENTICATION
     */
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);

    /**
     * VALIDATE REQUEST DATA
     *
     * Parse and validate the cart data from request body.
     * If invalid format, Zod will throw an error.
     */
    const body = await request.json();
    const validatedData = saveCartSchema.parse(body);

    /**
     * REPLACE CART ITEMS
     *
     * Strategy: Delete all existing items, then insert new ones.
     * This is simpler than trying to update/add/remove individual items.
     */

    // Step 1: Delete all existing cart items for this user
    await prisma.cartItem.deleteMany({
      where: { user_id: userId },
    });

    // Step 2: Insert new cart items (if any)
    if (validatedData.items.length > 0) {
      await prisma.cartItem.createMany({
        data: validatedData.items.map((item) => ({
          user_id: userId,
          product_id: item.product_id,
          quantity: item.quantity,
          updated_at: new Date(), // Track when cart was last updated
        })),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Cart saved successfully',
    });

  } catch (error) {
    /**
     * HANDLE VALIDATION ERRORS
     *
     * If Zod validation fails, return 400 Bad Request with details.
     */
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 } // Bad Request - invalid data format
      );
    }

    console.error('Error saving cart:', error);
    return NextResponse.json(
      { error: 'Failed to save cart' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart
 *
 * Clear all items from user's cart.
 *
 * Use case:
 * - After successful checkout
 * - User clicks "Clear cart" button
 * - Remove all items at once
 */
export async function DELETE(request: NextRequest) {
  try {
    /**
     * CHECK AUTHENTICATION
     */
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);

    /**
     * DELETE ALL CART ITEMS
     *
     * Remove all items from this user's cart.
     */
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
