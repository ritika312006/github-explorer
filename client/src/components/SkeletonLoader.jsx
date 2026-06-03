import './SkeletonLoader.css';

function Skeleton({ width, height, circle, className }) {
  return (
    <div
      className={`skeleton ${circle ? 'skeleton--circle' : ''} ${className || ''}`}
      style={{ width, height }}
    />
  );
}

export function ProfileSkeleton() {
  return (
    <div className="skeleton-profile">
      <Skeleton circle width={120} height={120} />
      <div className="skeleton-profile-info">
        <Skeleton width={200} height={28} />
        <Skeleton width={140} height={18} />
        <Skeleton width="100%" height={16} />
        <Skeleton width="80%" height={16} />
        <div className="skeleton-stats">
          <Skeleton width={60} height={40} />
          <Skeleton width={60} height={40} />
          <Skeleton width={60} height={40} />
        </div>
      </div>
    </div>
  );
}

export function RepoSkeleton() {
  return (
    <div className="skeleton-repo">
      <Skeleton width={180} height={18} />
      <Skeleton width="90%" height={14} />
      <Skeleton width="60%" height={14} />
      <div className="skeleton-repo-meta">
        <Skeleton width={60} height={12} />
        <Skeleton width={40} height={12} />
        <Skeleton width={80} height={12} />
      </div>
    </div>
  );
}

export function RepoListSkeleton() {
  return (
    <div className="skeleton-repo-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <RepoSkeleton key={i} />
      ))}
    </div>
  );
}