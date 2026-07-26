import { PostForm } from "@/components/admin/PostForm";
import { createPost } from "../actions";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-navy">مقال جديد</h1>
      <PostForm action={createPost} submitLabel="نشر المقال" />
    </div>
  );
}
