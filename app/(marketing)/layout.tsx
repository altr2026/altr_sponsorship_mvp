import { Footer } from "@/components/shared/footer";
import { TopNav } from "@/components/shared/top-nav";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-altr-black text-altr-white">
      <TopNav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
