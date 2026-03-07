import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

// GET /api/products - Get all products with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const newArrivals = searchParams.get('new');
    const bestseller = searchParams.get('bestseller');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page');

    const where: any = {
      is_active: true,
    };

    // Add filters
    if (category) {
      where.category_id = parseInt(category);
    }

    if (featured === 'true') {
      where.is_featured = true;
    }

    if (newArrivals === 'true') {
      where.is_new = true;
    }

    if (bestseller === 'true') {
      where.is_bestseller = true;
    }

    if (search) {
      where.OR = [
        { product_name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    // Pagination
    const take = limit ? parseInt(limit) : undefined;
    const skip = page && limit ? (parseInt(page) - 1) * parseInt(limit) : undefined;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          reviews: {
            where: { is_approved: true },
            select: {
              rating: true,
            },
          },
        },
        take,
        skip,
        orderBy: {
          created_at: 'desc',
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Calculate average rating for each product
    const productsWithRating = products.map((product) => {
      const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0;

      return {
        ...product,
        average_rating: avgRating,
        review_count: product.reviews.length,
        reviews: undefined, // Remove reviews array from response
      };
    });

    return NextResponse.json({
      success: true,
      products: productsWithRating,
      total,
      page: page ? parseInt(page) : 1,
      limit: take || total,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
