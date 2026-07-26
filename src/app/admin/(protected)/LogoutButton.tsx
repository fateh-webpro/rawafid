"use client";

import { LogOut } from "lucide-react";
import { logoutAction } from "./actions";

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm text-navy-20 transition-colors hover:border-red-400/60 hover:text-red-300"
      >
        <LogOut size={16} />
        {compact ? null : "تسجيل الخروج"}
      </button>
    </form>
  );
}
