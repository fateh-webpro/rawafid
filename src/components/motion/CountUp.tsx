"use client";

import { useEffect, useRef } from "react";
import {
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

/** عدّاد تصاعدي يعمل عند الظهور — الأرقام بخط Montserrat وفق قاعدة الهوية */
export function CountUp({
  value,
  prefix = "",
  suffix = "+",
  className,
  duration = 2,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  });

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => {
    if (reduce) {
      if (ref.current)
        ref.current.textContent = `${prefix}${value.toLocaleString("en-US")}${suffix}`;
      return;
    }
    return spring.on("change", (latest) => {
      if (ref.current)
        ref.current.textContent = `${prefix}${Math.round(latest).toLocaleString("en-US")}${suffix}`;
    });
  }, [spring, prefix, suffix, value, reduce]);

  return (
    <span
      ref={ref}
      className={cn("latin-nums tabular-nums", className)}
      aria-label={`${prefix}${value}${suffix}`}
    >
      {reduce ? `${prefix}${value.toLocaleString("en-US")}${suffix}` : `${prefix}0${suffix}`}
    </span>
  );
}
