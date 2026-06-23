import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || '30days'; // 7days, 30days, 90days, 12months

    const now = new Date();
    let startDate: Date;
    let groupBy: 'day' | 'month' = 'day';

    // Determine date range based on period
    switch (period) {
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupBy = 'day';
        break;
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        groupBy = 'day';
        break;
      case '90days':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        groupBy = 'day';
        break;
      case '12months':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        groupBy = 'month';
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        groupBy = 'day';
    }

    // Fetch all paid orders in the period
    const orders = await prisma.paymentOrder.findMany({
      where: {
        payment_status: 'paid',
        created_at: {
          gte: startDate,
        },
      },
      select: {
        order_id: true,
        total: true,
        payment_method: true,
        order_status: true,
        created_at: true,
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    // Group data by day or month
    const salesByPeriod: { [key: string]: { revenue: number; orders: number } } = {};

    orders.forEach((order) => {
      let key: string;
      if (groupBy === 'day') {
        key = order.created_at.toISOString().split('T')[0];
      } else {
        key = `${order.created_at.getFullYear()}-${String(order.created_at.getMonth() + 1).padStart(2, '0')}`;
      }

      if (!salesByPeriod[key]) {
        salesByPeriod[key] = { revenue: 0, orders: 0 };
      }

      salesByPeriod[key].revenue += Number(order.total);
      salesByPeriod[key].orders += 1;
    });

    // Convert to array and fill missing dates
    const chartData = [];
    const currentDate = new Date(startDate);

    while (currentDate <= now) {
      let key: string;
      let label: string;

      if (groupBy === 'day') {
        key = currentDate.toISOString().split('T')[0];
        label = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else {
        key = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
        label = currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }

      chartData.push({
        date: key,
        label,
        revenue: salesByPeriod[key]?.revenue || 0,
        orders: salesByPeriod[key]?.orders || 0,
      });

      if (groupBy === 'day') {
        currentDate.setDate(currentDate.getDate() + 1);
      } else {
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }

    // Calculate statistics
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Payment method breakdown
    const paymentMethodStats: { [key: string]: { count: number; revenue: number } } = {};
    orders.forEach((order) => {
      const method = order.payment_method || 'Unknown';
      if (!paymentMethodStats[method]) {
        paymentMethodStats[method] = { count: 0, revenue: 0 };
      }
      paymentMethodStats[method].count += 1;
      paymentMethodStats[method].revenue += Number(order.total);
    });

    const paymentMethodData = Object.entries(paymentMethodStats).map(([method, stats]) => ({
      method,
      count: stats.count,
      revenue: stats.revenue,
      percentage: (stats.count / totalOrders) * 100,
    }));

    // Order status breakdown
    const statusStats: { [key: string]: number } = {};
    orders.forEach((order) => {
      const status = order.order_status || 'unknown';
      statusStats[status] = (statusStats[status] || 0) + 1;
    });

    const statusData = Object.entries(statusStats).map(([status, count]) => ({
      status,
      count,
      percentage: (count / totalOrders) * 100,
    }));

    // Top selling products in this period
    const topProducts = await prisma.orderItem.groupBy({
      by: ['product_id'],
      _sum: { quantity: true, subtotal: true },
      _count: { id: true },
      where: {
        payment_order: {
          payment_status: 'paid',
          created_at: { gte: startDate },
        },
      },
      orderBy: { _sum: { subtotal: 'desc' } },
      take: 10,
    });

    const productIds = topProducts.map((p) => p.product_id);
    const products = await prisma.product.findMany({
      where: { product_id: { in: productIds } },
      select: {
        product_id: true,
        product_name: true,
        image_url: true,
        price: true,
        discount_price: true,
        category: {
          select: { category_name: true }
        }
      },
    });

    const topProductsWithDetails = topProducts.map((item) => {
      const product = products.find((p) => p.product_id === item.product_id);
      return {
        product_id: item.product_id,
        product_name: product?.product_name || 'Unknown',
        category: product?.category?.category_name || 'Uncategorized',
        quantity_sold: item._sum.quantity || 0,
        total_revenue: item._sum.subtotal || 0,
        order_count: item._count.id,
        image_url: product?.image_url,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        period,
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
        summary: {
          totalRevenue,
          totalOrders,
          averageOrderValue,
        },
        chartData,
        paymentMethodData,
        statusData,
        topProducts: topProductsWithDetails,
      },
    });
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
