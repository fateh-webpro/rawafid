"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2, Eye, EyeOff, Package } from "lucide-react";
import { toggleCategoryHidden, deleteCategory } from "./actions";

export type CatItem = {
  id: string;
  slug: string;
  nameAr: string;
  image: string;
  hidden: boolean;
  count: number;
};

export function CategoriesList({ items }: { items: CatItem[] }) {
  const [pending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const doDelete = (id: string) =>
    startTransition(async () => {
      const res = await deleteCategory(id);
      if (res?.error) setError(res.error);
      else setConfirmId(null);
    });

  return (
    <div>
      {error ? (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <article key={c.id} className="flex gap-3 rounded-xl border border-navy-20/50 bg-white p-3">
            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-cream">
              {c.image ? (
                <Image src={c.image} alt={c.nameAr} fill sizes="96px" className="object-cover" />
              ) : (
                <span className="flex h-full items-center justify-center text-navy-40"><Package size={22} /></span>
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="truncate font-medium text-navy">{c.nameAr}</p>
              <p className="text-xs text-gray">
                <span className="latin-nums">{c.count}</span> معدة
                {c.hidden ? <span className="text-amber-600"> · مخفية</span> : null}
              </p>
              <div className="mt-auto flex items-center gap-1.5 pt-2">
                <Link href={`/admin/categories/${c.id}`} className="flex h-7 w-7 items-center justify-center rounded-md border border-navy-20 text-navy hover:border-gold" aria-label="تعديل">
                  <Pencil size={13} />
                </Link>
                <button
                  onClick={() => startTransition(() => toggleCategoryHidden(c.id, !c.hidden))}
                  disabled={pending}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-navy-20 text-navy hover:border-gold"
                  aria-label={c.hidden ? "إظهار" : "حجب"}
                >
                  {c.hidden ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
                {confirmId === c.id ? (
                  <span className="flex items-center gap-1">
                    <button onClick={() => doDelete(c.id)} disabled={pending} className="rounded-md bg-red-500 px-2 py-1 text-[0.68rem] text-white">تأكيد</button>
                    <button onClick={() => { setConfirmId(null); setError(null); }} className="text-[0.68rem] text-gray">إلغاء</button>
                  </span>
                ) : (
                  <button onClick={() => { setConfirmId(c.id); setError(null); }} className="flex h-7 w-7 items-center justify-center rounded-md border border-navy-20 text-red-500 hover:border-red-400" aria-label="حذف">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
