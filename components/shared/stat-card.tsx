import { cn } from "@/lib/utils";

type StatCardProps = {
  caption: string;
  value: string;
  context: string;
  className?: string;
};

export function StatCard({
  caption,
  value,
  context,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 p-6",
        className,
      )}
    >
      <span className="text-caption font-medium uppercase text-gray-500">
        {caption}
      </span>
      <span className="text-stat font-medium text-gray-900">{value}</span>
      <span className="text-caption text-gray-600">{context}</span>
    </div>
  );
}
