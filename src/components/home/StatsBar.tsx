import { getTranslations } from "next-intl/server";
import { CountUp } from "@/components/motion/CountUp";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { getSettings, num } from "@/lib/settings";

/** شريط الأرقام — عدادات تصاعدية بخط Montserrat */
export async function StatsBar() {
  const t = await getTranslations("stats");
  const s = await getSettings();

  const items = [
    { label: t("founded"), value: num(s, "stats.foundedYear", 10), suffix: "+" },
    { label: t("equipment"), value: num(s, "stats.equipment", 273), suffix: "+" },
    { label: t("projects"), value: num(s, "stats.projects", 732), suffix: "+" },
    { label: t("clients"), value: num(s, "stats.clients", 245), suffix: "+" },
  ];

  return (
    <section className="border-b border-navy-20/40 bg-cream">
      <Stagger
        className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4 px-5 lg:px-8"
        staggerDelay={0.1}
      >
        {items.map(({ label, value, suffix }, i) => (
          <StaggerItem
            key={label}
            className={
              "flex flex-col items-center gap-2 py-10 lg:py-12 " +
              (i > 0 ? "lg:border-s lg:border-navy-20/40" : "")
            }
          >
            <CountUp
              value={value}
              suffix={suffix}
              className="text-4xl lg:text-[2.75rem] font-bold text-navy"
            />
            <span className="text-sm text-gray">{label}</span>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
