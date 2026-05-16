import Link from "next/link";

import { cn } from "@/lib/utils";

const STEPS: Array<{
  num: string;
  label: string;
  href: string;
  enabled: boolean;
}> = [
  { num: "01", label: "Discover", href: "/demo", enabled: false },
  { num: "02", label: "Deal", href: "/demo", enabled: false },
  { num: "03", label: "Settle", href: "/demo/deals/dl_pbw_samsung", enabled: true },
  { num: "04", label: "Dashboard", href: "/demo", enabled: false },
];

type DemoHeaderProps = {
  currentStep?: "01" | "02" | "03" | "04";
};

export function DemoHeader({ currentStep = "03" }: DemoHeaderProps) {
  return (
    <header className="border-b border-altr-line px-6 pb-4 pt-6 sm:pt-7 md:px-10">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4">
        <Link href="/demo" className="group flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-altr-yellow font-mono text-[14px] font-bold tracking-tight text-altr-black transition-transform group-hover:scale-105">
            A
          </div>
          <div>
            <div className="text-[13px] font-medium tracking-tight text-altr-white">
              ALTR
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-altr-mute">
              Sponsorship OS · Demo v0.1
            </div>
          </div>
        </Link>

        <Link
          href="/"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-altr-muteSoft transition-colors hover:text-altr-white"
        >
          ← Marketing
        </Link>
      </div>

      <div className="mx-auto mt-5 max-w-[1100px] sm:mt-6">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          {STEPS.map((step, index) => {
            const isCurrent = step.num === currentStep;
            const numberClass = cn(
              "grid h-7 w-7 place-items-center rounded-full font-mono text-[10px] font-bold transition-all",
              isCurrent
                ? "bg-altr-yellow text-altr-black ring-4 ring-altr-yellow/25"
                : "bg-altr-line2 text-altr-mute",
            );
            const labelClass = cn(
              "font-mono text-[10px] uppercase tracking-[0.16em] transition-colors",
              isCurrent ? "text-altr-white" : "text-altr-mute",
            );

            const inner = (
              <>
                <span className={numberClass}>{step.num}</span>
                <span className="flex flex-col items-start">
                  <span className={labelClass}>{step.label}</span>
                </span>
              </>
            );

            return (
              <div
                key={step.num}
                className="flex items-center gap-2 sm:gap-3"
              >
                {step.enabled || isCurrent ? (
                  <Link
                    href={step.href}
                    className="group flex cursor-pointer items-center gap-2.5"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div className="flex cursor-not-allowed items-center gap-2.5 opacity-90">
                    {inner}
                  </div>
                )}
                {index < STEPS.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="hidden h-px w-6 bg-altr-line2 sm:block"
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
