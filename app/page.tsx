import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/db/prisma';
import { ShoppingBag } from 'lucide-react';
import ProductCardClient from '@/components/customer/ProductCardClient';
import HomeSearchBar from '@/components/customer/HomeSearchBar';

async function getHomePageData() {
  const [featuredProducts, newArrivals, bestsellers, categories] = await Promise.all([
    // Featured Products
    prisma.product.findMany({
      where: {
        is_featured: true,
        is_active: true,
        stock_quantity: { gt: 0 },
      },
      include: {
        category: true,
      },
      take: 8,
      orderBy: { created_at: 'desc' },
    }),
    // New Arrivals
    prisma.product.findMany({
      where: {
        is_new: true,
        is_active: true,
        stock_quantity: { gt: 0 },
      },
      include: {
        category: true,
      },
      take: 8,
      orderBy: { created_at: 'desc' },
    }),
    // Bestsellers
    prisma.product.findMany({
      where: {
        is_bestseller: true,
        is_active: true,
        stock_quantity: { gt: 0 },
      },
      include: {
        category: true,
      },
      take: 8,
      orderBy: { created_at: 'desc' },
    }),
    // Categories
    prisma.category.findMany({
      where: { is_active: true },
      take: 6,
      orderBy: { created_at: 'desc' },
    }),
  ]);

  // Serialize Decimal to number for client components
  const serializeProduct = (product: any) => ({
    ...product,
    price: Number(product.price),
    discount_price: product.discount_price ? Number(product.discount_price) : null,
  });

  return {
    featuredProducts: featuredProducts.map(serializeProduct),
    newArrivals: newArrivals.map(serializeProduct),
    bestsellers: bestsellers.map(serializeProduct),
    categories,
  };
}

export default async function HomePage() {
  const { featuredProducts, newArrivals, bestsellers, categories } = await getHomePageData();

  return (
    <div className="bg-white">
      {/* Hero Section - Luxurious Design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2C2C2C] via-[#3A3A3A] to-[#2C2C2C]">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
        <div className="container-custom relative">
          <div className="grid md:grid-cols-2 gap-12 items-center min-h-[600px] py-16 md:py-0">
            <div className="text-white space-y-6 animate-fade-in">
              <div className="inline-block">
                <span className="text-accent text-sm font-medium tracking-[0.3em] uppercase">
                  New Collection 2026
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Elegance in
                <span className="block gradient-text">Every Thread</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-lg leading-relaxed">
                Discover timeless fashion pieces crafted with precision and passion. Elevate your wardrobe with our exclusive collection.
              </p>

              {/* Search Bar */}
              <div className="pt-4">
                <HomeSearchBar />
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/products" className="btn-accent">
                  Explore Collection
                </Link>
                <Link href="/categories" className="btn-outline !border-white !text-white hover:!bg-white hover:!text-primary">
                  Shop by Category
                </Link>
              </div>
              <div className="flex gap-8 pt-6 text-sm">
                <div>
                  <div className="text-accent text-2xl font-bold">500+</div>
                  <div className="text-gray-400">Premium Products</div>
                </div>
                <div>
                  <div className="text-accent text-2xl font-bold">50K+</div>
                  <div className="text-gray-400">Happy Customers</div>
                </div>
                <div>
                  <div className="text-accent text-2xl font-bold">24/7</div>
                  <div className="text-gray-400">Customer Support</div>
                </div>
              </div>
            </div>
            <div className="relative hidden md:block animate-scale-in">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
              <div className="relative aspect-square max-w-md ml-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-transparent rounded-full blur-2xl"></div>
                <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-accent/20 to-transparent flex items-center justify-center">
                    <ShoppingBag className="w-32 h-32 text-accent/60" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="section-padding bg-surface">
          <div className="container-custom">
            <div className="text-center mb-12 space-y-2">
              <span className="text-accent text-sm font-medium tracking-[0.3em] uppercase">
                Collections
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-primary">
                Shop by Category
              </h2>
              <p className="text-text-secondary mt-4 max-w-2xl mx-auto">
                Explore our carefully curated collections designed to complement your lifestyle
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {categories.map((category) => (
                <Link
                  key={category.category_id}
                  href={`/products?category=${category.category_id}`}
                  className="group"
                >
                  <div className="card p-6 text-center transform transition-all duration-300 hover:scale-105 border border-transparent hover:border-accent/20">
                    {category.image_url && (
                      <div className="mb-4 relative h-24 w-24 mx-auto overflow-hidden rounded-full bg-white shadow-md">
                        <Image
                          src={category.image_url}
                          alt={category.category_name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <h3 className="font-semibold text-primary group-hover:text-accent transition-colors duration-300">
                      {category.category_name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
              <div>
                <span className="text-accent text-sm font-medium tracking-[0.3em] uppercase block mb-2">
                  Handpicked
                </span>
                <h2 className="text-4xl font-bold text-primary">Featured Products</h2>
              </div>
              <Link href="/products?featured=true" className="text-accent hover:text-accent-light transition-colors font-medium flex items-center gap-2">
                View All Collection →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCardClient key={product.product_id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="section-padding bg-surface">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
              <div>
                <span className="text-accent text-sm font-medium tracking-[0.3em] uppercase block mb-2">
                  Just In
                </span>
                <h2 className="text-4xl font-bold text-primary">New Arrivals</h2>
              </div>
              <Link href="/products?new=true" className="text-accent hover:text-accent-light transition-colors font-medium flex items-center gap-2">
                Explore Latest →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCardClient key={product.product_id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bestsellers */}
      {bestsellers.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
              <div>
                <span className="text-accent text-sm font-medium tracking-[0.3em] uppercase block mb-2">
                  Customer Favorites
                </span>
                <h2 className="text-4xl font-bold text-primary">Bestsellers</h2>
              </div>
              <Link href="/products?bestseller=true" className="text-accent hover:text-accent-light transition-colors font-medium flex items-center gap-2">
                Shop Bestsellers →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestsellers.map((product) => (
                <ProductCardClient key={product.product_id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary via-primary-light to-primary text-white section-padding">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
        <div className="container-custom relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="text-accent text-sm font-medium tracking-[0.3em] uppercase">
              Stay Connected
            </span>
            <h2 className="text-4xl md:text-5xl font-bold">
              Join the EasyBuyStore Community
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Subscribe to receive exclusive offers, style tips, and early access to new collections
            </p>
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4 mt-8">
              <input
                type="email"
                placeholder="Enter your email address"
                className="input flex-1 text-primary"
                required
              />
              <button type="submit" className="btn-accent whitespace-nowrap">
                Subscribe Now
              </button>
            </form>
            <p className="text-sm text-gray-400 mt-4">
              By subscribing, you agree to our Privacy Policy and consent to receive updates
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
