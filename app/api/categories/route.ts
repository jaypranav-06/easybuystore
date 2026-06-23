// GET /api/categories - Fetch all active categories for navigation and filtering

import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET() {
  try {
    // Fetch active categories sorted alphabetically
    const categories = await prisma.category.findMany({
      where: {
        is_active: true, // Only active categories
      },
      orderBy: {
        category_name: 'asc', // Sort A-Z
      },
      select: {
        category_id: true,
        category_name: true,
        description: true,
      },
    });

    // Return success response
    return NextResponse.json({ success: true, categories });

  } catch (error) {
    // Handle database errors
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
