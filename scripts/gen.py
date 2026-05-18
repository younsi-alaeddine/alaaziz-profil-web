#!/usr/bin/env python3
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def w(rel: str, content: str) -> None:
    path = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print("ok", rel)


w(
    "src/components/layout/SiteLayout.tsx",
    """
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
""",
)

w(
    "src/app/layout.tsx",
    """
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/Toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alaeddine & Aziz — Développeurs Full-Stack",
  description: "Sites web, SaaS et applications sur mesure",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr">
      <body className={`${inter.className} bg-[#0a0a0a] text-white antialiased`}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
""",
)

w(
    "src/app/(site)/layout.tsx",
    """
import { SiteLayout } from "@/components/layout/SiteLayout";

export default function SiteGroupLayout({ children }: { children: React.ReactNode }) {
  return <SiteLayout>{children}</SiteLayout>;
}
""",
)

w(
    "src/components/sections/PageHeader.tsx",
    """
export function PageHeader({
  label,
  labelColor = "text-violet-400",
  title,
  subtitle,
  center = false,
}: {
  label: string;
  labelColor?: string;
  title: React.ReactNode;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`anim mb-16 ${center ? "text-center" : ""}`}>
      <span className={`section-label text-xs font-medium uppercase tracking-wider ${labelColor} ${center ? "justify-center" : ""}`}>
        {label}
      </span>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-4">{title}</h1>
      {subtitle && <p className="text-neutral-500 mt-3">{subtitle}</p>}
    </div>
  );
}
""",
)

print("batch 1 done")
