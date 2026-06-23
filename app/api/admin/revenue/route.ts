import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    // month = "2026-06" to filter a specific month, or "all" for all months
    const month = searchParams.get('month') || 'all';

    const now = new Date();
    // Always load last 12 months of data
    const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);

    const orders = await prisma.paymentOrder.findMany({
      where: {
        payment_status: 'paid',
        created_at: { gte: twelveMonthsAgo },
      },
      select: {
        total: true,
        created_at: true,
      },
      orderBy: { created_at: 'asc' },
    });

    // Group into months
    const monthMap: Record<string, { key: string; label: string; revenue: number; orders: number }> = {};

    const cursor = new Date(twelveMonthsAgo);
    while (cursor <= now) {
      const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`;
      const label = cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      monthMap[key] = { key, label, revenue: 0, orders: 0 };
      cursor.setMonth(cursor.getMonth() + 1);
    }

    orders.forEach((o) => {
      const key = `${o.created_at.getFullYear()}-${String(o.created_at.getMonth() + 1).padStart(2, '0')}`;
      if (monthMap[key]) {
        monthMap[key].revenue += Number(o.total);
        monthMap[key].orders += 1;
      }
    });

    const allMonths = Object.values(monthMap).reverse(); // newest first

    // Filter to selected month if provided
    const filtered = month === 'all' ? allMonths : allMonths.filter((m) => m.key === month);

    const totalRevenue = filtered.reduce((s, m) => s + m.revenue, 0);
    const totalOrders = filtered.reduce((s, m) => s + m.orders, 0);

    // Compare to same period one year prior
    const prevMonths = month === 'all'
      ? [] // not needed for "all"
      : (() => {
          const [y, mo] = month.split('-').map(Number);
          const prevKey = `${mo === 1 ? y - 1 : y}-${String(mo === 1 ? 12 : mo - 1).padStart(2, '0')}`;
          return allMonths.filter((m) => m.key === prevKey);
        })();

    const prevRevenue = prevMonths.reduce((s, m) => s + m.revenue, 0);
    const changePercent =
      month === 'all' || prevRevenue === 0
        ? null
        : ((totalRevenue - prevRevenue) / prevRevenue) * 100;

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        changePercent,
        months: allMonths,    // full list for the dropdown
        rows: filtered,       // table rows
      },
    });
  } catch (error: any) {
    console.error('Revenue API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch revenue' },
      { status: 500 }
    );
  }
}
