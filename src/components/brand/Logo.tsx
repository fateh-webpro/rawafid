import { cn } from "@/lib/utils";
import { LogoMark } from "./LogoMark";

/** الشعار الرسمي: الرمز + الاسم العربي واللاتيني مع الفاصل */
export function Logo({
  locale,
  className,
  markClassName,
  onDark = false,
}: {
  locale: string;
  className?: string;
  markClassName?: string;
  onDark?: boolean;
}) {
  const isAr = locale === "ar";
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <LogoMark
        className={cn("h-9 w-auto text-gold shrink-0", markClassName)}
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading font-bold text-[1.05rem]",
            onDark ? "text-white" : "text-navy"
          )}
        >
          {isAr ? "روافد سبأ المحدودة" : "RAWAFID SABA"}
        </span>
        <span
          dir="ltr"
          className={cn(
            "latin-nums text-[0.55rem] tracking-[0.22em] mt-1.5",
            onDark ? "text-navy-40" : "text-gray"
          )}
        >
          {isAr ? "RAWAFID SABA CO. LTD." : "CO. LTD. — SINCE 2018"}
        </span>
      </span>
    </span>
  );
}
