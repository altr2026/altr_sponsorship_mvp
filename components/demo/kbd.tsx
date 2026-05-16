import { cn } from "@/lib/utils";

type KbdProps = {
  children: React.ReactNode;
  tone?: "yellow" | "mute" | "green";
  className?: string;
};

const TONE_CLASSES: Record<NonNullable<KbdProps["tone"]>, string> = {
  yellow: "text-altr-yellow",
  mute: "text-altr-mute",
  green: "text-altr-green",
};

export function Kbd({ children, tone = "yellow", className }: KbdProps) {
  return (
    <span
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.22em]",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
