import { UserForm } from "@/components/admin/UserForm";
import { createUser } from "../actions";

export default function NewUserPage() {
  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-navy">إضافة مستخدم جديد</h1>
      <UserForm action={createUser} submitLabel="إضافة المستخدم" />
    </div>
  );
}
