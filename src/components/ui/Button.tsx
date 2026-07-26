import { cn } from "@/lib/utils";

type Variant = "gold" | "navy" | "outline-light" | "outline-navy" | "whatsapp";

const styles: Record<Variant, string> = {
  gold: "bg-gold text-navy hover:bg-gold-80 shadow-[0_4px_20px_-4px_rgba(196,154,91,0.45)]",
  navy: "bg-navy text-white hover:bg-navy-deep",
  "outline-light":
    "border border-white/30 text-white hover:border-gold hover:text-gold",
  "outline-navy":
    "border border-navy/25 text-navy hover:border-gold hover:text-navy",
  whatsapp: "bg-[#1faa53] text-white hover:bg-[#178f45]",
};

/** زر العلامة: انتقالات 200ms + انكماش خفيف عند الضغط */
export function buttonClasses(variant: Variant = "gold", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2.5 rounded-md px-7 py-3.5",
    "font-heading font-bold text-[0.95rem] leading-none cursor-pointer",
    "transition-all duration-200 ease-out active:scale-[0.97]",
    "focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-3",
    styles[variant],
    className
  );
}
