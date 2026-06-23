import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { category_name: 'asc' },
    });

    console.log('\n📋 All Categories in Database:\n');
    console.log('='.repeat(80));

    if (categories.length === 0) {
      console.log('❌ No categories found in database');
    } else {
      categories.forEach((cat, index) => {
        console.log(`${index + 1}. ${cat.category_name}`);
        console.log(`   ID: ${cat.category_id}`);
        console.log(`   Products: ${cat._count.products}`);
        console.log(`   Active: ${cat.is_active ? 'Yes' : 'No'}`);
        console.log('   ' + '-'.repeat(76));
      });
    }

    console.log('='.repeat(80));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listCategories();
