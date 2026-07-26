"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { LogoMark } from "@/components/brand/LogoMark";
import { loginAction, type LoginState } from "./actions";

const initial: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initial);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-navy-deep px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <LogoMark className="h-14 w-auto text-gold" />
          <div>
            <h1 className="font-heading text-2xl font-bold text-white">
              لوحة التحكم
            </h1>
            <p dir="ltr" className="latin-nums mt-1 text-xs tracking-[0.2em] text-navy-40">
              RAWAFID SABA CO. LTD.
            </p>
          </div>
        </div>

        <form
          action={formAction}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur"
        >
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-navy-20">
              البريد الإلكتروني
            </span>
            <input
              type="email"
              name="email"
              dir="ltr"
              autoComplete="username"
              required
              className="w-full rounded-lg border border-white/15 bg-navy/40 px-4 py-3 text-start text-white outline-none transition-colors focus:border-gold"
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-1.5 block text-sm font-medium text-navy-20">
              كلمة المرور
            </span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-white/15 bg-navy/40 px-4 py-3 text-white outline-none transition-colors focus:border-gold"
            />
          </label>

          {state.error ? (
            <p role="alert" className="mt-4 rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-300">
              {state.error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3 font-heading font-bold text-navy transition-colors hover:bg-gold-80 disabled:opacity-60"
          >
            <LogIn size={18} />
            {pending ? "جارٍ الدخول…" : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </main>
  );
}
