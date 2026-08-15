import Link from "next/link";
import { notFound } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import ActionForm from "@/components/admin/ActionForm";
import ResumeTabs from "@/components/admin/ResumeTabs";
import {
  getEducation,
  updateEducationAction,
} from "@/app/db-controller/content-actions";
import { inputCls, labelCls, cardCls } from "@/components/admin/ui";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function AdminEducationEditPage({ params }: PageProps) {
  const { id } = await params;
  const education = await getEducation();
  const edu = education.find((e) => e.id === id);

  if (!edu) notFound();

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className={cardCls}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              ✏️ Edit Education
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Update education information.
            </p>
          </div>
          <Link
            href="/admin/resume/education"
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl text-xs font-medium transition-all"
          >
            &larr; Back
          </Link>
        </div>

        <ResumeTabs />

        <div className={cardCls}>
          <ActionForm
            action={updateEducationAction}
            submitLabel="💾 Save Changes"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <input type="hidden" name="id" value={edu.id} />
            <div>
              <label className={labelCls}>Period *</label>
              <input
                type="text"
                name="period"
                required
                defaultValue={edu.period}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Degree *</label>
              <input
                type="text"
                name="degree"
                required
                defaultValue={edu.degree}
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Description *</label>
              <textarea
                name="description"
                required
                rows={4}
                defaultValue={edu.description}
                className={`${inputCls} resize-none`}
              />
            </div>
          </ActionForm>
        </div>
      </div>
    </AdminLayout>
  );
}
