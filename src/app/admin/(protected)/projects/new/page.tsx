import { ProjectForm } from "@/components/admin/ProjectForm";
import { createProject } from "../actions";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-navy">إضافة مشروع جديد</h1>
      <ProjectForm action={createProject} submitLabel="إضافة المشروع" />
    </div>
  );
}
