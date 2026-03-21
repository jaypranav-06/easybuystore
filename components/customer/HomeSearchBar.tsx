'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp } from 'lucide-react';

export default function HomeSearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const trendingSearches = ['T-Shirts', 'Sneakers', 'Jeans', 'Dresses'];

  const handleTrendingClick = (term: string) => {
    router.push(`/products?search=${encodeURIComponent(term)}`);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="relative max-w-2xl">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-accent transition-colors w-6 h-6" />
          <input
            type="text"
            placeholder="Search for products, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-36 py-4 text-gray-900 bg-white/95 backdrop-blur-sm border-2 border-white/20 rounded-2xl focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all duration-300 text-lg placeholder:text-gray-500 shadow-xl"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-accent to-accent-light text-white px-8 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Search
          </button>
        </div>
      </form>

      {/* Trending Searches */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-gray-300 text-sm">
          <TrendingUp className="w-4 h-4" />
          <span>Trending:</span>
        </div>
        {trendingSearches.map((term) => (
          <button
            key={term}
            onClick={() => handleTrendingClick(term)}
            className="px-4 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
