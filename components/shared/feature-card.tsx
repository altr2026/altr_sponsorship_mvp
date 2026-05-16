import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
};

export function FeatureCard({
  icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-teal-50 text-teal-700 [&_svg]:h-5 [&_svg]:w-5"
      >
        {icon}
      </span>
      <h3>{title}</h3>
      <p className="text-body text-gray-600">{description}</p>
    </article>
  );
}
