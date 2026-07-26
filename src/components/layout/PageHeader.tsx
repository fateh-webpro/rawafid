import { LogoMark } from "@/components/brand/LogoMark";
import { Reveal } from "@/components/motion/Reveal";

/** ترويسة صفحة داخلية موحدة — خلفية كحلية مع مجرى الزاوية والفاصل الماسي */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-deep pt-36 pb-20 lg:pt-40 lg:pb-24">
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(36,64,94,0.55)_0%,rgba(22,37,58,0.9)_65%)]"
        aria-hidden
      />
      <LogoMark className="pointer-events-none absolute -top-16 -end-12 h-[360px] w-auto text-white opacity-[0.05]" />

      <div className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
        <Reveal>
          <p className="mb-4 text-[0.82rem] font-medium tracking-[0.22em] text-gold">
            {eyebrow}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white">{title}</h1>
          <span className="diamond-divider mx-auto mt-6 w-44 text-gold" aria-hidden>
            <span className="block h-1.5 w-1.5 rotate-45 bg-gold" />
          </span>
          {subtitle ? (
            <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-navy-20">
              {subtitle}
            </p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
