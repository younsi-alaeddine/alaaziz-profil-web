import type { Metadata } from "next";

export const SITE = {
  name: "Alaeddine & Aziz",
  title: "Alaeddine & Aziz — Développeurs Full-Stack",
  description:
    "Duo développeurs full-stack : sites web, SaaS, applications mobile et APIs sur mesure.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
} as const;

export function pageMetadata(
  title: string,
  description?: string
): Metadata {
  return {
    title: `${title} | ${SITE.name}`,
    description: description ?? SITE.description,
    openGraph: {
      title: `${title} | ${SITE.name}`,
      description: description ?? SITE.description,
      type: "website",
    },
  };
}
