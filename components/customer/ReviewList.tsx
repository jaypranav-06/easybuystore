'use client';

import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Check, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface Review {
  id: number;
  rating: number;
  title: string | null;
  comment: string | null;
  images: string[];
  is_verified_purchase: boolean;
  helpful_count: number;
  unhelpful_count: number;
  created_at: Date;
  user: {
    first_name: string;
    last_name: string;
  };
}

interface ReviewListProps {
  reviews: Review[];
  productId: number;
}

export default function ReviewList({ reviews, productId }: ReviewListProps) {
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating-high' | 'rating-low'>('recent');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [votedReviews, setVotedReviews] = useState<Record<number, 'helpful' | 'unhelpful'>>({});

  // Sort and filter reviews
  const filteredAndSortedReviews = reviews
    .filter((review) => !filterRating || review.rating === filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case 'helpful':
          return b.helpful_count - a.helpful_count;
        case 'rating-high':
          return b.rating - a.rating;
        case 'rating-low':
          return a.rating - b.rating;
        case 'recent':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const handleVote = async (reviewId: number, voteType: 'helpful' | 'unhelpful') => {
    if (votedReviews[reviewId]) {
      return; // Already voted
    }

    try {
      const response = await fetch('/api/reviews/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId,
          voteType,
        }),
      });

      if (response.ok) {
        setVotedReviews((prev) => ({ ...prev, [reviewId]: voteType }));
        // Refresh the page to update vote counts
        window.location.reload();
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Sort */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="rating-high">Highest Rating</option>
            <option value="rating-low">Lowest Rating</option>
          </select>
        </div>

        {/* Filter by Rating */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Filter:</label>
          <div className="flex gap-1">
            <button
              onClick={() => setFilterRating(null)}
              className={`px-3 py-1.5 text-sm rounded-lg border ${
                filterRating === null
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
              }`}
            >
              All
            </button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => setFilterRating(rating)}
                className={`px-3 py-1.5 text-sm rounded-lg border flex items-center gap-1 ${
                  filterRating === rating
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                }`}
              >
                {rating} <Star className="w-3 h-3" fill="currentColor" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      {filteredAndSortedReviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No reviews found with the selected filters.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredAndSortedReviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900">
                      {review.user.first_name} {review.user.last_name}
                    </p>
                    {review.is_verified_purchase && (
                      <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4"
                          fill={i < review.rating ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {review.title && (
                <h4 className="font-semibold text-gray-800 mb-2">{review.title}</h4>
              )}

              {review.comment && (
                <p className="text-gray-600 mb-3 leading-relaxed">{review.comment}</p>
              )}

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mb-3 flex-wrap">
                  {review.images.map((image, idx) => (
                    <div
                      key={idx}
                      className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200"
                    >
                      <Image
                        src={image}
                        alt={`Review image ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Helpful Buttons */}
              <div className="flex items-center gap-4 mt-3">
                <span className="text-sm text-gray-600">Was this helpful?</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVote(review.id, 'helpful')}
                    disabled={!!votedReviews[review.id]}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      votedReviews[review.id] === 'helpful'
                        ? 'bg-primary text-white'
                        : 'border border-gray-300 hover:border-primary hover:text-primary'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Helpful ({review.helpful_count})</span>
                  </button>
                  <button
                    onClick={() => handleVote(review.id, 'unhelpful')}
                    disabled={!!votedReviews[review.id]}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      votedReviews[review.id] === 'unhelpful'
                        ? 'bg-gray-600 text-white'
                        : 'border border-gray-300 hover:border-gray-600 hover:text-gray-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>Not Helpful ({review.unhelpful_count})</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
