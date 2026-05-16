import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

const FOOTER_GROUPS: Array<{ heading: string; links: { label: string; href: string }[] }> = [
  {
    heading: "Product",
    links: [
      { label: "Events", href: "/events" },
      { label: "Brands", href: "/brands" },
      { label: "Insights", href: "/insights" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
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
        "border-t border-altr-line2 bg-altr-panel",
        className,
      )}
    >
      <div className="container grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/altr-logo-white.png"
              alt="ALTR"
              width={1500}
              height={512}
              className="h-6 w-auto"
            />
          </Link>
          <p className="max-w-xs text-body text-altr-muteSoft">
            Sponsorship infrastructure for APAC and GCC live events.
          </p>
        </div>

        {FOOTER_GROUPS.map((group) => (
          <div key={group.heading} className="space-y-3">
            <h4 className="text-caption font-medium text-altr-mute">
              {group.heading}
            </h4>
            <ul className="space-y-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body text-altr-muteSoft transition-colors hover:text-altr-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-altr-line2">
        <div className="container flex flex-col items-start justify-between gap-3 py-6 md:flex-row md:items-center">
          <p className="text-caption text-altr-mute">
            © {new Date().getFullYear()} ALTR. All rights reserved.
          </p>
          <span className="inline-flex items-center gap-2 rounded-md border border-altr-lime/40 bg-altr-lime/10 px-3 py-1.5 text-caption font-medium text-altr-lime">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-teal-400"
            />
            APAC + GCC
          </span>
        </div>
      </div>
    </footer>
  );
}
