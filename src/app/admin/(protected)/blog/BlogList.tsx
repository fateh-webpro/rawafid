"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2, Eye, EyeOff, Newspaper } from "lucide-react";
import { togglePostPublish, deletePost } from "./actions";
import { cn } from "@/lib/utils";

export type PostItem = {
  id: string;
  titleAr: string;
  slug: string;
  published: boolean;
  date: string;
};

export function BlogList({ items }: { items: PostItem[] }) {
  const [pending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <div className="overflow-hidden rounded-xl border border-navy-20/50 bg-white">
      {items.map((p, i) => (
        <div key={p.id} className={cn("flex flex-wrap items-center gap-3 px-5 py-4", i > 0 && "border-t border-navy-20/40")}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy text-gold">
            <Newspaper size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-navy">{p.titleAr}</p>
            <p dir="ltr" className="latin-nums truncate text-start text-xs text-gray">/{p.slug} · {p.date}</p>
          </div>
          <span className={cn("rounded-full px-3 py-1 text-xs font-medium", p.published ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600")}>
            {p.published ? "منشور" : "مسودة"}
          </span>
          <div className="flex items-center gap-1.5">
            <Link href={`/admin/blog/${p.id}`} className="flex h-8 w-8 items-center justify-center rounded-md border border-navy-20 text-navy hover:border-gold" aria-label="تعديل">
              <Pencil size={14} />
            </Link>
            <button
              onClick={() => startTransition(() => togglePostPublish(p.id, !p.published))}
              disabled={pending}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-navy-20 text-navy hover:border-gold"
              aria-label={p.published ? "إلغاء النشر" : "نشر"}
            >
              {p.published ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            {confirmId === p.id ? (
              <span className="flex items-center gap-1">
                <button onClick={() => startTransition(() => deletePost(p.id))} className="rounded-md bg-red-500 px-2 py-1.5 text-[0.7rem] text-white">تأكيد</button>
                <button onClick={() => setConfirmId(null)} className="text-[0.7rem] text-gray">إلغاء</button>
              </span>
            ) : (
              <button onClick={() => setConfirmId(p.id)} className="flex h-8 w-8 items-center justify-center rounded-md border border-navy-20 text-red-500 hover:border-red-400" aria-label="حذف">
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
