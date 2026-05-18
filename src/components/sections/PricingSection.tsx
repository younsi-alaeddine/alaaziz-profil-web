"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useSiteContent } from "@/components/SiteContentProvider";

export function PricingSection() {
  const { plans } = useSiteContent();
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {plans.map((plan, i) => (
        <article
          key={plan.name}
          className={`anim rounded-2xl p-8 border ${
            plan.highlight ? "pricing-popular bg-grad/10 border-violet-500/40 scale-[1.02]" : "glass border-white/10"
          }`}
          style={{ transitionDelay: `${i * 80}ms` }}
        >
          <h3 className="text-xl font-bold">{plan.name}</h3>
          <p className="text-3xl font-bold mt-2 text-gradient">{plan.price}</p>
          <p className="text-sm text-neutral-500 mt-1 mb-6">{plan.desc}</p>
          <ul className="space-y-3 mb-8">
            {plan.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-neutral-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className={`block text-center py-3 rounded-xl text-sm font-medium transition ${
              plan.highlight ? "bg-grad hover:opacity-90" : "glass-light hover:bg-white/10"
            }`}
          >
            Choisir ce plan
          </Link>
        </article>
      ))}
    </div>
  );
}
