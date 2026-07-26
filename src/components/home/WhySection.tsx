import { getTranslations } from "next-intl/server";
import { Gauge, HardHat, MapPinned, Timer } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";

const pillars = [
  { key: "readiness", icon: Gauge },
  { key: "operators", icon: HardHat },
  { key: "response", icon: Timer },
  { key: "coverage", icon: MapPinned },
] as const;

export async function WhySection() {
  const t = await getTranslations("why");

  return (
    <section className="bg-cream py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />

        <Stagger
          className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
          staggerDelay={0.1}
        >
          {pillars.map(({ key, icon: Icon }) => (
            <StaggerItem key={key} className="text-center">
              <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold/50 text-navy">
                <Icon size={28} strokeWidth={1.6} className="text-gold" />
              </span>
              <h3 className="text-navy text-lg mb-2">{t(`${key}.title`)}</h3>
              <p className="text-gray text-[0.92rem] leading-relaxed">
                {t(`${key}.desc`)}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
