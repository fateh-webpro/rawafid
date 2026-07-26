"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Truck,
  FolderKanban,
  Users,
  UserCircle,
  Newspaper,
  Settings,
  Type,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Item = {
  href: string;
  label: string;
  icon:
    | "dashboard"
    | "inbox"
    | "categories"
    | "truck"
    | "projects"
    | "blog"
    | "content"
    | "settings"
    | "users"
    | "account";
  badge?: number;
};

const icons = {
  dashboard: LayoutDashboard,
  inbox: Inbox,
  categories: Layers,
  truck: Truck,
  projects: FolderKanban,
  blog: Newspaper,
  content: Type,
  settings: Settings,
  users: Users,
  account: UserCircle,
};

export function AdminNav({ items }: { items: Item[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-3">
      {items.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        const Icon = icons[item.icon];
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-gold text-navy"
                : "text-navy-20 hover:bg-white/[0.06] hover:text-white"
            )}
          >
            <Icon size={18} />
            <span className="flex-1">{item.label}</span>
            {item.badge ? (
              <span
                className={cn(
                  "latin-nums rounded-full px-2 text-[0.7rem] font-bold",
                  active ? "bg-navy text-gold" : "bg-gold text-navy"
                )}
              >
                {item.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
