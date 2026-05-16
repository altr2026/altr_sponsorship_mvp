"use client";

import { cn } from "@/lib/utils";

export type PersonaOption<T extends string> = {
  value: T;
  label: string;
};

type PersonaToggleProps<T extends string> = {
  value: T;
  onChange: (next: T) => void;
  options: PersonaOption<T>[];
  className?: string;
  ariaLabel?: string;
};

export function PersonaToggle<T extends string>({
  value,
  onChange,
  options,
  className,
  ariaLabel = "Select persona",
}: PersonaToggleProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-altr-line2 bg-altr-black p-1",
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex h-8 items-center rounded-md px-3 text-body font-medium transition-colors",
              active
                ? "bg-altr-lime text-altr-black"
                : "text-altr-muteSoft hover:text-altr-white",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
