import Link from "next/link";
import { notFound } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import ActionForm from "@/components/admin/ActionForm";
import ResumeTabs from "@/components/admin/ResumeTabs";
import {
  getCertifications,
  updateCertificationAction,
} from "@/app/db-controller/content-actions";
import { inputCls, labelCls, cardCls } from "@/components/admin/ui";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function AdminCertificationEditPage({
  params,
}: PageProps) {
  const { id } = await params;
  const certifications = await getCertifications();
  const cert = certifications.find((c) => c.id === id);

  if (!cert) notFound();

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className={cardCls}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              ✏️ Edit Certification
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Update certification information.
            </p>
          </div>
          <Link
            href="/admin/resume/certifications"
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl text-xs font-medium transition-all"
          >
            &larr; Back
          </Link>
        </div>

        <ResumeTabs />

        <div className={cardCls}>
          <ActionForm
            action={updateCertificationAction}
            submitLabel="💾 Save Changes"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <input type="hidden" name="id" value={cert.id} />
            <div>
              <label className={labelCls}>Title *</label>
              <input
                type="text"
                name="title"
                required
                defaultValue={cert.title}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Provider *</label>
              <input
                type="text"
                name="provider"
                required
                defaultValue={cert.provider}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Year *</label>
              <input
                type="text"
                name="year"
                required
                defaultValue={cert.year}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Logo Text *</label>
              <input
                type="text"
                name="logoText"
                required
                defaultValue={cert.logoText}
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Verify URL</label>
              <input
                type="url"
                name="verifyUrl"
                defaultValue={cert.verifyUrl ?? ""}
                className={inputCls}
              />
            </div>
          </ActionForm>
        </div>
      </div>
    </AdminLayout>
  );
}
