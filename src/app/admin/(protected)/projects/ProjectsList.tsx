"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { toggleProjectPublish, deleteProject } from "./actions";
import { cn } from "@/lib/utils";

export type ProjectItem = {
  id: string;
  titleAr: string;
  tagAr: string;
  image: string;
  published: boolean;
};

export function ProjectsList({ items }: { items: ProjectItem[] }) {
  const [pending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <article key={p.id} className="overflow-hidden rounded-xl border border-navy-20/50 bg-white">
          <div className="relative aspect-[3/2]">
            <Image src={p.image} alt={p.titleAr} fill sizes="300px" className="object-cover" />
            <span
              className={cn(
                "absolute top-2 end-2 rounded-full px-2 py-0.5 text-[0.68rem] font-medium",
                p.published ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"
              )}
            >
              {p.published ? "منشور" : "مسودة"}
            </span>
          </div>
          <div className="p-3">
            <p className="truncate font-medium text-navy">{p.titleAr}</p>
            <p className="truncate text-xs text-gray">{p.tagAr}</p>
            <div className="mt-3 flex items-center gap-1.5">
              <Link
                href={`/admin/projects/${p.id}`}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-navy-20 text-navy hover:border-gold"
                aria-label="تعديل"
              >
                <Pencil size={13} />
              </Link>
              <button
                onClick={() => startTransition(() => toggleProjectPublish(p.id, !p.published))}
                disabled={pending}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-navy-20 text-navy hover:border-gold"
                aria-label={p.published ? "إلغاء النشر" : "نشر"}
              >
                {p.published ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
              {confirmId === p.id ? (
                <span className="flex items-center gap-1">
                  <button
                    onClick={() => startTransition(() => deleteProject(p.id))}
                    className="rounded-md bg-red-500 px-2 py-1 text-[0.68rem] text-white"
                  >
                    تأكيد
                  </button>
                  <button onClick={() => setConfirmId(null)} className="text-[0.68rem] text-gray">
                    إلغاء
                  </button>
                </span>
              ) : (
                <button
                  onClick={() => setConfirmId(p.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-navy-20 text-red-500 hover:border-red-400"
                  aria-label="حذف"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
