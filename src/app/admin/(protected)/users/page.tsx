import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { UsersList, type UserItem } from "./UsersList";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (session.role !== "admin") redirect("/admin");

  const users = await db.user.findMany({ orderBy: { createdAt: "asc" } });
  const items: UserItem[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    isSelf: u.id === session.id,
  }));

  return (
    <div>
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">إدارة المستخدمين</h1>
          <p className="mt-1 text-gray">
            <span className="latin-nums">{items.length}</span> مستخدم
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 font-heading font-bold text-navy transition-colors hover:bg-gold-80"
        >
          <Plus size={18} />
          إضافة مستخدم
        </Link>
      </header>

      <UsersList items={items} />
    </div>
  );
}
