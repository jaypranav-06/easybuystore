import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET() {
  try {
    const orders = await prisma.paymentOrder.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: { first_name: true, last_name: true, email: true },
        },
        order_items: {
          select: { id: true },
        },
      },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
