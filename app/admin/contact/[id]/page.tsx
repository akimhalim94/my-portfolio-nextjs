import Link from "next/link";
import { notFound } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import ActionForm from "@/components/admin/ActionForm";
import {
  getSocialLinks,
  updateSocialLinkAction,
} from "@/app/db-controller/content-actions";
import { inputCls, labelCls, cardCls } from "@/components/admin/ui";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function AdminSocialLinkEditPage({ params }: PageProps) {
  const { id } = await params;
  const socialLinks = await getSocialLinks();
  const link = socialLinks.find((l) => l.id === id);

  if (!link) notFound();

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className={cardCls}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              ✏️ Edit Social Link
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Update the social link.
            </p>
          </div>
          <Link
            href="/admin/contact"
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl text-xs font-medium transition-all"
          >
            &larr; Back
          </Link>
        </div>

        <div className={cardCls}>
          <ActionForm
            action={updateSocialLinkAction}
            submitLabel="💾 Save Changes"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <input type="hidden" name="id" value={link.id} />
            <div>
              <label className={labelCls}>Name *</label>
              <input
                type="text"
                name="name"
                required
                defaultValue={link.name}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>URL *</label>
              <input
                type="url"
                name="url"
                required
                defaultValue={link.url}
                className={inputCls}
              />
            </div>
          </ActionForm>
        </div>
      </div>
    </AdminLayout>
  );
}
