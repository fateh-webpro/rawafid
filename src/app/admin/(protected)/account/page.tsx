import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AccountForms } from "./AccountForms";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-navy">حسابي</h1>
        <p dir="ltr" className="latin-nums mt-1 text-start text-sm text-gray">
          {session.email}
        </p>
      </header>
      <AccountForms defaultName={session.name} />
    </div>
  );
}
