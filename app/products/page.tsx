'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingBag, Search, Filter } from 'lucide-react';
import AddToWishlistButton from '@/components/customer/AddToWishlistButton';

interface Product {
  product_id: number;
  product_name: string;
  price: number;
  discount_price: number | null;
  image_url: string | null;
  category: { category_name: string } | null;
  average_rating: number;
  review_count: number;
  is_new: boolean;
}

interface Category {
  category_id: number;
  category_name: string;
}

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);
  const [showNewArrivals, setShowNewArrivals] = useState(false);
  const [showBestsellers, setShowBestsellers] = useState(false);

  // Read filters from URL query parameters on initial load
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    const searchFromUrl = searchParams.get('search');
    const featuredFromUrl = searchParams.get('featured');
    const newFromUrl = searchParams.get('new');
    const bestsellerFromUrl = searchParams.get('bestseller');

    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
      setDebouncedSearchQuery(searchFromUrl);
    }
    if (featuredFromUrl === 'true') {
      setShowFeatured(true);
    }
    if (newFromUrl === 'true') {
      setShowNewArrivals(true);
    }
    if (bestsellerFromUrl === 'true') {
      setShowBestsellers(true);
    }
  }, [searchParams]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy, debouncedSearchQuery, showFeatured, showNewArrivals, showBestsellers]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (debouncedSearchQuery) params.append('search', debouncedSearchQuery);
      if (showFeatured) params.append('featured', 'true');
      if (showNewArrivals) params.append('new', 'true');
      if (showBestsellers) params.append('bestseller', 'true');

      const apiUrl = `/api/products?${params}`;

      const response = await fetch(apiUrl, {
        cache: 'no-store',  // Disable Next.js fetch caching
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const data = await response.json();

      if (data.success) {
        let sorted = data.products;

        // Sort products
        if (sortBy === 'price-low') {
          sorted = sorted.sort((a: Product, b: Product) =>
            (a.discount_price || a.price) - (b.discount_price || b.price)
          );
        } else if (sortBy === 'price-high') {
          sorted = sorted.sort((a: Product, b: Product) =>
            (b.discount_price || b.price) - (a.discount_price || a.price)
          );
        }

        setProducts(sorted);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header with Enhanced Search */}
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-center">
              Discover Amazing Products
            </h1>
            <p className="text-gray-600 text-center mb-6">
              {products.length > 0 ? (
                <>
                  {products.length} {products.length === 1 ? 'product' : 'products'} found
                  {searchQuery && ` for "${searchQuery}"`}
                  {selectedCategory && categories.length > 0 && ` in ${categories.find(c => String(c.category_id) === selectedCategory)?.category_name || 'selected category'}`}
                </>
              ) : 'Find your perfect match'}
            </p>

            {/* Enhanced Search Bar */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-accent transition-colors w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, category, description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all duration-300 text-gray-900 placeholder:text-gray-500 shadow-sm hover:shadow-md"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 py-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all duration-300 shadow-sm hover:shadow-md ${
                  showFilters
                    ? 'bg-accent text-white'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-accent'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>

            {/* Active Filters Display */}
            {(selectedCategory || showFeatured || showNewArrivals || showBestsellers || searchQuery) && (
              <div className="flex flex-wrap gap-2 mt-4 items-center">
                <span className="text-sm text-gray-600 font-medium">Active filters:</span>
                {searchQuery && (
                  <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium flex items-center gap-2">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="hover:text-accent-light">✕</button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center gap-2">
                    {categories.find(c => String(c.category_id) === selectedCategory)?.category_name || 'Category'}
                    <button onClick={() => setSelectedCategory('')} className="hover:text-primary-light">✕</button>
                  </span>
                )}
                {showFeatured && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-2">
                    Featured
                    <button onClick={() => setShowFeatured(false)} className="hover:text-green-900">✕</button>
                  </span>
                )}
                {showNewArrivals && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2">
                    New Arrivals
                    <button onClick={() => setShowNewArrivals(false)} className="hover:text-blue-900">✕</button>
                  </span>
                )}
                {showBestsellers && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium flex items-center gap-2">
                    Bestsellers
                    <button onClick={() => setShowBestsellers(false)} className="hover:text-yellow-900">✕</button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSearchQuery('');
                    setShowFeatured(false);
                    setShowNewArrivals(false);
                    setShowBestsellers(false);
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900 underline ml-2"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block w-64 flex-shrink-0`}>
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="md:hidden text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Categories
                </label>
                {searchQuery && (
                  <p className="text-xs text-gray-500 mb-3">
                    Filter search results by category
                  </p>
                )}
                <div className="space-y-2.5">
                  <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                      className="w-4 h-4 text-accent border-gray-300 focus:ring-accent"
                    />
                    <span className="text-sm text-gray-700 font-medium">All Categories</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category.category_id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === String(category.category_id)}
                        onChange={() => setSelectedCategory(String(category.category_id))}
                        className="w-4 h-4 text-accent border-gray-300 focus:ring-accent"
                      />
                      <span className="text-sm text-gray-700">{category.category_name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Product Types */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Product Types
                </label>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={showFeatured}
                      onChange={(e) => setShowFeatured(e.target.checked)}
                      className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                    />
                    <span className="text-sm text-gray-700">Featured</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={showNewArrivals}
                      onChange={(e) => setShowNewArrivals(e.target.checked)}
                      className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                    />
                    <span className="text-sm text-gray-700">New Arrivals</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={showBestsellers}
                      onChange={(e) => setShowBestsellers(e.target.checked)}
                      className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                    />
                    <span className="text-sm text-gray-700">Bestsellers</span>
                  </label>
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all text-gray-700"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSearchQuery('');
                  setSortBy('newest');
                  setShowFeatured(false);
                  setShowNewArrivals(false);
                  setShowBestsellers(false);
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {products.length} {products.length === 1 ? 'product' : 'products'} found
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="mx-auto w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-600">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.product_id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const price = Number(product.discount_price || product.price);
  const originalPrice = product.discount_price ? Number(product.price) : null;

  return (
    <div className="group">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition overflow-hidden">
        <Link href={`/products/${product.product_id}`} className="block">
          <div className="relative aspect-square">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.product_name}
                fill
                className="object-cover group-hover:scale-105 transition duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <ShoppingBag className="w-16 h-16 text-gray-400" />
              </div>
            )}
            {product.is_new && (
              <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                New
              </span>
            )}
            {product.discount_price && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                Sale
              </span>
            )}
          </div>
        </Link>
        <div className="p-4">
          <Link href={`/products/${product.product_id}`} className="block">
            <p className="text-sm text-gray-500 mb-1">{product.category?.category_name}</p>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-gray-800 line-clamp-2 flex-1">
                {product.product_name}
              </h3>
              <div onClick={(e) => e.preventDefault()} className="flex-shrink-0 -mt-1">
                <AddToWishlistButton
                  productId={product.product_id}
                  className="!p-0 hover:scale-110 transition-transform"
                />
              </div>
            </div>
          </Link>
          <Link href={`/products/${product.product_id}`} className="block">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4"
                    fill={i < Math.round(product.average_rating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({product.review_count})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-800">
                Rs {price.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              {originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  Rs {originalPrice.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              )}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}


export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}

