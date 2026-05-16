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
        "flex flex-col gap-2 rounded-lg border border-altr-line2 bg-altr-panel p-6",
        className,
      )}
    >
      <span className="text-caption font-medium text-altr-mute">{caption}</span>
      <span className="text-stat font-medium text-altr-white">{value}</span>
      <span className="text-caption text-altr-muteSoft">{context}</span>
    </div>
  );
}
