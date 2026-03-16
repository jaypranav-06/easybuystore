import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { auth } from '@/lib/auth/auth';

export async function POST(request: NextRequest) {
  try {
    // Get the session using NextAuth
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be logged in to submit a review' },
        { status: 401 }
      );
    }

    // Check if user is an admin (admins shouldn't submit reviews as customers)
    if (session.user.role === 'admin') {
      return NextResponse.json(
        { error: 'Admin users cannot submit product reviews' },
        { status: 403 }
      );
    }

    // Get the user from the database
    const user = await prisma.user.findFirst({
      where: { email: session.user.email || '' },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { productId, rating, title, comment, images } = body;

    // Validate input
    if (!productId || typeof productId !== 'number') {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { product_id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if user has already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        product_id: productId,
        user_id: user.user_id,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Check if user has purchased this product (verified purchase)
    // Include both paid orders and completed COD orders
    const purchasedProduct = await prisma.orderItem.findFirst({
      where: {
        product_id: productId,
        payment_order: {
          user_id: user.user_id,
          OR: [
            { payment_status: 'paid' }, // Paid orders (PayPal, etc.)
            {
              payment_method: 'cod',
              order_status: 'completed' // Completed COD orders
            }
          ],
        },
      },
    });

    const isVerifiedPurchase = !!purchasedProduct;

    // Create the review
    const review = await prisma.review.create({
      data: {
        product_id: productId,
        user_id: user.user_id,
        rating,
        title: title || null,
        comment: comment || null,
        images: images || [],
        is_approved: false, // Reviews need admin approval
        is_verified_purchase: isVerifiedPurchase,
      },
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Review submitted successfully. It will appear after admin approval.',
        review,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch reviews for a product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: {
        product_id: parseInt(productId),
        is_approved: true,
      },
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
    });

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
