import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { BlogList, type PostItem } from "./BlogList";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await db.post.findMany({ orderBy: { createdAt: "desc" } });
  const items: PostItem[] = posts.map((p) => ({
    id: p.id,
    titleAr: p.titleAr,
    slug: p.slug,
    published: p.published,
    date: (p.publishedAt ?? p.createdAt).toLocaleDateString("ar-SA"),
  }));

  return (
    <div>
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">إدارة المدونة</h1>
          <p className="mt-1 text-gray"><span className="latin-nums">{items.length}</span> مقال</p>
        </div>
        <Link href="/admin/blog/new" className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 font-heading font-bold text-navy transition-colors hover:bg-gold-80">
          <Plus size={18} />
          مقال جديد
        </Link>
      </header>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-navy-20 bg-white p-12 text-center text-gray">
          لا توجد مقالات بعد. اضغط «مقال جديد» للبدء. صفحة المدونة على الموقع ستبقى بحالة «قريباً» حتى تنشر أول مقال.
        </p>
      ) : (
        <BlogList items={items} />
      )}
    </div>
  );
}
