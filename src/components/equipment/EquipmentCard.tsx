"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";

/** عنصر جاهز للعرض — كل حقوله سلاسل نصية محسوبة على الخادم */
export type CatalogItem = {
  id: string;
  categorySlug: string;
  name: string;
  image: string;
  operatorLabel: string;
  whatsappUrl: string;
  specs?: { label: string; value: string }[];
};

export type CardLabels = {
  unitLabel: string;
  terms: string;
  requestUnit: string;
  available: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function EquipmentCard({
  item,
  labels,
}: {
  item: CatalogItem;
  labels: CardLabels;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-navy-20/50 bg-white transition-all duration-300 hover:border-gold hover:shadow-[0_18px_44px_-16px_rgba(28,47,71,0.32)] hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-navy/45 to-transparent" aria-hidden />
        <span className="absolute top-3 end-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[0.72rem] font-medium text-navy shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1faa53] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1faa53]" />
          </span>
          {labels.available}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[0.72rem] tracking-wide text-gray">{labels.unitLabel}</p>
        <h3 className="mt-1 font-heading text-xl text-navy">{item.name}</h3>

        {/* المواصفات (إن وُجدت) */}
        {item.specs && item.specs.length > 0 ? (
          <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 rounded-lg bg-cream/60 p-3 text-[0.82rem]">
            {item.specs.map((s, i) => (
              <div key={i} className="flex flex-col">
                <dt className="text-[0.7rem] text-gray">{s.label}</dt>
                <dd className="font-medium text-navy">{s.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <ul className="mt-4 space-y-2 text-[0.86rem] text-navy-80">
          <li className="flex items-center gap-2">
            <Check size={15} className="text-gold shrink-0" />
            {item.operatorLabel}
          </li>
          <li className="flex items-center gap-2">
            <Check size={15} className="text-gold shrink-0" />
            {labels.terms}
          </li>
        </ul>

        <a
          href={item.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses("navy", "mt-5 w-full")}
        >
          {labels.requestUnit}
        </a>
      </div>
    </motion.article>
  );
}
