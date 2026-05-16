import Link from "next/link";

import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Events", href: "/events" },
  { label: "Brands", href: "/brands" },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/about" },
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
        "sticky top-0 z-40 h-16 w-full border-b border-altr-line2 bg-altr-black/90 backdrop-blur",
        className,
      )}
    >
      <div className="container flex h-full items-center justify-between gap-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-base font-medium tracking-tight text-altr-white"
        >
          <span>ALTR</span>
          <span
            aria-hidden="true"
            className="h-2 w-2 bg-altr-pink"
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-body text-altr-muteSoft transition-colors hover:text-altr-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <Link
            href="/connect"
            className="hidden text-body text-altr-muteSoft transition-colors hover:text-altr-white sm:inline"
          >
            Sign in
          </Link>
          <Link
            href={ctaHref}
            className="inline-flex h-9 items-center rounded-md bg-teal-600 px-4 text-body font-medium text-white transition-colors hover:bg-teal-500"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
