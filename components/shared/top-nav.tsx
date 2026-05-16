import Link from "next/link";

import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Product", href: "/#product" },
  { label: "Demo", href: "/demo" },
  { label: "Partners", href: "/partners" },
  { label: "Pitch", href: "/#pitch" },
];

type TopNavProps = {
  ctaHref?: string;
  ctaLabel?: string;
  className?: string;
};

export function TopNav({
  ctaHref = "/#waitlist",
  ctaLabel = "Get early access",
  className,
}: TopNavProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-16 w-full border-b border-gray-200 bg-background/95",
        className,
      )}
    >
      <div className="container flex h-full items-center justify-between gap-8">
        <Link
          href="/"
          className="text-base font-medium tracking-tight text-gray-900"
        >
          ALTR
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-body text-gray-600 transition-colors hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href={ctaHref}
          className="inline-flex h-9 items-center rounded-md bg-teal-600 px-4 text-body font-medium text-white transition-colors hover:bg-teal-700"
        >
          {ctaLabel}
        </Link>
      </div>
    </header>
  );
}
