import { DEMO_DATA_DISCLAIMER } from "@/lib/mock-data";

export function DemoFooter() {
  return (
    <footer className="border-t border-altr-line">
      <div className="mx-auto flex max-w-[1100px] flex-col items-start justify-between gap-2 px-6 py-4 text-[11px] md:flex-row md:items-center md:px-10">
        <span className="text-altr-mute">{DEMO_DATA_DISCLAIMER}</span>
        <span className="font-mono uppercase tracking-[0.18em] text-altr-mute">
          v0.1 · XRPL testnet
        </span>
      </div>
    </footer>
  );
}
