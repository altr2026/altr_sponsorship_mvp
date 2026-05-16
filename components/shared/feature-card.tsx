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
        "flex flex-col gap-4 rounded-lg border border-altr-line2 bg-altr-panel p-6",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-teal-500/10 text-teal-400 [&_svg]:h-5 [&_svg]:w-5"
      >
        {icon}
      </span>
      <h3 className="text-altr-white">{title}</h3>
      <p className="text-body text-altr-muteSoft">{description}</p>
    </article>
  );
}
