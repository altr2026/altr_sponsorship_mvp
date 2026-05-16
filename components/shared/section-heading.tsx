import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <span className="text-caption font-medium text-teal-700">{eyebrow}</span>
      <h2 className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "max-w-2xl text-body text-gray-600",
            align === "center" && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
