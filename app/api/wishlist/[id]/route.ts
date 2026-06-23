import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/db/prisma';

// Remove an item from user's wishlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify user authentication
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract and parse item ID from URL params
    const { id } = await params;
    const itemId = parseInt(id);

    if (isNaN(itemId)) {
      return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 });
    }

    const userId = parseInt(session.user.id);

    // Check if item exists and belongs to user
    const item = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        user_id: userId,
        item_type: 'wishlist',
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: 'Wishlist item not found' },
        { status: 404 }
      );
    }

    // Delete the item
    await prisma.cartItem.delete({
      where: {
        id: itemId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Item removed from wishlist',
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    );
  }
}
