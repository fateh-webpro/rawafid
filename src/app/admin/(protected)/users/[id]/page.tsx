import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { UserForm } from "@/components/admin/UserForm";
import { updateUser } from "../actions";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await db.user.findUnique({ where: { id } });
  if (!user) notFound();

  const action = updateUser.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-navy">تعديل المستخدم</h1>
      <UserForm
        action={action}
        defaults={{ name: user.name, email: user.email, role: user.role }}
        submitLabel="حفظ التعديلات"
        isEdit
      />
    </div>
  );
}
