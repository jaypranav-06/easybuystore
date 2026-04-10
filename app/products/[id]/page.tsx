import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/lib/db/prisma';
import { Star, ShoppingBag, Truck, Shield, ArrowLeft } from 'lucide-react';
import AddToCartButton from '@/components/customer/AddToCartButton';
import AddToWishlistButton from '@/components/customer/AddToWishlistButton';
import ReviewForm from '@/components/customer/ReviewForm';
import ReviewStatistics from '@/components/customer/ReviewStatistics';
import ReviewList from '@/components/customer/ReviewList';

async function getProduct(id: string) {
  const productId = parseInt(id);
  if (isNaN(productId)) return null;

  const product = await prisma.product.findUnique({
    where: {
      product_id: productId,
      is_active: true,
    },
    include: {
      category: true,
      reviews: {
        where: { is_approved: true },
        include: {
          user: {
            select: {
              first_name: true,
              last_name: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      },
    },
  });

  return product;
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const price = Number(product.discount_price || product.price);
  const originalPrice = product.discount_price ? Number(product.price) : null;
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
  const avgRating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/products" className="inline-flex items-center text-primary hover:text-primary-light mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.product_name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-32 h-32 text-gray-400" />
                </div>
              )}
              {discount > 0 && (
                <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-lg font-semibold">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Product Info */}
            <div>
              <p className="text-sm text-primary mb-2">{product.category?.category_name}</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.product_name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5"
                      fill={i < Math.round(avgRating) ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {avgRating.toFixed(1)} ({product.reviews.length} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-gray-900">Rs {price.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  {originalPrice && (
                    <span className="text-xl text-gray-500 line-through">
                      Rs {originalPrice.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock_quantity > 0 ? (
                  <span className="text-success font-semibold">In Stock ({product.stock_quantity} available)</span>
                ) : (
                  <span className="text-red-600 font-semibold">Out of Stock</span>
                )}
              </div>

              {/* Available Sizes */}
              {product.available_sizes && product.available_sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Available Sizes</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.available_sizes.map((size) => (
                      <span
                        key={size}
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 bg-white"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Select your size when adding to cart
                  </p>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Product Actions: Add to Cart & Wishlist */}
              <AddToCartButton
                product={{
                  ...product,
                  price: Number(product.price),
                  discount_price: product.discount_price ? Number(product.discount_price) : null,
                }}
                availableSizes={product.available_sizes}
                showWishlist={true}
                productId={product.product_id}
              />

              {/* Features */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Truck className="w-6 h-6 text-primary" />
                  <div className="text-sm">
                    <p className="font-semibold">Free Shipping</p>
                    <p className="text-gray-500">On orders over Rs 10,000</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Shield className="w-6 h-6 text-primary" />
                  <div className="text-sm">
                    <p className="font-semibold">Secure Payment</p>
                    <p className="text-gray-500">100% secure</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Star className="w-6 h-6 text-primary" />
                  <div className="text-sm">
                    <p className="font-semibold">Quality Guarantee</p>
                    <p className="text-gray-500">Premium products</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Reviews & Ratings</h2>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-8">
              {/* Review Statistics */}
              <div className="xl:col-span-1">
                <ReviewStatistics reviews={product.reviews} avgRating={avgRating} />
              </div>

              {/* Review Form */}
              <div className="xl:col-span-1">
                <ReviewForm productId={product.product_id} />
              </div>

              {/* Reviews List */}
              <div className="xl:col-span-2">
                <ReviewList
                  reviews={product.reviews.map(review => ({
                    ...review,
                    created_at: new Date(review.created_at)
                  }))}
                  productId={product.product_id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
