import { cn } from "@/lib/utils";

/**
 * رمز الروافد — المتجهات الأصلية الحقيقية من ملف الشعار الجاهز للطباعة،
 * مستخرجة مباشرة من مسارات PDF (صفحة النسخ اللونية الأساسية) دون أي تتبع
 * أو إعادة رسم. المسارات محفوظة حرفياً، مع تحويل دوران لاعتدال الاتجاه.
 * اللون عبر currentColor.
 */
const MARK = [
  {
    t: "matrix(.75,0,0,.75,255.5625,362.85749)",
    d: "M0 0V-5.92H23.23C38.29-5.92 52.23 8.01 58.16 25.14H49.99C43.26 10.25 32.37 0 24.52 0H0Z",
  },
  {
    t: "matrix(.75,0,0,.75,266.9775,355.65003)",
    d: "M0 0V-6.08H15.54C24.84-6.08 37.33-16.65 43.26-31.23H51.27C43.58-14.89 36.53 0 12.5 0H0Z",
  },
  {
    t: "matrix(.75,0,0,.75,284.16,357.81)",
    d: "M0 0C10.9 5.13 20.67 18.26 26.92 31.87H35.09C29.64 19.22 19.87 5.13 6.89 .64L0 0Z",
  },
  {
    t: "matrix(.75,0,0,.75,289.2075,356.61003)",
    d: "M0 0C14.9-4.32 21.95-18.89 28.84-32.51H37.17C30.44-17.61 22.91-4.32 6.89-.64L0 0Z",
  },
] as const;

export const MARK_VIEWBOX = "0 0 49.625 61.625";

export function LogoMark({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("fill-current", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <g transform="translate(381.750,-255.500) rotate(90)">
        {MARK.map(({ t, d }, i) => (
          <path key={i} transform={t} d={d} />
        ))}
      </g>
    </svg>
  );
}
