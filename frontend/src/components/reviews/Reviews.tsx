"use client";

import React, { useState } from "react";
import { FiStar, FiChevronDown, FiChevronUp } from "react-icons/fi";

interface Review {
  id: number;
  rating: number;
  feedback?: string;
  createdAt: string;
  userName?: string;
  verified?: boolean;
}

interface ReviewsProps {
  reviews: Review[];
}

const Reviews: React.FC<ReviewsProps> = ({ reviews }) => {
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');

  if (!reviews || reviews.length === 0) {
    return (
      <div className="mt-8 p-6 bg-primary rounded-lg text-center text-primary">
        <div className="text-4xl mb-3">🌟</div>
        <h3 className="text-xl font-semibold">No reviews yet</h3>
        <p className="text-secondary mt-2">Be the first to review this product!</p>
      </div>
    );
  }

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'highest') return b.rating - a.rating;
    return a.rating - b.rating;
  });

  const reviewsToShow = sortedReviews.slice(0, visibleReviews);
  const hasMoreReviews = visibleReviews < sortedReviews.length;

  const loadMoreReviews = () => setVisibleReviews(prev => prev + 3);
  const showLessReviews = () => setVisibleReviews(3);

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach(review => { ratingCounts[5 - review.rating]++; });

  return (
    <div className="mt-10 pt-6 border-t border-secondary">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold text-primary mb-4 md:mb-0">Customer Reviews</h2>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="text-3xl font-bold text-primary mr-2">{averageRating.toFixed(1)}</div>
            <div className="flex flex-col">
              <div className="flex text-accent">
                {[...Array(5)].map((_, i) => (
                  <FiStar 
                    key={i} 
                    className={`${i < Math.round(averageRating) ? 'fill-current' : ''}`} 
                    size={16}
                  />
                ))}
              </div>
              <span className="text-sm text-secondary mt-1">{reviews.length} reviews</span>
            </div>
          </div>
          
          <div className="relative">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'highest' | 'lowest')}
              className="py-2 pl-3 pr-10 border border-accent rounded-md bg-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent appearance-none text-sm text-primary"
            >
              <option value="newest">Newest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary">
              <FiChevronDown />
            </div>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-secondary max-w-2xl p-4 rounded-lg mb-8">
        <h3 className="font-medium text-primary mb-3">Rating Breakdown</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((stars, index) => {
            const count = ratingCounts[index];
            const percentage = (count / reviews.length) * 100;
            return (
              <div key={stars} className="flex items-center">
                <div className="w-12 text-sm text-secondary">{stars} stars</div>
                <div className="flex-1 h-2 bg-primary rounded-full mx-2 overflow-hidden">
                  <div 
                    className="h-full bg-accent rounded-full" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="w-10 text-sm text-secondary text-right">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviewsToShow.map((review) => (
          <div
            key={review.id}
            className="p-5 rounded-lg border border-secondary bg-primary shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center">
                  <div className="flex text-accent mr-2">
                    {[...Array(5)].map((_, i) => (
                      <FiStar 
                        key={i} 
                        className={`${i < review.rating ? 'fill-current' : ''}`} 
                        size={16}
                      />
                    ))}
                  </div>
                  <span className="font-medium text-primary">{review.rating}/5</span>
                </div>
                {review.userName && (
                  <h4 className="font-medium text-primary mt-1">
                    {review.userName}
                    {review.verified && (
                      <span className="ml-2 text-xs bg-accent text-primary px-2 py-0.5 rounded-full">
                        Verified Buyer
                      </span>
                    )}
                  </h4>
                )}
              </div>
              <span className="text-sm text-secondary">
                {new Date(review.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
            
            {review.feedback && (
              <p className="text-secondary leading-relaxed">{review.feedback}</p>
            )}
          </div>
        ))}
      </div>

      {/* Load More / Show Less Buttons */}
      <div className="mt-8 flex justify-center space-x-4">
        {hasMoreReviews ? (
          <button
            onClick={loadMoreReviews}
            className="flex items-center px-5 py-2.5 border border-accent rounded-md text-primary hover:bg-accent-hover transition-colors"
          >
            Load More Reviews
            <FiChevronDown className="ml-2" />
          </button>
        ) : visibleReviews > 3 && (
          <button
            onClick={showLessReviews}
            className="flex items-center px-5 py-2.5 border border-accent rounded-md text-primary hover:bg-accent-hover transition-colors"
          >
            Show Less
            <FiChevronUp className="ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Reviews;