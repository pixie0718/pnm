import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import BlogForm from "@/components/admin/BlogForm";

export default async function NewBlogPostPage() {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");

  return <BlogForm />;
}
