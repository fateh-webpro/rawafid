"use client";

import { createContext, useContext } from "react";

export type SiteConfig = {
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
};

const FALLBACK: SiteConfig = {
  phone: "+966538131822",
  phoneDisplay: "+966 53 813 1822",
  whatsapp: "966538131822",
  email: "",
};

const Ctx = createContext<SiteConfig>(FALLBACK);

export function SiteConfigProvider({
  value,
  children,
}: {
  value: SiteConfig;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSiteConfig() {
  return useContext(Ctx);
}

/** رابط واتساب من رقم الإعدادات */
export function waLink(number: string, message?: string) {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
