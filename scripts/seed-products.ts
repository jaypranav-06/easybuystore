import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(' Starting to seed products...');

  // First, let's create some categories
  const categories = [
    {
      category_name: 'Women\'s Clothing',
      description: 'Elegant fashion for women',
      image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
    },
    {
      category_name: 'Men\'s Clothing',
      description: 'Sophisticated style for men',
      image_url: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400',
    },
    {
      category_name: 'Accessories',
      description: 'Complete your look with premium accessories',
      image_url: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400',
    },
    {
      category_name: 'Shoes',
      description: 'Step into elegance',
      image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400',
    },
    {
      category_name: 'Bags',
      description: 'Luxury handbags and accessories',
      image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
    },
    {
      category_name: 'Jewelry',
      description: 'Timeless elegance in every piece',
      image_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
    },
  ];

  console.log(' Creating categories...');
  for (const category of categories) {
    const existing = await prisma.category.findFirst({
      where: { category_name: category.category_name }
    });

    if (!existing) {
      await prisma.category.create({
        data: category,
      });
      console.log(` Created category: ${category.category_name}`);
    } else {
      console.log(`⏭  Category already exists: ${category.category_name}`);
    }
  }

  // Get created categories
  const womenCategory = await prisma.category.findFirst({ where: { category_name: 'Women\'s Clothing' } });
  const menCategory = await prisma.category.findFirst({ where: { category_name: 'Men\'s Clothing' } });
  const accessoriesCategory = await prisma.category.findFirst({ where: { category_name: 'Accessories' } });
  const shoesCategory = await prisma.category.findFirst({ where: { category_name: 'Shoes' } });
  const bagsCategory = await prisma.category.findFirst({ where: { category_name: 'Bags' } });
  const jewelryCategory = await prisma.category.findFirst({ where: { category_name: 'Jewelry' } });

  // Women's Products
  const womenProducts = [
    {
      product_name: 'Elegant Silk Maxi Dress',
      description: 'Luxurious silk maxi dress perfect for evening events. Features a flowing silhouette and delicate draping.',
      price: 299.99,
      discount_price: 249.99,
      category_id: womenCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
      stock_quantity: 25,
      is_featured: true,
      is_new: true,
      is_bestseller: false,
    },
    {
      product_name: 'Classic Trench Coat',
      description: 'Timeless beige trench coat with belt. Water-resistant fabric and elegant cut.',
      price: 399.99,
      discount_price: null,
      category_id: womenCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800',
      stock_quantity: 18,
      is_featured: true,
      is_new: false,
      is_bestseller: true,
    },
    {
      product_name: 'Cashmere Sweater',
      description: 'Ultra-soft 100% cashmere sweater in classic camel. Perfect for layering.',
      price: 189.99,
      discount_price: 149.99,
      category_id: womenCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800',
      stock_quantity: 30,
      is_featured: false,
      is_new: true,
      is_bestseller: true,
    },
    {
      product_name: 'High-Waisted Wide Leg Pants',
      description: 'Tailored wide-leg pants with a flattering high waist. Professional and chic.',
      price: 129.99,
      discount_price: null,
      category_id: womenCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800',
      stock_quantity: 40,
      is_featured: false,
      is_new: false,
      is_bestseller: true,
    },
    {
      product_name: 'Satin Blouse',
      description: 'Luxurious satin blouse with bow detail. Available in ivory and black.',
      price: 89.99,
      discount_price: 69.99,
      category_id: womenCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1564257577-7fd7d28c68b7?w=800',
      stock_quantity: 35,
      is_featured: false,
      is_new: true,
      is_bestseller: false,
    },
  ];

  // Men's Products
  const menProducts = [
    {
      product_name: 'Premium Wool Suit',
      description: 'Italian wool suit with modern slim fit. Includes jacket and trousers.',
      price: 899.99,
      discount_price: null,
      category_id: menCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=800',
      stock_quantity: 15,
      is_featured: true,
      is_new: false,
      is_bestseller: true,
    },
    {
      product_name: 'Cashmere Overcoat',
      description: 'Sophisticated charcoal cashmere overcoat. Perfect for business and formal occasions.',
      price: 699.99,
      discount_price: 599.99,
      category_id: menCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800',
      stock_quantity: 12,
      is_featured: true,
      is_new: true,
      is_bestseller: false,
    },
    {
      product_name: 'Oxford Dress Shirt',
      description: 'Classic white Oxford cotton dress shirt. Wrinkle-resistant and breathable.',
      price: 79.99,
      discount_price: null,
      category_id: menCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800',
      stock_quantity: 50,
      is_featured: false,
      is_new: false,
      is_bestseller: true,
    },
    {
      product_name: 'Merino Wool Sweater',
      description: 'V-neck merino wool sweater in navy. Lightweight and elegant.',
      price: 149.99,
      discount_price: 119.99,
      category_id: menCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800',
      stock_quantity: 28,
      is_featured: false,
      is_new: true,
      is_bestseller: false,
    },
  ];

  // Accessories
  const accessoriesProducts = [
    {
      product_name: 'Silk Scarf',
      description: 'Hand-rolled silk scarf with elegant paisley pattern. Versatile styling.',
      price: 89.99,
      discount_price: null,
      category_id: accessoriesCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800',
      stock_quantity: 45,
      is_featured: false,
      is_new: true,
      is_bestseller: false,
    },
    {
      product_name: 'Leather Belt',
      description: 'Premium Italian leather belt with gold buckle. Classic and timeless.',
      price: 129.99,
      discount_price: 99.99,
      category_id: accessoriesCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1624222247344-550fb60583e2?w=800',
      stock_quantity: 60,
      is_featured: false,
      is_new: false,
      is_bestseller: true,
    },
  ];

  // Shoes
  const shoesProducts = [
    {
      product_name: 'Classic Leather Pumps',
      description: 'Elegant black leather pumps with 3-inch heel. Comfortable and sophisticated.',
      price: 229.99,
      discount_price: null,
      category_id: shoesCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800',
      stock_quantity: 32,
      is_featured: true,
      is_new: false,
      is_bestseller: true,
    },
    {
      product_name: 'Oxford Leather Shoes',
      description: 'Handcrafted men\'s Oxford shoes in brown leather. Perfect for formal wear.',
      price: 299.99,
      discount_price: 249.99,
      category_id: shoesCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800',
      stock_quantity: 24,
      is_featured: true,
      is_new: true,
      is_bestseller: false,
    },
  ];

  // Bags
  const bagsProducts = [
    {
      product_name: 'Leather Tote Bag',
      description: 'Spacious leather tote in camel. Perfect for work and travel.',
      price: 349.99,
      discount_price: null,
      category_id: bagsCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
      stock_quantity: 20,
      is_featured: true,
      is_new: false,
      is_bestseller: true,
    },
    {
      product_name: 'Classic Crossbody Bag',
      description: 'Elegant black leather crossbody with gold chain. Versatile and chic.',
      price: 249.99,
      discount_price: 199.99,
      category_id: bagsCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800',
      stock_quantity: 28,
      is_featured: false,
      is_new: true,
      is_bestseller: false,
    },
  ];

  // Jewelry
  const jewelryProducts = [
    {
      product_name: 'Gold Pearl Necklace',
      description: 'Delicate gold chain with freshwater pearl pendant. Timeless elegance.',
      price: 199.99,
      discount_price: null,
      category_id: jewelryCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
      stock_quantity: 35,
      is_featured: false,
      is_new: true,
      is_bestseller: false,
    },
    {
      product_name: 'Diamond Stud Earrings',
      description: '14K white gold diamond stud earrings. Classic and sophisticated.',
      price: 599.99,
      discount_price: 499.99,
      category_id: jewelryCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
      stock_quantity: 18,
      is_featured: true,
      is_new: false,
      is_bestseller: true,
    },
  ];

  const allProducts = [
    ...womenProducts,
    ...menProducts,
    ...accessoriesProducts,
    ...shoesProducts,
    ...bagsProducts,
    ...jewelryProducts,
  ];

  console.log(' Creating products...');
  for (const product of allProducts) {
    await prisma.product.create({
      data: product,
    });
    console.log(` Created: ${product.product_name}`);
  }

  console.log('\n Successfully seeded database with products!');
  console.log(` Total categories: ${categories.length}`);
  console.log(` Total products: ${allProducts.length}`);
}

main()
  .catch((e) => {
    console.error(' Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
