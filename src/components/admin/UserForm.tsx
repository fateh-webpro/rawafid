"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Save } from "lucide-react";
import type { UserFormState } from "@/app/admin/(protected)/users/actions";

export type UserDefaults = {
  name: string;
  email: string;
  role: string;
};

const field =
  "w-full rounded-lg border border-navy-20 bg-white px-4 py-2.5 text-navy outline-none focus:border-gold";

export function UserForm({
  action,
  defaults,
  submitLabel,
  isEdit = false,
}: {
  action: (prev: UserFormState, fd: FormData) => Promise<UserFormState>;
  defaults?: UserDefaults;
  submitLabel: string;
  isEdit?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, {} as UserFormState);

  return (
    <form action={formAction} className="max-w-lg rounded-xl border border-navy-20/50 bg-white p-6 lg:p-8">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-navy-80">الاسم *</span>
        <input type="text" name="name" defaultValue={defaults?.name} required className={field} />
      </label>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm font-medium text-navy-80">البريد الإلكتروني *</span>
        <input type="email" name="email" dir="ltr" defaultValue={defaults?.email} required className={field + " text-start"} />
      </label>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm font-medium text-navy-80">الصلاحية *</span>
        <select name="role" defaultValue={defaults?.role ?? "editor"} className={field}>
          <option value="admin">مدير (صلاحية كاملة)</option>
          <option value="editor">محرر (بدون إدارة المستخدمين)</option>
        </select>
      </label>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm font-medium text-navy-80">
          كلمة المرور {isEdit ? "(اتركها فارغة لعدم التغيير)" : "*"}
        </span>
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          required={!isEdit}
          placeholder={isEdit ? "••••••••" : ""}
          className={field}
        />
        <span className="mt-1 block text-xs text-gray">8 أحرف على الأقل</span>
      </label>

      {state.error ? (
        <p role="alert" className="mt-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      ) : null}

      <div className="mt-7 flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 font-heading font-bold text-white transition-colors hover:bg-navy-deep disabled:opacity-60"
        >
          <Save size={17} />
          {pending ? "جارٍ الحفظ…" : submitLabel}
        </button>
        <Link href="/admin/users" className="text-sm text-gray hover:text-navy">إلغاء</Link>
      </div>
    </form>
  );
}
