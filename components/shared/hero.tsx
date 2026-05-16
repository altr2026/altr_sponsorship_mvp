import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

type HeroLink = {
  label: string;
  href: string;
};

type HeroProps = {
  title: string;
  subtitle?: string;
  primaryCta: HeroLink;
  secondaryLink?: HeroLink;
  trustLine?: string;
  className?: string;
};

export function Hero({
  title,
  subtitle,
  primaryCta,
  secondaryLink,
  trustLine,
  className,
}: HeroProps) {
  return (
    <section
      className={cn(
        "container flex flex-col items-start gap-6 py-24 md:py-32",
        className,
      )}
    >
      <h1 className="max-w-3xl">{title}</h1>

      {subtitle ? (
        <p className="max-w-2xl text-body text-gray-600">{subtitle}</p>
      ) : null}

      <div className="mt-2 flex flex-wrap items-center gap-5">
        <Link
          href={primaryCta.href}
          className="inline-flex h-11 items-center rounded-md bg-teal-600 px-5 text-body font-medium text-white transition-colors hover:bg-teal-700"
        >
          {primaryCta.label}
        </Link>

        {secondaryLink ? (
          <Link
            href={secondaryLink.href}
            className="inline-flex items-center gap-1.5 text-body font-medium text-gray-900 hover:text-teal-700"
          >
            {secondaryLink.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        ) : null}
      </div>

      {trustLine ? (
        <p className="text-caption uppercase tracking-wider text-gray-500">
          {trustLine}
        </p>
      ) : null}
    </section>
  );
}
