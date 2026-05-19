import type { ComponentType } from "react";
import { AboutSection } from "@/components/sections/AboutSection";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { PortfolioGrid } from "@/components/sections/PortfolioGrid";
import { PricingSection } from "@/components/sections/PricingSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { ContactForm } from "@/components/sections/ContactForm";
import type { SectionId } from "@/lib/sections";

/** Contenu par section — une seule map, pas de duplication dans LandingPage */
export const LANDING_SECTION_CONTENT: Partial<Record<SectionId, ComponentType>> = {
  about: AboutSection,
  services: ServicesGrid,
  skills: SkillsSection,
  portfolio: PortfolioGrid,
  pricing: PricingSection,
  faq: FaqSection,
  contact: ContactForm,
};
