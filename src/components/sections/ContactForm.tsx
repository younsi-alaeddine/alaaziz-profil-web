"use client";

import { FormEvent, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { submitContactRequest } from "@/app/actions/contact";
import { useToast } from "@/components/Toast";
import { useSiteContent } from "@/components/SiteContentProvider";

const inputClass =
  "mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:border-violet-500/50 focus:outline-none";

export function ContactForm() {
  const { services } = useSiteContent();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const fd = new FormData(form);

    const result = await submitContactRequest({
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      company: String(fd.get("company") || "") || null,
      budget: String(fd.get("budget") || "") || null,
      service: String(fd.get("service") || ""),
      message: String(fd.get("message") || ""),
      website: String(fd.get("website") || ""),
    });

    setLoading(false);

    if (!result.ok) {
      toast(result.error, "error");
      return;
    }

    toast("Message envoyé ! Nous vous répondrons sous 24h.", "success");
    form.reset();
  }

  return (
    <form onSubmit={onSubmit} className="glass rounded-2xl p-8 space-y-5 anim max-w-2xl mx-auto relative">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute opacity-0 pointer-events-none h-0 w-0"
        aria-hidden
      />
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block text-sm">
          <span className="text-neutral-400">Nom *</span>
          <input name="name" required minLength={2} maxLength={120} className={inputClass} />
        </label>
        <label className="block text-sm">
          <span className="text-neutral-400">Email *</span>
          <input name="email" type="email" required className={inputClass} />
        </label>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block text-sm">
          <span className="text-neutral-400">Entreprise</span>
          <input name="company" maxLength={200} className={inputClass} />
        </label>
        <label className="block text-sm">
          <span className="text-neutral-400">Budget</span>
          <select name="budget" className={inputClass}>
            <option value="">Sélectionner</option>
            <option value="< 3k €">&lt; 3 000 €</option>
            <option value="3k-10k €">3 000 – 10 000 €</option>
            <option value="10k+ €">10 000 € +</option>
          </select>
        </label>
      </div>
      <label className="block text-sm">
        <span className="text-neutral-400">Service *</span>
        <select name="service" required className={inputClass}>
          <option value="">Choisir un service</option>
          {services.map((s) => (
            <option key={s.title} value={s.title}>
              {s.title}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="text-neutral-400">Message *</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          className={`${inputClass} resize-none`}
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="bg-grad w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        Envoyer
      </button>
    </form>
  );
}
