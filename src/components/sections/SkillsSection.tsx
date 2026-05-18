"use client";

import { useSiteContent } from "@/components/SiteContentProvider";

export function SkillsSection() {
  const { skills } = useSiteContent();
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {skills.map((s, i) => (
        <div
          key={s.name}
          className="anim glass rounded-xl p-5"
          style={{ transitionDelay: `${i * 60}ms` }}
        >
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">{s.name}</span>
            <span className="text-neutral-500">{s.level}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full bg-grad rounded-full transition-all duration-1000" style={{ width: `${s.level}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
