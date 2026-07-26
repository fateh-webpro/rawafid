import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

/** ترويسة قسم موحدة: عين ذهبية + عنوان + وصف، مع الفاصل الماسي */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  onDark = false,
  className,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={cn("mx-auto max-w-2xl text-center", className)}>
      <p className="mb-3 text-[0.8rem] font-medium tracking-[0.22em] text-gold">
        {eyebrow}
      </p>
      <h2
        className={cn(
          "text-3xl md:text-4xl",
          onDark ? "text-white" : "text-navy"
        )}
      >
        {title}
      </h2>
      <span
        className="diamond-divider mx-auto mt-5 w-40 text-gold"
        aria-hidden
      >
        <span className="block h-1.5 w-1.5 rotate-45 bg-gold" />
      </span>
      {subtitle ? (
        <p
          className={cn(
            "mt-5 leading-relaxed",
            onDark ? "text-navy-20" : "text-gray"
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  );
}
