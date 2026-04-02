'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Product {
  product_id: number;
  product_name: string;
  price: number;
  discount_price: number | null;
  image_url: string | null;
  category: { category_name: string } | null;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Search products
  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=5`);
        const data = await response.json();
        if (data.success) {
          setResults(data.products);
        }
      } catch (error) {
        console.error('Error searching products:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const saveRecentSearch = (query: string) => {
    const updated = [query, ...recentSearches.filter(q => q !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim());
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      onClose();
    }
  };

  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query);
    router.push(`/products?search=${encodeURIComponent(query)}`);
    onClose();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-start justify-center p-4 pt-16 sm:pt-24">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="p-6 bg-gradient-to-r from-gray-50 to-white">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors w-5 h-5" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-12 pr-14 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-gray-900 placeholder:text-gray-400 shadow-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-1 transition-all"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Results */}
          <div className="max-h-[28rem] overflow-y-auto">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-primary border-t-transparent"></div>
                <p className="mt-3 text-gray-500 font-medium">Searching...</p>
              </div>
            ) : searchQuery.trim().length >= 2 ? (
              results.length > 0 ? (
                <div className="p-3">
                  <div className="space-y-1">
                    {results.map((product) => (
                      <Link
                        key={product.product_id}
                        href={`/products/${product.product_id}`}
                        onClick={() => {
                          saveRecentSearch(searchQuery);
                          onClose();
                        }}
                        className="flex items-center gap-4 p-3 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 rounded-xl transition-all group"
                      >
                        <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden group-hover:shadow-md transition-shadow">
                          {product.image_url && (
                            <Image
                              src={product.image_url}
                              alt={product.product_name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
                            {product.product_name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">{product.category?.category_name}</p>
                          <p className="text-sm font-bold text-primary mt-1">
                            Rs {Number(product.discount_price || product.price).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <Search className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                      </Link>
                    ))}
                  </div>
                  <Link
                    href={`/products?search=${encodeURIComponent(searchQuery)}`}
                    onClick={() => {
                      saveRecentSearch(searchQuery);
                      onClose();
                    }}
                    className="block p-4 text-center text-primary hover:bg-primary hover:text-white rounded-xl font-semibold mt-3 transition-all border-2 border-primary/20 hover:border-primary"
                  >
                    View all results for "{searchQuery}"
                  </Link>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No products found</p>
                  <p className="text-sm text-gray-400 mt-1">Try searching with different keywords</p>
                </div>
              )
            ) : (
              // Recent Searches
              recentSearches.length > 0 && (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Recent Searches
                    </h3>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-500 hover:text-primary font-medium transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {recentSearches.map((query, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentSearchClick(query)}
                        className="flex items-center justify-between w-full text-left px-4 py-2.5 hover:bg-gray-50 rounded-lg text-gray-700 transition-all group"
                      >
                        <span className="text-sm font-medium group-hover:text-primary transition-colors">{query}</span>
                        <Search className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
