import { SOCIAL_ICONS } from "@/components/icons/social";
import { cn } from "@/lib/utils";

export type Social = { id: string; name: string; url: string };

/** صف أيقونات التواصل الاجتماعي — يظهر فقط ما له رابط */
export function SocialLinks({
  socials,
  variant = "dark",
  size = 18,
  className,
}: {
  socials: Social[];
  variant?: "dark" | "light";
  size?: number;
  className?: string;
}) {
  if (socials.length === 0) return null;

  const base =
    variant === "dark"
      ? "border-white/15 text-navy-20 hover:border-gold hover:text-gold"
      : "border-navy-20 text-navy-80 hover:border-gold hover:text-gold";

  return (
    <div className={cn("flex flex-wrap gap-2.5", className)}>
      {socials.map((s) => {
        const Icon = SOCIAL_ICONS[s.id];
        return (
          <a
            key={s.id}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.name}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-200",
              base
            )}
          >
            {Icon ? <Icon size={size} /> : s.name}
          </a>
        );
      })}
    </div>
  );
}
