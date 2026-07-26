import { baseFlat, getContentOverrides } from "@/lib/content";
import { ContentEditor, type ContentRow } from "./ContentEditor";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const arBase = baseFlat("ar");
  const enBase = baseFlat("en");
  const [arOv, enOv] = await Promise.all([
    getContentOverrides("ar"),
    getContentOverrides("en"),
  ]);

  const rows: ContentRow[] = Object.keys(arBase).map((key) => ({
    key,
    section: key.split(".")[0],
    ar: arOv[key] ?? arBase[key],
    en: enOv[key] ?? enBase[key] ?? "",
  }));

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-navy">نصوص الموقع</h1>
        <p className="mt-1 text-gray">
          عدّل أي نص في الموقع بالعربي والإنجليزي. اضغط على القسم لفتحه، والتغييرات تظهر على الموقع فور الحفظ.
        </p>
      </header>
      <ContentEditor rows={rows} />
    </div>
  );
}
