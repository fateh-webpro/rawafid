"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * شريط الروافد — منحنيات مشتقة من مجاري الرمز تُرسم ذاتياً.
 * التوقيع الحركي للعلامة: مجارٍ تلتقي نحو الأعلى.
 */
const STREAMS = [
  "M -40 560 Q 240 520 420 360 Q 520 270 560 120",
  "M -40 660 Q 300 610 500 430 Q 610 330 650 160",
  "M 1240 560 Q 960 520 780 360 Q 680 270 640 120",
  "M 1240 660 Q 900 610 700 430 Q 590 330 550 160",
] as const;

export function StreamLines({
  className,
  strokeWidth = 2,
  delay = 0.3,
}: {
  className?: string;
  strokeWidth?: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <svg
      viewBox="0 0 1200 720"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none select-none", className)}
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      {STREAMS.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={reduce ? { pathLength: 1 } : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: {
              duration: 1.8,
              delay: delay + i * 0.18,
              ease: [0.65, 0, 0.35, 1],
            },
            opacity: { duration: 0.4, delay: delay + i * 0.18 },
          }}
        />
      ))}
    </svg>
  );
}
