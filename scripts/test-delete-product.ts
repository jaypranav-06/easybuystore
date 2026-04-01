import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testProductDeletion() {
  try {
    // Get a product to test
    const product = await prisma.product.findFirst({
      select: {
        product_id: true,
        product_name: true,
      },
    });

    if (!product) {
      console.log('No products found');
      return;
    }

    console.log(`\nTesting deletion for: ${product.product_name} (ID: ${product.product_id})`);

    // Check if product has orders
    const orderItems = await prisma.orderItem.findFirst({
      where: { product_id: product.product_id },
    });

    console.log(`Has orders: ${orderItems ? 'YES' : 'NO'}`);

    if (orderItems) {
      console.log('❌ Cannot delete - product has been ordered');
      console.log('Recommendation: Deactivate the product instead');
    } else {
      console.log('✅ Can be deleted - no orders found');
    }

    // Check other dependencies
    const cartItems = await prisma.cartItem.count({
      where: { product_id: product.product_id },
    });

    const reviews = await prisma.review.count({
      where: { product_id: product.product_id },
    });

    console.log(`\nDependencies:`);
    console.log(`  - Cart/Wishlist items: ${cartItems}`);
    console.log(`  - Reviews: ${reviews}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testProductDeletion();
