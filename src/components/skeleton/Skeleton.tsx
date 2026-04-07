export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function Skeleton({ width, height = 16, className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded ${className}`}
      style={{
        width: width ?? "100%",
        height,
        background: "var(--muted)",
      }}
    />
  );
}

export function SkeletonRow() {
  return (
    <tr>
      {/* Symbol + name */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Skeleton width={12} height={12} />
          <div className="space-y-1">
            <Skeleton width={48} height={14} />
            <Skeleton width={64} height={10} />
          </div>
        </div>
      </td>
      {/* Price */}
      <td className="px-4 py-3 text-right">
        <Skeleton width={64} height={14} />
      </td>
      {/* % ngày */}
      <td className="px-4 py-3 text-right">
        <Skeleton width={48} height={14} />
      </td>
      {/* Volume */}
      <td className="px-4 py-3 text-right">
        <Skeleton width={44} height={14} />
      </td>
      {/* RSI */}
      <td className="px-4 py-3">
        <Skeleton width={80} height={10} />
      </td>
      {/* Signal */}
      <td className="px-4 py-3">
        <Skeleton width={44} height={22} />
      </td>
      {/* Actions */}
      <td className="px-4 py-3">
        <Skeleton width={20} height={20} />
      </td>
    </tr>
  );
}
