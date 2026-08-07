import React from 'react';

interface LoadingSkeletonProps {
  height?: string;
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ height = '20px', count = 3 }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="shimmer-skeleton"
          style={{
            height,
            borderRadius: 'var(--radius-sm)',
            width: i === count - 1 ? '70%' : '100%'
          }}
        />
      ))}
    </div>
  );
};
