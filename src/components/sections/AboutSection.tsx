"use client";

import Image from "next/image";
import { Code2, Users } from "lucide-react";
import { useSiteContent } from "@/components/SiteContentProvider";

export function AboutSection() {
  const { about, images } = useSiteContent();

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="anim-l space-y-6">
        <p className="text-neutral-400 leading-relaxed">{about.bio}</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="glass card-hover rounded-xl p-5">
            <Users className="w-8 h-8 text-violet-400 mb-3" />
            <h3 className="font-semibold mb-1">{about.card1Title}</h3>
            <p className="text-sm text-neutral-500">{about.card1Text}</p>
          </div>
          <div className="glass card-hover rounded-xl p-5">
            <Code2 className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="font-semibold mb-1">{about.card2Title}</h3>
            <p className="text-sm text-neutral-500">{about.card2Text}</p>
          </div>
        </div>
      </div>
      <div className="anim-r flex gap-4 justify-center">
        <Image src={images.alaeddine} alt="Alaeddine" width={200} height={240} className="rounded-2xl object-cover w-40 h-48 shadow-xl" />
        <Image src={images.aziz} alt="Aziz" width={200} height={240} className="rounded-2xl object-cover w-40 h-48 mt-8 shadow-xl" />
      </div>
    </div>
  );
}
