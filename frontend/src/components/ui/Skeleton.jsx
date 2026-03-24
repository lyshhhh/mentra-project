export default function Skeleton({ height = "h-4", width = "w-full" }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${height} ${width}`}
    />
  );
}