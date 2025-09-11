import React from 'react';

export const DocumentItemSkeleton: React.FC = () => (
  <div className="flex flex-col animate-pulse">
    <div className="relative aspect-w-16 aspect-h-9 mb-2">
      <div className="w-full h-full object-cover rounded-lg bg-gray-700"></div>
    </div>
    <div className="flex flex-col">
      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
);