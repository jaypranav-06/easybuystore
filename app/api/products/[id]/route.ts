import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

// GET /api/products/[id] - Get single product by ID
// Get single product details with reviews and ratings
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Extract and parse product ID from URL params
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Fetch product with category and approved reviews
    const product = await prisma.product.findUnique({
      where: {
        product_id: productId,
        is_active: true,
      },
      include: {
        category: true,
        reviews: {
          where: { is_approved: true },
          include: {
            user: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Calculate average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0;

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        average_rating: avgRating,
        review_count: product.reviews.length,
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
