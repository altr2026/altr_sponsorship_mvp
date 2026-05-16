"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type StepNum = "01" | "02" | "03" | "04" | "05" | "06";

const STEPS: Array<{
  num: StepNum;
  label: string;
  href: string;
  enabled: boolean;
}> = [
  { num: "01", label: "Discovery", href: "/demo/discover", enabled: true },
  { num: "02", label: "Deal", href: "/demo/deals/new", enabled: true },
  { num: "03", label: "Settle", href: "/demo/deals/dl_pbw_samsung", enabled: true },
  { num: "04", label: "Activation", href: "/demo", enabled: false },
  { num: "05", label: "Measurement", href: "/demo", enabled: false },
  { num: "06", label: "Renewal", href: "/demo", enabled: false },
];

function deriveCurrentStep(pathname: string | null): StepNum | null {
  if (!pathname) return null;
  if (pathname.startsWith("/demo/discover")) return "01";
  if (pathname.startsWith("/demo/events/")) return "01";
  if (pathname === "/demo/deals/new") return "02";
  if (pathname.startsWith("/demo/deals/")) return "03";
  if (pathname.startsWith("/demo/activation")) return "04";
  if (pathname.startsWith("/demo/measurement")) return "05";
  if (pathname.startsWith("/demo/renewal")) return "06";
  return null;
}

export function DemoHeader() {
  const pathname = usePathname();
  const currentStep = deriveCurrentStep(pathname);

  return (
    <header className="border-b border-altr-line px-6 pb-4 pt-6 sm:pt-7 md:px-10">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <Image
            src="/altr-logo-white.png"
            alt="ALTR"
            width={1500}
            height={512}
            priority
            className="h-6 w-auto"
          />
          <span
            aria-hidden="true"
            className="hidden h-6 w-px bg-altr-line2 sm:block"
          />
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-altr-mute sm:inline">
            Sponsorship OS · Demo v0.1
          </span>
        </Link>

        <Link
          href="/"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-altr-muteSoft transition-colors hover:text-altr-white"
        >
          ← Marketing
        </Link>
      </div>

      <div className="mx-auto mt-5 max-w-[1100px] overflow-x-auto sm:mt-6">
        <div className="flex min-w-max items-center justify-center gap-2 sm:gap-3">
          {STEPS.map((step, index) => {
            const isCurrent = step.num === currentStep;
            const numberClass = cn(
              "grid h-7 w-7 place-items-center rounded-full font-mono text-[10px] font-bold transition-all",
              isCurrent
                ? "bg-teal-600 text-white ring-4 ring-teal-500/30"
                : "bg-altr-line2 text-altr-mute",
            );
            const labelClass = cn(
              "font-mono text-[10px] uppercase tracking-[0.14em] transition-colors",
              isCurrent ? "text-altr-white" : "text-altr-mute",
            );

            const inner = (
              <>
                <span className={numberClass}>{step.num}</span>
                <span className={labelClass}>{step.label}</span>
              </>
            );

            return (
              <div key={step.num} className="flex items-center gap-2">
                {step.enabled ? (
                  <Link
                    href={step.href}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div className="flex cursor-not-allowed items-center gap-2 opacity-90">
                    {inner}
                  </div>
                )}
                {index < STEPS.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="hidden h-px w-4 bg-altr-line2 sm:block"
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}
