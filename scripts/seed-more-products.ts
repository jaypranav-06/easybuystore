import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(' Adding more products to the catalog...');

  // Get existing categories
  const womenCategory = await prisma.category.findFirst({ where: { category_name: 'Women\'s Clothing' } });
  const menCategory = await prisma.category.findFirst({ where: { category_name: 'Men\'s Clothing' } });
  const accessoriesCategory = await prisma.category.findFirst({ where: { category_name: 'Accessories' } });
  const shoesCategory = await prisma.category.findFirst({ where: { category_name: 'Shoes' } });
  const bagsCategory = await prisma.category.findFirst({ where: { category_name: 'Bags' } });
  const jewelryCategory = await prisma.category.findFirst({ where: { category_name: 'Jewelry' } });

  // Additional Women's Products
  const moreWomenProducts = [
    {
      product_name: 'Pleated Midi Skirt',
      description: 'Elegant pleated midi skirt in navy. Perfect for office or evening wear.',
      price: 139.99,
      discount_price: null,
      category_id: womenCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800',
      stock_quantity: 35,
      is_featured: false,
      is_new: true,
      is_bestseller: false,
    },
    {
      product_name: 'Wrap Dress',
      description: 'Flattering wrap dress in burgundy silk blend. Versatile for day to night.',
      price: 179.99,
      discount_price: 159.99,
      category_id: womenCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800',
      stock_quantity: 28,
      is_featured: false,
      is_new: false,
      is_bestseller: true,
    },
    {
      product_name: 'Leather Blazer',
      description: 'Structured leather blazer in black. Modern edge meets classic tailoring.',
      price: 449.99,
      discount_price: null,
      category_id: womenCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
      stock_quantity: 15,
      is_featured: true,
      is_new: true,
      is_bestseller: false,
    },
    {
      product_name: 'Silk Camisole',
      description: 'Delicate silk camisole with lace trim. Available in blush, ivory, and black.',
      price: 89.99,
      discount_price: 74.99,
      category_id: womenCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=800',
      stock_quantity: 45,
      is_featured: false,
      is_new: true,
      is_bestseller: false,
    },
    {
      product_name: 'Tailored Blazer',
      description: 'Classic wool blazer in charcoal. Essential wardrobe piece with impeccable fit.',
      price: 329.99,
      discount_price: null,
      category_id: womenCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800',
      stock_quantity: 22,
      is_featured: false,
      is_new: false,
      is_bestseller: true,
    },
    {
      product_name: 'Pencil Skirt',
      description: 'High-waisted pencil skirt in black wool blend. Professional and sophisticated.',
      price: 119.99,
      discount_price: 99.99,
      category_id: womenCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800',
      stock_quantity: 38,
      is_featured: false,
      is_new: false,
      is_bestseller: true,
    },
    {
      product_name: 'Evening Gown',
      description: 'Floor-length evening gown in emerald green. Elegant draping and timeless silhouette.',
      price: 599.99,
      discount_price: 499.99,
      category_id: womenCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800',
      stock_quantity: 8,
      is_featured: true,
      is_new: true,
      is_bestseller: false,
    },
    {
      product_name: 'Cashmere Cardigan',
      description: 'Luxurious cashmere cardigan in dove gray. Perfect layering piece.',
      price: 249.99,
      discount_price: null,
      category_id: womenCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800',
      stock_quantity: 25,
      is_featured: false,
      is_new: false,
      is_bestseller: true,
    },
  ];

  // Additional Men's Products
  const moreMenProducts = [
    {
      product_name: 'Leather Jacket',
      description: 'Premium black leather jacket with quilted shoulders. Timeless style.',
      price: 799.99,
      discount_price: 699.99,
      category_id: menCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800',
      stock_quantity: 10,
      is_featured: true,
      is_new: true,
      is_bestseller: false,
    },
    {
      product_name: 'Chinos',
      description: 'Slim-fit chinos in khaki. Versatile and comfortable for casual or smart-casual.',
      price: 89.99,
      discount_price: null,
      category_id: menCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800',
      stock_quantity: 50,
      is_featured: false,
      is_new: false,
      is_bestseller: true,
    },
    {
      product_name: 'Polo Shirt',
      description: 'Classic pique polo in navy. Premium cotton with refined details.',
      price: 79.99,
      discount_price: 64.99,
      category_id: menCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1602810316693-3667c854239a?w=800',
      stock_quantity: 45,
      is_featured: false,
      is_new: false,
      is_bestseller: true,
    },
    {
      product_name: 'Tailored Vest',
      description: 'Wool blend vest in charcoal. Perfect for formal occasions.',
      price: 159.99,
      discount_price: null,
      category_id: menCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1593030103066-0093718efeb9?w=800',
      stock_quantity: 20,
      is_featured: false,
      is_new: true,
      is_bestseller: false,
    },
    {
      product_name: 'Denim Jeans',
      description: 'Premium dark wash denim with modern slim fit. Quality craftsmanship.',
      price: 129.99,
      discount_price: 109.99,
      category_id: menCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
      stock_quantity: 40,
      is_featured: false,
      is_new: false,
      is_bestseller: true,
    },
    {
      product_name: 'Linen Shirt',
      description: 'Breathable linen shirt in white. Perfect for summer elegance.',
      price: 99.99,
      discount_price: null,
      category_id: menCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
      stock_quantity: 32,
      is_featured: false,
      is_new: true,
      is_bestseller: false,
    },
  ];

  // Additional Accessories
  const moreAccessories = [
    {
      product_name: 'Cashmere Gloves',
      description: 'Luxurious cashmere gloves in black. Touchscreen compatible.',
      price: 79.99,
      discount_price: null,
      category_id: accessoriesCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1514819166499-a7d6e0f9d1e2?w=800',
      stock_quantity: 40,
      is_featured: false,
      is_new: true,
      is_bestseller: false,
    },
    {
      product_name: 'Designer Sunglasses',
      description: 'Classic aviator sunglasses with UV protection. Timeless style.',
      price: 249.99,
      discount_price: 199.99,
      category_id: accessoriesCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800',
      stock_quantity: 25,
      is_featured: true,
      is_new: false,
      is_bestseller: true,
    },
    {
      product_name: 'Wool Hat',
      description: 'Classic fedora hat in charcoal wool. Sophisticated finishing touch.',
      price: 89.99,
      discount_price: null,
      category_id: accessoriesCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=800',
      stock_quantity: 30,
      is_featured: false,
      is_new: true,
      is_bestseller: false,
    },
    {
      product_name: 'Leather Wallet',
      description: 'Slim leather bifold wallet in brown. RFID protected.',
      price: 119.99,
      discount_price: 99.99,
      category_id: accessoriesCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800',
      stock_quantity: 55,
      is_featured: false,
      is_new: false,
      is_bestseller: true,
    },
  ];

  // Additional Shoes
  const moreShoes = [
    {
      product_name: 'Ankle Boots',
      description: 'Elegant black leather ankle boots with block heel. Versatile and comfortable.',
      price: 279.99,
      discount_price: null,
      category_id: shoesCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800',
      stock_quantity: 22,
      is_featured: false,
      is_new: true,
      is_bestseller: false,
    },
    {
      product_name: 'Loafers',
      description: 'Classic penny loafers in cognac leather. Timeless sophistication.',
      price: 199.99,
      discount_price: 179.99,
      category_id: shoesCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800',
      stock_quantity: 28,
      is_featured: false,
      is_new: false,
      is_bestseller: true,
    },
    {
      product_name: 'Sneakers',
      description: 'Premium white leather sneakers. Modern minimalist design.',
      price: 189.99,
      discount_price: null,
      category_id: shoesCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800',
      stock_quantity: 35,
      is_featured: true,
      is_new: true,
      is_bestseller: false,
    },
    {
      product_name: 'Heeled Sandals',
      description: 'Strappy heeled sandals in nude. Perfect for formal occasions.',
      price: 169.99,
      discount_price: 149.99,
      category_id: shoesCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800',
      stock_quantity: 20,
      is_featured: false,
      is_new: false,
      is_bestseller: true,
    },
  ];

  // Additional Bags
  const moreBags = [
    {
      product_name: 'Weekender Bag',
      description: 'Spacious canvas and leather weekender. Perfect for short trips.',
      price: 299.99,
      discount_price: null,
      category_id: bagsCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
      stock_quantity: 15,
      is_featured: false,
      is_new: true,
      is_bestseller: false,
    },
    {
      product_name: 'Clutch Bag',
      description: 'Elegant leather clutch with gold hardware. Perfect for evening events.',
      price: 179.99,
      discount_price: 159.99,
      category_id: bagsCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800',
      stock_quantity: 25,
      is_featured: false,
      is_new: false,
      is_bestseller: true,
    },
    {
      product_name: 'Backpack',
      description: 'Leather laptop backpack in black. Professional and practical.',
      price: 329.99,
      discount_price: null,
      category_id: bagsCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
      stock_quantity: 18,
      is_featured: true,
      is_new: true,
      is_bestseller: false,
    },
    {
      product_name: 'Shoulder Bag',
      description: 'Medium leather shoulder bag in tan. Classic and versatile.',
      price: 279.99,
      discount_price: 249.99,
      category_id: bagsCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800',
      stock_quantity: 22,
      is_featured: false,
      is_new: false,
      is_bestseller: true,
    },
  ];

  // Additional Jewelry
  const moreJewelry = [
    {
      product_name: 'Silver Bracelet',
      description: 'Sterling silver chain bracelet. Delicate and elegant.',
      price: 149.99,
      discount_price: null,
      category_id: jewelryCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
      stock_quantity: 30,
      is_featured: false,
      is_new: true,
      is_bestseller: false,
    },
    {
      product_name: 'Gold Ring',
      description: '14K gold band with diamond detail. Timeless elegance.',
      price: 399.99,
      discount_price: 349.99,
      category_id: jewelryCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
      stock_quantity: 15,
      is_featured: true,
      is_new: false,
      is_bestseller: true,
    },
    {
      product_name: 'Pendant Necklace',
      description: 'Gold pendant necklace with gemstone. Sophisticated charm.',
      price: 279.99,
      discount_price: null,
      category_id: jewelryCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
      stock_quantity: 20,
      is_featured: false,
      is_new: true,
      is_bestseller: false,
    },
    {
      product_name: 'Hoop Earrings',
      description: 'Classic gold hoop earrings. Versatile and timeless.',
      price: 159.99,
      discount_price: 139.99,
      category_id: jewelryCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
      stock_quantity: 40,
      is_featured: false,
      is_new: false,
      is_bestseller: true,
    },
    {
      product_name: 'Watch',
      description: 'Luxury leather strap watch with rose gold case. Precision timepiece.',
      price: 899.99,
      discount_price: 799.99,
      category_id: jewelryCategory?.category_id,
      image_url: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800',
      stock_quantity: 12,
      is_featured: true,
      is_new: true,
      is_bestseller: false,
    },
  ];

  const allNewProducts = [
    ...moreWomenProducts,
    ...moreMenProducts,
    ...moreAccessories,
    ...moreShoes,
    ...moreBags,
    ...moreJewelry,
  ];

  console.log(' Creating additional products...');
  for (const product of allNewProducts) {
    await prisma.product.create({
      data: product,
    });
    console.log(` Created: ${product.product_name}`);
  }

  console.log('\n Successfully added more products!');
  console.log(` Total new products added: ${allNewProducts.length}`);

  // Get total count
  const totalProducts = await prisma.product.count();
  console.log(` Total products in database: ${totalProducts}`);
}

main()
  .catch((e) => {
    console.error(' Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
