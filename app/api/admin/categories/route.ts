import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/db/prisma';

// Get all categories with product counts
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all categories with product counts
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: {
        category_name: 'asc',
      },
    });

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// Create a new category
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { category_name, description } = body;

    if (!category_name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Create new category in database
    const category = await prisma.category.create({
      data: {
        category_name,
        description,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
