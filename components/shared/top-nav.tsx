import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Events", href: "/events" },
  { label: "Brands", href: "/brands" },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/about" },
];

type TopNavProps = {
  className?: string;
};

export function TopNav({ className }: TopNavProps) {
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
          className="inline-flex items-center transition-opacity hover:opacity-90"
        >
          <Image
            src="/altr-logo-white.png"
            alt="ALTR"
            width={1500}
            height={512}
            priority
            className="h-6 w-auto"
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

        <Link
          href="/connect"
          className="text-body text-altr-muteSoft transition-colors hover:text-altr-white"
        >
          Sign in
        </Link>
      </div>
    </header>
  );
}
