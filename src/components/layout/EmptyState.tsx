import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LogoMark } from "@/components/brand/LogoMark";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { buttonClasses } from "@/components/ui/Button";

/** حالة فارغة أنيقة للصفحات التي لم يتوفر محتواها بعد */
export async function EmptyState({
  eyebrow,
  title,
  body,
  icon,
}: {
  eyebrow: string;
  title: string;
  body: string;
  icon: React.ReactNode;
}) {
  const t = await getTranslations("emptyPage");

  return (
    <main>
      <PageHeader eyebrow={eyebrow} title={title} />
      <section className="relative overflow-hidden bg-cream py-24 lg:py-32">
        <LogoMark className="pointer-events-none absolute -bottom-24 -start-16 h-96 w-auto text-navy opacity-[0.04]" />
        <Reveal className="relative mx-auto max-w-xl px-5 text-center">
          <span className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-2xl bg-navy text-gold">
            {icon}
          </span>
          <p className="text-lg leading-relaxed text-navy-80">{body}</p>
          <Link href="/contact" className={buttonClasses("gold", "mt-8")}>
            {t("cta")}
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
