import { getTranslations } from "next-intl/server";
import {
  ClipboardCheck,
  Clock3,
  Truck,
  UserCog,
  Wrench,
  KeyRound,
} from "lucide-react";
import { LogoMark } from "@/components/brand/LogoMark";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";
import { serviceSlugs } from "@/lib/data/categories";

const icons = {
  "operated-rental": UserCog,
  "bare-rental": KeyRound,
  "flexible-terms": Clock3,
  transport: Truck,
  maintenance: Wrench,
  "site-assessment": ClipboardCheck,
} as const;

export async function ServicesSection() {
  const t = await getTranslations("services");

  return (
    <section className="relative overflow-hidden bg-navy py-20 lg:py-28">
      {/* مجرى الزاوية على الخلفية الداكنة */}
      <LogoMark className="pointer-events-none absolute -bottom-40 -start-28 h-[560px] w-auto text-white opacity-[0.04]" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          onDark
        />

        <Stagger
          className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          staggerDelay={0.08}
        >
          {serviceSlugs.map((slug) => {
            const Icon = icons[slug];
            return (
              <StaggerItem key={slug}>
                <article className="group h-full rounded-lg border border-white/10 bg-white/[0.04] p-7 transition-all duration-300 hover:border-gold/60 hover:bg-white/[0.07]">
                  <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-gold/15 text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-navy">
                    <Icon size={23} strokeWidth={1.8} />
                  </span>
                  <h3 className="text-white text-xl mb-2.5">
                    {t(`${slug}.title`)}
                  </h3>
                  <p className="text-navy-20 leading-relaxed text-[0.95rem]">
                    {t(`${slug}.desc`)}
                  </p>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
