"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2, ShieldCheck, User as UserIcon } from "lucide-react";
import { deleteUser } from "./actions";
import { cn } from "@/lib/utils";

export type UserItem = {
  id: string;
  name: string;
  email: string;
  role: string;
  isSelf: boolean;
};

export function UsersList({ items }: { items: UserItem[] }) {
  const [pending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <div className="overflow-hidden rounded-xl border border-navy-20/50 bg-white">
      {items.map((u, i) => (
        <div
          key={u.id}
          className={cn(
            "flex flex-wrap items-center gap-3 px-5 py-4",
            i > 0 && "border-t border-navy-20/40"
          )}
        >
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
              u.role === "admin" ? "bg-gold text-navy" : "bg-navy text-gold"
            )}
          >
            {u.role === "admin" ? <ShieldCheck size={18} /> : <UserIcon size={18} />}
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-navy">
              {u.name}
              {u.isSelf ? <span className="mr-2 text-xs text-gold"> (أنت)</span> : null}
            </p>
            <p dir="ltr" className="truncate text-start text-sm text-gray">{u.email}</p>
          </div>

          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              u.role === "admin" ? "bg-gold/15 text-gold" : "bg-navy-20/40 text-navy-80"
            )}
          >
            {u.role === "admin" ? "مدير" : "محرر"}
          </span>

          <div className="flex items-center gap-1.5">
            <Link
              href={`/admin/users/${u.id}`}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-navy-20 text-navy hover:border-gold"
              aria-label="تعديل"
            >
              <Pencil size={14} />
            </Link>
            {u.isSelf ? null : confirmId === u.id ? (
              <span className="flex items-center gap-1">
                <button
                  onClick={() => startTransition(() => deleteUser(u.id))}
                  disabled={pending}
                  className="rounded-md bg-red-500 px-2 py-1.5 text-[0.7rem] text-white"
                >
                  تأكيد
                </button>
                <button onClick={() => setConfirmId(null)} className="text-[0.7rem] text-gray">
                  إلغاء
                </button>
              </span>
            ) : (
              <button
                onClick={() => setConfirmId(u.id)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-navy-20 text-red-500 hover:border-red-400"
                aria-label="حذف"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
