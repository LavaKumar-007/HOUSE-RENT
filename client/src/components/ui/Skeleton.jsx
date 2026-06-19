function SkeletonCard() {
  return <div className="skeleton skeleton-card" />;
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="properties-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default SkeletonCard;
