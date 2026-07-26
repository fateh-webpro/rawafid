import Link from "next/link";
import { Inbox, Truck, FolderKanban, TrendingUp } from "lucide-react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getSession();

  const [newQuotes, totalQuotes, wonQuotes, equipment, projects, recent] =
    await Promise.all([
      db.quoteRequest.count({ where: { status: "new" } }),
      db.quoteRequest.count(),
      db.quoteRequest.count({ where: { status: "won" } }),
      db.equipment.count(),
      db.project.count(),
      db.quoteRequest.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

  const cards = [
    { label: "طلبات جديدة", value: newQuotes, icon: Inbox, href: "/admin/quotes", accent: true },
    { label: "إجمالي الطلبات", value: totalQuotes, icon: TrendingUp, href: "/admin/quotes" },
    { label: "معدات مسجّلة", value: equipment, icon: Truck, href: "/admin/equipment" },
    { label: "مشاريع", value: projects, icon: FolderKanban, href: "/admin/projects" },
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-navy">
          مرحباً، {session?.name}
        </h1>
        <p className="mt-1 text-gray">نظرة سريعة على نشاط الموقع</p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              className={`rounded-xl border p-5 transition-all hover:-translate-y-0.5 ${
                c.accent
                  ? "border-gold/50 bg-gold/[0.08]"
                  : "border-navy-20/50 bg-white"
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    c.accent ? "bg-gold text-navy" : "bg-navy text-gold"
                  }`}
                >
                  <Icon size={20} />
                </span>
              </div>
              <p className="latin-nums text-3xl font-bold text-navy">{c.value}</p>
              <p className="mt-1 text-sm text-gray">{c.label}</p>
            </Link>
          );
        })}
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-navy">أحدث الطلبات</h2>
          <Link href="/admin/quotes" className="text-sm text-gold hover:underline">
            عرض الكل
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="rounded-xl border border-navy-20/50 bg-white p-8 text-center text-gray">
            لا توجد طلبات بعد. ستظهر هنا فور ورودها من الموقع.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-navy-20/50 bg-white">
            {recent.map((q, i) => (
              <Link
                key={q.id}
                href="/admin/quotes"
                className={`flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-cream ${
                  i > 0 ? "border-t border-navy-20/40" : ""
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-navy">{q.name}</p>
                  <p dir="ltr" className="latin-nums text-start text-xs text-gray">
                    {q.phone}
                  </p>
                </div>
                {q.status === "new" ? (
                  <span className="shrink-0 rounded-full bg-gold px-2.5 py-0.5 text-[0.7rem] font-medium text-navy">
                    جديد
                  </span>
                ) : (
                  <span className="shrink-0 text-xs text-gray">
                    {new Date(q.createdAt).toLocaleDateString("ar-SA")}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
