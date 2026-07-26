import "server-only";
import nodemailer from "nodemailer";

/**
 * إرسال إشعار البريد بطلب عرض سعر جديد.
 * يعمل فقط إذا ضُبطت إعدادات SMTP في متغيّرات البيئة (.env):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
 * وإلا يتجاهل الإرسال بصمت (الطلب محفوظ في قاعدة البيانات على أي حال).
 */
type QuoteEmail = {
  name: string;
  phone: string;
  company?: string | null;
  categoryLabel: string;
  durationLabel: string;
  city: string;
  details?: string | null;
};

export function emailConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
  );
}

export async function sendQuoteEmail(to: string, q: QuoteEmail): Promise<boolean> {
  if (!emailConfigured() || !to) return false;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: Number(process.env.SMTP_PORT ?? 587) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const rows = [
      ["الاسم", q.name],
      ["الجوال", q.phone],
      ["الشركة", q.company || "—"],
      ["المعدة", q.categoryLabel],
      ["المدة", q.durationLabel],
      ["المدينة", q.city],
      ["التفاصيل", q.details || "—"],
    ];

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
                  <td style="padding:12px 24px;color:#6e7480;width:110px;font-size:13px">${k}</td>
                  <td style="padding:12px 24px;color:#1c2f47;font-size:14px">${escapeHtml(v)}</td>
                </tr>`
            )
            .join("")}
        </table>
      </div>`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
      to,
      subject: `طلب عرض سعر — ${q.name} (${q.categoryLabel})`,
      replyTo: undefined,
      html,
    });
    return true;
  } catch (err) {
    console.error("sendQuoteEmail failed:", err);
    return false;
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
