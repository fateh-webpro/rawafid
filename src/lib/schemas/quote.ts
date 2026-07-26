import { z } from "zod";

/** أرقام الجوال السعودية: 05xxxxxxxx أو 5xxxxxxxx أو +9665xxxxxxxx */
const saudiPhone = /^(?:\+?966|0)?5\d{8}$/;

export const quoteSchema = z.object({
  name: z.string().trim().min(2, "nameRequired").max(80),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, ""))
    .pipe(z.string().regex(saudiPhone, "phoneInvalid")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  category: z.string().min(1, "categoryRequired"),
  duration: z.enum(["daily", "weekly", "monthly", "unspecified"]),
  city: z.string().trim().min(2, "cityRequired").max(60),
  details: z.string().trim().max(1000).optional().or(z.literal("")),
  // مصيدة السبام — يجب أن تبقى فارغة
  website: z.string().max(0).optional().or(z.literal("")),
});

export type QuoteInput = z.infer<typeof quoteSchema>;
