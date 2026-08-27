export default function Skeleton({ className = 'h-24' }) {
  return <div className={`animate-pulse rounded-3xl bg-sand dark:bg-white/10 ${className}`} />;
}
