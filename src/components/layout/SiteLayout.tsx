import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ScrollAnimations } from "@/components/ScrollAnimations";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">{children}</main>
      <Footer />
      <ScrollAnimations />
    </>
  );
}
