import { DynamicPageHeader } from "@/components/sections/DynamicPageHeader";
import { ContactForm } from "@/components/sections/ContactForm";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Contact",
  "Décrivez votre projet — réponse sous 24h ouvrées."
);

export default function ContactPage() {
  return (
    <section className="px-6 py-16 max-w-6xl mx-auto">
      <DynamicPageHeader pageKey="contact" />
      <ContactForm />
    </section>
  );
}
