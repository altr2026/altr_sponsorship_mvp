import { DemoFooter } from "@/components/demo/demo-footer";
import { DemoHeader } from "@/components/demo/demo-header";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-altr-black text-altr-white">
      <DemoHeader />
      <main className="flex-1">{children}</main>
      <DemoFooter />
    </div>
  );
}
