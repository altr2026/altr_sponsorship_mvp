"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type NavChild = { label: string; href: string };

type NavItem =
  | { kind: "link"; label: string; href: string; disabled?: boolean }
  | { kind: "dropdown"; label: string; children: NavChild[] };

const NAV_ITEMS: NavItem[] = [
  { kind: "link", label: "For Events", href: "/events" },
  { kind: "link", label: "For Brands", href: "/brands" },
  { kind: "link", label: "For Agencies", href: "/agencies", disabled: true },
  { kind: "link", label: "Insights", href: "/insights" },
  {
    kind: "dropdown",
    label: "About",
    children: [
      { label: "Manifesto", href: "/manifesto" },
      { label: "Roadmap", href: "/roadmap" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
];

type TopNavProps = {
  className?: string;
};

export function TopNav({ className }: TopNavProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (openMenu === null) return;
    function onPointerDown(event: PointerEvent) {
      if (!navRef.current) return;
      if (!navRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenMenu(null);
    }
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

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

        <nav
          ref={navRef}
          className="hidden items-center gap-7 md:flex"
        >
          {NAV_ITEMS.map((item) => {
            if (item.kind === "link") {
              if (item.disabled) {
                return (
                  <span
                    key={item.label}
                    aria-disabled="true"
                    className="inline-flex cursor-not-allowed items-center gap-1.5 text-body text-altr-mute"
                  >
                    {item.label}
                    <span className="rounded border border-altr-line2 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-altr-mute">
                      Soon
                    </span>
                  </span>
                );
              }
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-body text-altr-muteSoft transition-colors hover:text-altr-white"
                >
                  {item.label}
                </Link>
              );
            }

            const isOpen = openMenu === item.label;
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isOpen}
                  onClick={() => setOpenMenu(isOpen ? null : item.label)}
                  className={cn(
                    "inline-flex items-center gap-1 text-body transition-colors",
                    isOpen ? "text-altr-white" : "text-altr-muteSoft hover:text-altr-white",
                  )}
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform",
                      isOpen && "rotate-180",
                    )}
                    aria-hidden="true"
                  />
                </button>

                {isOpen ? (
                  <div
                    role="menu"
                    aria-label={item.label}
                    className="absolute left-1/2 top-full z-50 mt-2 w-44 -translate-x-1/2 overflow-hidden rounded-lg border border-altr-line2 bg-altr-panel/95 p-1 shadow-xl shadow-altr-black/40 backdrop-blur animate-in fade-in-0 slide-in-from-top-1"
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        role="menuitem"
                        onClick={() => setOpenMenu(null)}
                        className="block rounded-md px-3 py-2 text-[13px] text-altr-muteSoft transition-colors hover:bg-altr-line2/60 hover:text-altr-white"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
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
