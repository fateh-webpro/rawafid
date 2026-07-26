import { redirect } from "next/navigation";
import Link from "next/link";
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
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { LogoMark } from "@/components/brand/LogoMark";
import { AdminNav } from "./AdminNav";
import { LogoutButton } from "./LogoutButton";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const newQuotes = await db.quoteRequest.count({ where: { status: "new" } });

  const nav = [
    { href: "/admin", label: "الرئيسية", icon: "dashboard" as const },
    { href: "/admin/quotes", label: "الطلبات", icon: "inbox" as const, badge: newQuotes },
    { href: "/admin/categories", label: "الفئات", icon: "categories" as const },
    { href: "/admin/equipment", label: "المعدات", icon: "truck" as const },
    { href: "/admin/projects", label: "المشاريع", icon: "projects" as const },
    { href: "/admin/blog", label: "المدونة", icon: "blog" as const },
    ...(session.role === "admin"
      ? [
          { href: "/admin/content", label: "نصوص الموقع", icon: "content" as const },
          { href: "/admin/settings", label: "الإعدادات", icon: "settings" as const },
          { href: "/admin/users", label: "المستخدمون", icon: "users" as const },
        ]
      : []),
    { href: "/admin/account", label: "حسابي", icon: "account" as const },
  ];

  return (
    <div className="flex min-h-dvh">
      {/* الشريط الجانبي */}
      <aside className="hidden w-64 shrink-0 flex-col border-e border-navy-20/50 bg-navy text-white lg:flex">
        <div className="flex items-center gap-2.5 border-b border-white/10 px-6 py-5">
          <LogoMark className="h-8 w-auto text-gold" />
          <div>
            <p className="font-heading text-sm font-bold">روافد سبأ</p>
            <p dir="ltr" className="latin-nums text-[0.6rem] tracking-widest text-navy-40">
              ADMIN
            </p>
          </div>
        </div>

        <AdminNav items={nav} />

        <div className="mt-auto border-t border-white/10 p-4">
          <p className="mb-2 px-2 text-sm text-navy-20">{session.name}</p>
          <LogoutButton />
        </div>
      </aside>

      {/* المحتوى */}
      <div className="flex flex-1 flex-col">
        {/* شريط علوي للجوال */}
        <header className="flex items-center justify-between border-b border-navy-20/50 bg-navy px-5 py-3 text-white lg:hidden">
          <span className="flex items-center gap-2">
            <LogoMark className="h-7 w-auto text-gold" />
            <span className="font-heading font-bold">لوحة التحكم</span>
          </span>
          <LogoutButton compact />
        </header>

        {/* تنقّل الجوال */}
        <nav className="flex gap-1 overflow-x-auto border-b border-navy-20/50 bg-white px-3 py-2 lg:hidden">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm text-navy-80"
            >
              {n.icon === "dashboard" && <LayoutDashboard size={16} />}
              {n.icon === "inbox" && <Inbox size={16} />}
              {n.icon === "categories" && <Layers size={16} />}
              {n.icon === "truck" && <Truck size={16} />}
              {n.icon === "projects" && <FolderKanban size={16} />}
              {n.icon === "blog" && <Newspaper size={16} />}
              {n.icon === "content" && <Type size={16} />}
              {n.icon === "settings" && <Settings size={16} />}
              {n.icon === "users" && <Users size={16} />}
              {n.icon === "account" && <UserCircle size={16} />}
              {n.label}
              {n.badge ? (
                <span className="latin-nums rounded-full bg-gold px-1.5 text-[0.65rem] font-bold text-navy">
                  {n.badge}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>

        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
