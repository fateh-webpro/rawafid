"use client";

import { useActionState } from "react";
import { Save, KeyRound } from "lucide-react";
import {
  changePassword,
  updateOwnName,
  type AccountState,
} from "./actions";

const field =
  "w-full rounded-lg border border-navy-20 bg-white px-4 py-2.5 text-navy outline-none focus:border-gold";

function Notice({ state }: { state: AccountState }) {
  if (state.error)
    return (
      <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
        {state.error}
      </p>
    );
  if (state.success)
    return (
      <p role="status" className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
        {state.success}
      </p>
    );
  return null;
}

export function AccountForms({ defaultName }: { defaultName: string }) {
  const [nameState, nameAction, namePending] = useActionState(
    updateOwnName,
    {} as AccountState
  );
  const [pwState, pwAction, pwPending] = useActionState(
    changePassword,
    {} as AccountState
  );

  return (
    <div className="grid max-w-2xl gap-6">
      {/* الاسم */}
      <form action={nameAction} className="rounded-xl border border-navy-20/50 bg-white p-6">
        <h2 className="mb-4 font-heading text-lg font-bold text-navy">الاسم المعروض</h2>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-navy-80">الاسم</span>
          <input type="text" name="name" defaultValue={defaultName} required className={field} />
        </label>
        <Notice state={nameState} />
        <button
          type="submit"
          disabled={namePending}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 font-heading font-bold text-white transition-colors hover:bg-navy-deep disabled:opacity-60"
        >
          <Save size={16} />
          {namePending ? "جارٍ الحفظ…" : "حفظ الاسم"}
        </button>
      </form>

      {/* كلمة المرور */}
      <form action={pwAction} className="rounded-xl border border-navy-20/50 bg-white p-6">
        <h2 className="mb-4 font-heading text-lg font-bold text-navy">تغيير كلمة المرور</h2>
        <div className="grid gap-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy-80">
              كلمة المرور الحالية
            </span>
            <input type="password" name="current" autoComplete="current-password" required className={field} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy-80">
              كلمة المرور الجديدة
            </span>
            <input type="password" name="next" autoComplete="new-password" required className={field} />
            <span className="mt-1 block text-xs text-gray">8 أحرف على الأقل</span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy-80">
              تأكيد كلمة المرور
            </span>
            <input type="password" name="confirm" autoComplete="new-password" required className={field} />
          </label>
        </div>
        <Notice state={pwState} />
        <button
          type="submit"
          disabled={pwPending}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 font-heading font-bold text-navy transition-colors hover:bg-gold-80 disabled:opacity-60"
        >
          <KeyRound size={16} />
          {pwPending ? "جارٍ التغيير…" : "تغيير كلمة المرور"}
        </button>
      </form>
    </div>
  );
}
