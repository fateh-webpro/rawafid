"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2, Eye, EyeOff, CheckCircle2, Clock } from "lucide-react";
import { setEquipmentStatus, deleteEquipment } from "./actions";
import { cn } from "@/lib/utils";

export type EquipItem = {
  id: string;
  nameAr: string;
  image: string;
  status: string;
  categoryName: string;
  categorySlug: string;
};

const STATUS: Record<string, { label: string; cls: string; icon: typeof Eye }> = {
  available: { label: "متاح", cls: "bg-green-100 text-green-800", icon: CheckCircle2 },
  rented: { label: "مؤجَّر", cls: "bg-amber-100 text-amber-800", icon: Clock },
  hidden: { label: "مخفي", cls: "bg-gray-200 text-gray-600", icon: EyeOff },
};

export function EquipmentList({ items }: { items: EquipItem[] }) {
  const [pending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const grouped = items.reduce<Record<string, EquipItem[]>>((acc, it) => {
    (acc[it.categoryName] ??= []).push(it);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-8">
      {Object.entries(grouped).map(([cat, list]) => (
        <section key={cat}>
          <h2 className="mb-3 font-heading text-lg font-bold text-navy">
            {cat} <span className="latin-nums text-sm text-gray">({list.length})</span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((it) => {
              const st = STATUS[it.status] ?? STATUS.available;
              const StIcon = st.icon;
              return (
                <article
                  key={it.id}
                  className="flex gap-3 rounded-xl border border-navy-20/50 bg-white p-3"
                >
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-cream">
                    <Image src={it.image} alt={it.nameAr} fill sizes="96px" className="object-cover" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="truncate font-medium text-navy">{it.nameAr}</p>
                    <span className={cn("mt-1 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[0.68rem] font-medium", st.cls)}>
                      <StIcon size={11} /> {st.label}
                    </span>

                    <div className="mt-auto flex items-center gap-1.5 pt-2">
                      <Link
                        href={`/admin/equipment/${it.id}`}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-navy-20 text-navy hover:border-gold"
                        aria-label="تعديل"
                      >
                        <Pencil size={13} />
                      </Link>
                      {it.status !== "hidden" ? (
                        <button
                          onClick={() => startTransition(() => setEquipmentStatus(it.id, "hidden"))}
                          disabled={pending}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-navy-20 text-navy hover:border-gold"
                          aria-label="إخفاء"
                        >
                          <EyeOff size={13} />
                        </button>
                      ) : (
                        <button
                          onClick={() => startTransition(() => setEquipmentStatus(it.id, "available"))}
                          disabled={pending}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-navy-20 text-navy hover:border-gold"
                          aria-label="إظهار"
                        >
                          <Eye size={13} />
                        </button>
                      )}
                      {confirmId === it.id ? (
                        <span className="flex items-center gap-1">
                          <button
                            onClick={() => startTransition(() => deleteEquipment(it.id))}
                            className="rounded-md bg-red-500 px-2 py-1 text-[0.68rem] text-white"
                          >
                            تأكيد الحذف
                          </button>
                          <button
                            onClick={() => setConfirmId(null)}
                            className="text-[0.68rem] text-gray"
                          >
                            إلغاء
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setConfirmId(it.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-navy-20 text-red-500 hover:border-red-400"
                          aria-label="حذف"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
