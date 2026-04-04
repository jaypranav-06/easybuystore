import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            category_name: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      product_name,
      description,
      keywords,
      price,
      discount_price,
      stock_quantity,
      category_id,
      image_url,
      available_sizes,
      is_active,
      is_featured,
    } = body;

    // Validate required fields
    if (!product_name || !price || !category_id) {
      return NextResponse.json(
        { error: 'Product name, price, and category are required' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        product_name,
        description,
        keywords,
        price: parseFloat(price),
        discount_price: discount_price ? parseFloat(discount_price) : null,
        stock_quantity: parseInt(stock_quantity) || 0,
        category_id: parseInt(category_id),
        image_url,
        available_sizes: available_sizes || [],
        is_active: is_active !== undefined ? is_active : true,
        is_featured: is_featured !== undefined ? is_featured : false,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
