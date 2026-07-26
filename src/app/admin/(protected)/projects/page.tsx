import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { ProjectsList, type ProjectItem } from "./ProjectsList";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await db.project.findMany({ orderBy: { order: "asc" } });

  const items: ProjectItem[] = projects.map((p) => ({
    id: p.id,
    titleAr: p.titleAr,
    tagAr: p.tagAr,
    image: p.image,
    published: p.published,
  }));

  return (
    <div>
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">إدارة المشاريع</h1>
          <p className="mt-1 text-gray">
            <span className="latin-nums">{items.length}</span> مشروع
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 font-heading font-bold text-navy transition-colors hover:bg-gold-80"
        >
          <Plus size={18} />
          إضافة مشروع
        </Link>
      </header>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-navy-20 bg-white p-12 text-center text-gray">
          لا توجد مشاريع بعد. اضغط «إضافة مشروع» للبدء.
        </p>
      ) : (
        <ProjectsList items={items} />
      )}
    </div>
  );
}
