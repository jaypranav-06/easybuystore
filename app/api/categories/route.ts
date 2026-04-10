/**
 * CATEGORIES API ENDPOINT
 *
 * This API fetches all product categories from the Supabase database.
 * URL: /api/categories
 * Method: GET
 *
 * Key Concepts for VIVA:
 * - Categories organize products (like "Clothing", "Electronics", "Shoes")
 * - Used in navigation menus and product filtering
 * - Only active categories are shown to customers
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

/**
 * GET /api/categories
 *
 * Fetch all active categories for display in:
 * - Navigation menu
 * - Product filters
 * - Category selection dropdowns
 *
 * Returns: Array of categories sorted alphabetically
 */
export async function GET() {
  try {
    /**
     * FETCH CATEGORIES FROM DATABASE
     *
     * Query explanation:
     * - where: Only get active categories (is_active = true)
     * - orderBy: Sort alphabetically by category name
     * - select: Only fetch specific fields we need (not all columns)
     */
    const categories = await prisma.category.findMany({
      where: {
        is_active: true, // Only show active/visible categories
      },
      orderBy: {
        category_name: 'asc', // Sort A to Z (ascending order)
      },
      select: {
        category_id: true,      // Unique ID for filtering
        category_name: true,    // Display name (e.g., "Clothing")
        description: true,      // Category description
      },
    });

    /**
     * RETURN SUCCESS RESPONSE
     *
     * Send JSON with:
     * - success: true (indicates API call worked)
     * - categories: Array of category objects
     */
    return NextResponse.json({ success: true, categories });

  } catch (error) {
    /**
     * ERROR HANDLING
     *
     * If database query fails, log error and return 500 status.
     * This prevents app from crashing if database is down.
     */
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 } // Internal Server Error
    );
  }
}
