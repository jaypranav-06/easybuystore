import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/db/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { product_id: parseInt(id) },
      include: {
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      product_name,
      description,
      price,
      discount_price,
      stock_quantity,
      category_id,
      image_url,
      is_active,
      is_featured,
    } = body;

    // Debug logging
    console.log('Update product - Received stock_quantity:', stock_quantity);
    console.log('Update product - Parsed stock_quantity:', parseInt(stock_quantity));

    const updateData: any = {
      product_name,
      description,
      is_active,
      is_featured,
    };

    if (price) updateData.price = parseFloat(price);
    if (discount_price) updateData.discount_price = parseFloat(discount_price);
    else updateData.discount_price = null;

    if (stock_quantity !== undefined && stock_quantity !== '') {
      updateData.stock_quantity = parseInt(stock_quantity);
    }

    if (category_id) updateData.category_id = parseInt(category_id);
    if (image_url !== undefined) updateData.image_url = image_url;

    console.log('Update product - Final updateData:', updateData);

    const product = await prisma.product.update({
      where: { product_id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const productId = parseInt(id);

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { product_id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if product is referenced in orders
    const orderItems = await prisma.orderItem.findFirst({
      where: { product_id: productId },
    });

    if (orderItems) {
      return NextResponse.json(
        { error: 'Cannot delete product that has been ordered. Consider deactivating it instead.' },
        { status: 400 }
      );
    }

    // Delete related records first
    await prisma.$transaction([
      // Delete from cart items (includes both cart and wishlist items)
      prisma.cartItem.deleteMany({
        where: { product_id: productId },
      }),
      // Delete reviews
      prisma.review.deleteMany({
        where: { product_id: productId },
      }),
      // Finally delete the product
      prisma.product.delete({
        where: { product_id: productId },
      }),
    ]);

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}
