import { Star } from 'lucide-react';

interface ReviewStatisticsProps {
  reviews: Array<{ rating: number }>;
  avgRating: number;
}

export default function ReviewStatistics({ reviews, avgRating }: ReviewStatisticsProps) {
  const totalReviews = reviews.length;

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r) => r.rating === rating).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { rating, count, percentage };
  });

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Ratings</h3>

      {/* Average Rating Display */}
      <div className="flex items-center gap-6 mb-6 pb-6 border-b">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900">{avgRating.toFixed(1)}</div>
          <div className="flex justify-center text-yellow-400 my-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5"
                fill={i < Math.round(avgRating) ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <div className="text-sm text-gray-600">{totalReviews} reviews</div>
        </div>

        {/* Rating Bars */}
        <div className="flex-1">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-600 w-12">{rating} star</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-10 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Summary */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-gray-900">
            {ratingDistribution[0].count + ratingDistribution[1].count}
          </div>
          <div className="text-xs text-gray-600">4-5 Stars</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">
            {ratingDistribution[2].count}
          </div>
          <div className="text-xs text-gray-600">3 Stars</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">
            {ratingDistribution[3].count + ratingDistribution[4].count}
          </div>
          <div className="text-xs text-gray-600">1-2 Stars</div>
        </div>
      </div>
    </div>
  );
}
