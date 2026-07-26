import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { quoteSchema } from "@/lib/schemas/quote";
import { sendQuoteEmail } from "@/lib/email";
import { getSettings } from "@/lib/settings";

// حد بسيط لمعدل الطلبات لكل IP (في الذاكرة — كافٍ للتطوير)
const hits = new Map<string, { count: number; ts: number }>();
const WINDOW = 60_000;
const MAX = 8;

function limited(ip: string) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.ts > WINDOW) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX;
}

const CATEGORY_AR: Record<string, string> = {
  forklifts: "رافعات شوكية",
  "mobile-cranes": "موبايل كرين",
  "jcb-backhoes": "حفارات JCB",
  bobcats: "بوبكات",
  "scissor-lifts": "سيزر لفت",
  "man-lifts": "مانلفت",
  "tower-lights": "تاور لايت",
  telehandlers: "تليهاندلر",
  other: "أخرى",
};
const DURATION_AR: Record<string, string> = {
  daily: "يومي",
  weekly: "أسبوعي",
  monthly: "شهري",
  unspecified: "غير محدد",
};

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });
  }

  const d = parsed.data;
  // مصيدة السبام: إن امتلأ الحقل المخفي، تجاهل بصمت مع نجاح ظاهري
  if (d.website) {
    return NextResponse.json({ ok: true });
  }

  const locale =
    typeof (body as { locale?: unknown })?.locale === "string"
      ? (body as { locale: string }).locale
      : "ar";

  try {
    const quote = await db.quoteRequest.create({
      data: {
        name: d.name,
        phone: d.phone,
        company: d.company || null,
        category: d.category,
        duration: d.duration,
        city: d.city,
        details: d.details || null,
        locale: locale === "en" ? "en" : "ar",
      },
    });

    // إشعار بريدي (يعمل عند ضبط SMTP + بريد الاستقبال)
    const settings = await getSettings();
    const to = settings["quotes.notifyEmail"] || settings["contact.email"];
    if (to) {
      // لا نُعطّل الاستجابة على فشل البريد
      void sendQuoteEmail(to, {
        name: d.name,
        phone: d.phone,
        company: d.company,
        categoryLabel: CATEGORY_AR[d.category] ?? d.category,
        durationLabel: DURATION_AR[d.duration] ?? d.duration,
        city: d.city,
        details: d.details,
      });
    }

    return NextResponse.json({ ok: true, id: quote.id });
  } catch {
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}
