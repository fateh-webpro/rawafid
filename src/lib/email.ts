import "server-only";
import nodemailer from "nodemailer";

/**
 * إرسال إشعار البريد بطلب عرض سعر جديد.
 * يعمل عند ضبط إعدادات SMTP في متغيرات البيئة (.env):
 *   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASSWORD (أو SMTP_PASS), MAIL_FROM (أو SMTP_FROM)
 * وإلا يتجاهل الإرسال بهدوء، والطلب يظل محفوظًا بنجاح في قاعدة البيانات.
 */
export type QuoteEmail = {
  name: string;
  phone: string;
  email?: string | null;
  company?: string | null;
  categoryLabel: string;
  durationLabel: string;
  city: string;
  details?: string | null;
  createdAt?: Date | string | null;
};

export function emailConfigured(): boolean {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;
  return Boolean(host && user && pass);
}

export async function sendQuoteEmail(to: string, q: QuoteEmail): Promise<boolean> {
  const recipient = to || process.env.QUOTE_NOTIFICATION_EMAIL || "info@rawafidequipment.com";
  if (!emailConfigured() || !recipient) {
    return false;
  }

  try {
    const port = Number(process.env.SMTP_PORT ?? 587);
    const secure =
      process.env.SMTP_SECURE !== undefined
        ? process.env.SMTP_SECURE === "true" || process.env.SMTP_SECURE === "1"
        : port === 465;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS,
      },
    });

    const rows: [string, string][] = [
      ["الاسم", q.name],
      ["الجوال", q.phone],
    ];

    if (q.email) {
      rows.push(["البريد الإلكتروني", q.email]);
    }
    if (q.company) {
      rows.push(["الشركة", q.company]);
    }
    rows.push(["المعدة", q.categoryLabel]);
    rows.push(["المدة", q.durationLabel]);
    rows.push(["المدينة", q.city]);
    if (q.details) {
      rows.push(["التفاصيل", q.details]);
    }

    if (q.createdAt) {
      const dateObj = typeof q.createdAt === "string" ? new Date(q.createdAt) : q.createdAt;
      const formattedDate = dateObj.toLocaleString("ar-SA", {
        timeZone: "Asia/Riyadh",
        dateStyle: "full",
        timeStyle: "short",
      });
      rows.push(["وقت إرسال الطلب", formattedDate]);
    }

    const html = `
      <div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #d2d5da;border-radius:12px;overflow:hidden">
        <div style="background:#1c2f47;color:#fff;padding:20px 24px">
          <h2 style="margin:0;font-size:18px">طلب عرض سعر جديد — روافد سبأ</h2>
        </div>
        <table style="width:100%;border-collapse:collapse">
          ${rows
            .map(
              ([k, v], i) =>
                `<tr style="background:${i % 2 ? "#faf7f1" : "#fff"}">
                  <td style="padding:12px 24px;color:#6e7480;width:120px;font-size:13px">${escapeHtml(k)}</td>
                  <td style="padding:12px 24px;color:#1c2f47;font-size:14px">${escapeHtml(v)}</td>
                </tr>`
            )
            .join("")}
        </table>
      </div>`;

    const fromAddress =
      process.env.MAIL_FROM ||
      process.env.SMTP_FROM ||
      process.env.SMTP_USER ||
      "info@rawafidequipment.com";

    await transporter.sendMail({
      from: fromAddress,
      to: recipient,
      subject: `طلب عرض سعر — ${q.name} (${q.categoryLabel})`,
      replyTo: undefined,
      html,
    });
    return true;
  } catch (err) {
    console.error("sendQuoteEmail failed (non-fatal):", err);
    return false;
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
