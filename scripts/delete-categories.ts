/**
 * Script to delete specific categories and all related data
 * This will delete:
 * - Categories: "bandasf" and "crop top"
 * - All products in these categories
 * - All orders containing these products
 * - All order items for these products
 * - All cart items for these products
 * - All reviews for these products
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteCategoriesAndRelatedData() {
  try {
    console.log('🔍 Starting cleanup process...\n');

    // Step 1: Find categories
    const categoriesToDelete = ['hear bandasf'];
    console.log(`📋 Looking for categories containing: ${categoriesToDelete.join(', ')}`);

    const categories = await prisma.category.findMany({
      where: {
        OR: categoriesToDelete.map(name => ({
          category_name: {
            contains: name,
            mode: 'insensitive', // Case-insensitive search
          },
        })),
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (categories.length === 0) {
      console.log('❌ No matching categories found.');
      return;
    }

    console.log(`\n✅ Found ${categories.length} categories:`);
    categories.forEach((cat) => {
      console.log(`   - ${cat.category_name} (ID: ${cat.category_id}, Products: ${cat._count.products})`);
    });

    const categoryIds = categories.map((c) => c.category_id);

    // Step 2: Find all products in these categories
    const productsByCategory = await prisma.product.findMany({
      where: { category_id: { in: categoryIds } },
      select: { product_id: true, product_name: true, category_id: true },
    });

    // Also find products with "crop top" in name
    const productsWithCropTop = await prisma.product.findMany({
      where: {
        product_name: {
          contains: 'crop top',
          mode: 'insensitive',
        },
      },
      select: { product_id: true, product_name: true, category_id: true },
    });

    // Combine and deduplicate products
    const allProducts = [...productsByCategory, ...productsWithCropTop];
    const uniqueProducts = Array.from(
      new Map(allProducts.map(p => [p.product_id, p])).values()
    );

    console.log(`\n📦 Found ${productsByCategory.length} products in categories`);
    console.log(`📦 Found ${productsWithCropTop.length} products with "crop top" in name`);
    console.log(`📦 Total unique products to delete: ${uniqueProducts.length}`);

    const productIds = uniqueProducts.map((p) => p.product_id);

    if (productIds.length === 0) {
      console.log('   No products to delete, proceeding to delete categories only...');
    } else {
      uniqueProducts.forEach((p) => {
        console.log(`   - ${p.product_name} (ID: ${p.product_id})`);
      });

      // Step 3: Find all orders containing these products
      const orderItems = await prisma.orderItem.findMany({
        where: { product_id: { in: productIds } },
        select: { order_id: true },
        distinct: ['order_id'],
      });

      const orderIds = orderItems.map((oi) => oi.order_id);
      console.log(`\n📋 Found ${orderIds.length} orders containing these products`);

      // Step 4: Get order details before deletion
      if (orderIds.length > 0) {
        const orders = await prisma.paymentOrder.findMany({
          where: { order_id: { in: orderIds } },
          select: { order_id: true, order_number: true, order_status: true },
        });

        orders.forEach((o) => {
          console.log(`   - Order #${o.order_number} (ID: ${o.order_id}, Status: ${o.order_status})`);
        });
      }

      // Step 5: Delete everything in a transaction
      console.log('\n🗑️  Starting deletion process...\n');

      const result = await prisma.$transaction(async (tx) => {
        let stats = {
          orderItems: 0,
          orders: 0,
          cartItems: 0,
          reviews: 0,
          products: 0,
          categories: 0,
        };

        // Delete order items for these products
        if (productIds.length > 0) {
          const deletedOrderItems = await tx.orderItem.deleteMany({
            where: { product_id: { in: productIds } },
          });
          stats.orderItems = deletedOrderItems.count;
          console.log(`   ✓ Deleted ${stats.orderItems} order items`);

          // Delete orders that now have no items
          if (orderIds.length > 0) {
            const deletedOrders = await tx.paymentOrder.deleteMany({
              where: { order_id: { in: orderIds } },
            });
            stats.orders = deletedOrders.count;
            console.log(`   ✓ Deleted ${stats.orders} orders`);
          }

          // Delete cart items (includes wishlist)
          const deletedCartItems = await tx.cartItem.deleteMany({
            where: { product_id: { in: productIds } },
          });
          stats.cartItems = deletedCartItems.count;
          console.log(`   ✓ Deleted ${stats.cartItems} cart/wishlist items`);

          // Delete reviews
          const deletedReviews = await tx.review.deleteMany({
            where: { product_id: { in: productIds } },
          });
          stats.reviews = deletedReviews.count;
          console.log(`   ✓ Deleted ${stats.reviews} reviews`);

          // Delete products
          const deletedProducts = await tx.product.deleteMany({
            where: { product_id: { in: productIds } },
          });
          stats.products = deletedProducts.count;
          console.log(`   ✓ Deleted ${stats.products} products`);
        }

        // Delete categories
        const deletedCategories = await tx.category.deleteMany({
          where: { category_id: { in: categoryIds } },
        });
        stats.categories = deletedCategories.count;
        console.log(`   ✓ Deleted ${stats.categories} categories`);

        return stats;
      });

      // Summary
      console.log('\n' + '='.repeat(60));
      console.log('✅ CLEANUP COMPLETED SUCCESSFULLY');
      console.log('='.repeat(60));
      console.log(`📊 Summary:`);
      console.log(`   - Orders deleted: ${result.orders}`);
      console.log(`   - Order items deleted: ${result.orderItems}`);
      console.log(`   - Products deleted: ${result.products}`);
      console.log(`   - Cart/Wishlist items deleted: ${result.cartItems}`);
      console.log(`   - Reviews deleted: ${result.reviews}`);
      console.log(`   - Categories deleted: ${result.categories}`);
      console.log('='.repeat(60));
    }
  } catch (error) {
    console.error('\n❌ ERROR during cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
deleteCategoriesAndRelatedData()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
