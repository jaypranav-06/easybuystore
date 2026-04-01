import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/db/prisma';

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
    const { category_name, description } = body;

    const category = await prisma.category.update({
      where: { category_id: parseInt(id) },
      data: {
        category_name,
        description,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
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
    const categoryId = parseInt(id);

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { category_id: categoryId },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const productsCount = category._count.products;

    // Check if any products in this category have been ordered
    const orderedProducts = await prisma.orderItem.findFirst({
      where: {
        product: {
          category_id: categoryId,
        },
      },
    });

    if (orderedProducts) {
      return NextResponse.json(
        {
          error: `Cannot delete category "${category.category_name}" because some products have been ordered. Please deactivate the products instead.`
        },
        { status: 400 }
      );
    }

    // Get all product IDs in this category
    const products = await prisma.product.findMany({
      where: { category_id: categoryId },
      select: { product_id: true },
    });

    const productIds = products.map(p => p.product_id);

    // Delete category and all related data in a transaction
    await prisma.$transaction([
      // Delete all cart and wishlist items for products in this category
      prisma.cartItem.deleteMany({
        where: { product_id: { in: productIds } },
      }),
      // Delete all reviews for products in this category
      prisma.review.deleteMany({
        where: { product_id: { in: productIds } },
      }),
      // Delete all products in this category
      prisma.product.deleteMany({
        where: { category_id: categoryId },
      }),
      // Finally delete the category
      prisma.category.delete({
        where: { category_id: categoryId },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: `Category "${category.category_name}" and ${productsCount} product(s) deleted successfully`
    });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete category' },
      { status: 500 }
    );
  }
}
