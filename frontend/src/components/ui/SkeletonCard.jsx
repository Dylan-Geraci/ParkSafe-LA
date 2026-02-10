import React from 'react';

/**
 * Skeleton loading placeholder with shimmer animation
 * @param {Object} props - Component props
 * @param {string} props.variant - Skeleton variant ('score', 'factors', 'form')
 */
const SkeletonCard = ({ variant = 'default' }) => {
  const shimmerClasses = 'animate-pulse bg-slate-700/30';

  if (variant === 'score') {
    return (
      <div className="text-center py-8">
        {/* Header skeleton */}
        <div className={`h-8 w-32 ${shimmerClasses} rounded mx-auto mb-6`}></div>

        {/* Circle skeleton */}
        <div className={`w-44 h-44 ${shimmerClasses} rounded-full mx-auto mb-6 flex items-center justify-center`}>
          <div className="w-32 h-32 bg-slate-800/50 rounded-full"></div>
        </div>

        {/* Text skeletons */}
        <div className={`h-4 w-40 ${shimmerClasses} rounded mx-auto mb-2`}></div>
        <div className={`h-3 w-48 ${shimmerClasses} rounded mx-auto`}></div>
      </div>
    );
  }

  if (variant === 'factors') {
    return (
      <div className="space-y-8">
        {/* Header skeleton */}
        <div className={`h-8 w-32 ${shimmerClasses} rounded mb-6`}></div>

        {/* Factor skeletons (3 items) */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="flex justify-between items-center">
              <div className={`h-5 w-40 ${shimmerClasses} rounded`}></div>
              <div className={`h-6 w-12 ${shimmerClasses} rounded-full`}></div>
            </div>
            <div className={`w-full h-3 ${shimmerClasses} rounded-full`}></div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'recommendations') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={`h-20 ${shimmerClasses} rounded-lg`}></div>
        ))}
      </div>
    );
  }

  // Default skeleton
  return (
    <div className="space-y-4">
      <div className={`h-6 w-3/4 ${shimmerClasses} rounded`}></div>
      <div className={`h-4 w-full ${shimmerClasses} rounded`}></div>
      <div className={`h-4 w-5/6 ${shimmerClasses} rounded`}></div>
    </div>
  );
};

export default SkeletonCard;
