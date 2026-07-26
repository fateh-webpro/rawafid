import { getSettings } from "@/lib/settings";
import { SettingsForm } from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const values = await getSettings();

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-navy">إعدادات الموقع</h1>
        <p className="mt-1 text-gray">
          تحكّم بنصوص الهيدر وأرقام الإنجازات ومعلومات التواصل — تظهر على الموقع فوراً بعد الحفظ.
        </p>
      </header>
      <SettingsForm values={values} />
    </div>
  );
}
