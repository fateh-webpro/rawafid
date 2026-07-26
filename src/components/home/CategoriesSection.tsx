import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Stagger, StaggerItem, Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";
import { buttonClasses } from "@/components/ui/Button";
import { categories } from "@/lib/data/categories";

export async function CategoriesSection({ locale }: { locale: string }) {
  const t = await getTranslations("categories");
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <Stagger
          className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5"
          staggerDelay={0.06}
        >
          {categories.map(({ slug, icon: Icon, image }) => (
            <StaggerItem key={slug}>
              <Link
                href={`/equipment/${slug}`}
                className="group relative block overflow-hidden rounded-lg border border-navy-20/50 bg-white transition-all duration-300 hover:border-gold hover:shadow-[0_16px_40px_-14px_rgba(28,47,71,0.3)] hover:-translate-y-1"
              >
                <span className="relative block aspect-[4/3] overflow-hidden">
                  <Image
                    src={image}
                    alt={t(slug)}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* تراكب كحلي خفيف يهدأ عند المرور */}
                  <span
                    className="absolute inset-0 bg-navy/30 transition-colors duration-300 group-hover:bg-navy/10"
                    aria-hidden
                  />
                </span>
                <span className="flex items-center gap-3 px-4 py-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-navy text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-navy">
                    <Icon size={18} strokeWidth={1.8} />
                  </span>
                  <span className="font-heading font-bold text-navy text-[0.98rem]">
                    {t(slug)}
                  </span>
                </span>
                {/* خط ذهبي ينزلق عند المرور */}
                <span
                  className="absolute bottom-0 start-0 h-[3px] w-0 bg-gold transition-all duration-300 group-hover:w-full"
                  aria-hidden
                />
              </Link>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.2} className="mt-12 text-center">
          <Link href="/equipment" className={buttonClasses("navy")}>
            {t("viewAll")}
            <Arrow size={17} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
