import { redirect } from "@/i18n/navigation";

/**
 * مركز التحميل أُلغي من الموقع (بقرار صاحب المشروع).
 * تبقى الصفحة كإعادة توجيه للرئيسية تفاديًا لروابط قديمة مفهرسة.
 */
export default async function DownloadsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/", locale });
}
