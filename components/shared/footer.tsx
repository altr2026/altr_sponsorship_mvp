import Link from "next/link";

import { cn } from "@/lib/utils";

const FOOTER_GROUPS: Array<{ heading: string; links: { label: string; href: string }[] }> = [
  {
    heading: "Product",
    links: [
      { label: "Demo", href: "/demo" },
      { label: "Partners", href: "/partners" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/#about" },
      { label: "Pitch deck", href: "/#pitch" },
      { label: "Contact", href: "mailto:hello@altr.haus" },
    ],
  },
  {
    heading: "Connect",
    links: [
      { label: "Twitter", href: "https://twitter.com/altr2026" },
      { label: "LinkedIn", href: "https://linkedin.com/company/altr2026" },
      { label: "GitHub", href: "https://github.com/altr2026" },
    ],
  },
];

type FooterProps = {
  className?: string;
};

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        "border-t border-gray-200 bg-gray-50",
        className,
      )}
    >
      <div className="container grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="space-y-3">
          <Link
            href="/"
            className="text-base font-medium tracking-tight text-gray-900"
          >
            ALTR
          </Link>
          <p className="max-w-xs text-body text-gray-600">
            Sponsorship infrastructure for APAC and GCC live events.
          </p>
        </div>

        {FOOTER_GROUPS.map((group) => (
          <div key={group.heading} className="space-y-3">
            <h4 className="text-caption font-medium uppercase text-gray-500">
              {group.heading}
            </h4>
            <ul className="space-y-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body text-gray-600 transition-colors hover:text-gray-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200">
        <div className="container flex flex-col items-start justify-between gap-3 py-6 md:flex-row md:items-center">
          <p className="text-caption text-gray-500">
            © {new Date().getFullYear()} ALTR. All rights reserved.
          </p>
          <span className="inline-flex items-center gap-2 rounded-md border border-purple-200 bg-white px-3 py-1.5 text-caption font-medium uppercase text-purple-700">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-purple-600"
            />
            Built on XRPL
          </span>
        </div>
      </div>
    </footer>
  );
}
