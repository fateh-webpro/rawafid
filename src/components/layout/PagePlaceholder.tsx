import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LogoMark } from "@/components/brand/LogoMark";
import { Reveal } from "@/components/motion/Reveal";
import { buttonClasses } from "@/components/ui/Button";

/** غلاف مؤقت للصفحات قيد الإنشاء — بترويسة كحلية تحمل هوية الموقع */
export async function PagePlaceholder({ title }: { title: string }) {
  const t = await getTranslations("common");

  return (
    <main>
      <section className="relative overflow-hidden bg-navy-deep pt-40 pb-24 text-center">
        <LogoMark className="pointer-events-none absolute -top-20 -end-16 h-[340px] w-auto text-white opacity-[0.05]" />
        <Reveal>
          <h1 className="text-4xl md:text-5xl text-white">{title}</h1>
          <span className="mx-auto mt-6 block h-1.5 w-1.5 rotate-45 bg-gold" aria-hidden />
        </Reveal>
      </section>
      <section className="bg-cream py-24 text-center">
        <Reveal>
          <p className="text-gray text-lg mb-8">{t("comingSoon")}</p>
          <Link href="/" className={buttonClasses("navy")}>
            {t("backHome")}
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
