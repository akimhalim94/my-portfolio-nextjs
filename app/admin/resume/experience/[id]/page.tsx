import Link from "next/link";
import { notFound } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import ActionForm from "@/components/admin/ActionForm";
import ResumeTabs from "@/components/admin/ResumeTabs";
import {
  getExperience,
  updateExperienceAction,
} from "@/app/db-controller/content-actions";
import { inputCls, labelCls, cardCls } from "@/components/admin/ui";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function AdminExperienceEditPage({ params }: PageProps) {
  const { id } = await params;
  const experience = await getExperience();
  const job = experience.find((e) => e.id === id);

  if (!job) notFound();

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className={cardCls}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              ✏️ Edit Experience
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Update work experience information.
            </p>
          </div>
          <Link
            href="/admin/resume/experience"
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl text-xs font-medium transition-all"
          >
            &larr; Back
          </Link>
        </div>

        <ResumeTabs />

        <div className={cardCls}>
          <ActionForm
            action={updateExperienceAction}
            submitLabel="💾 Save Changes"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <input type="hidden" name="id" value={job.id} />
            <div>
              <label className={labelCls}>Job Title *</label>
              <input
                type="text"
                name="title"
                required
                defaultValue={job.title}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Period *</label>
              <input
                type="text"
                name="period"
                required
                defaultValue={job.period}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Company *</label>
              <input
                type="text"
                name="company"
                required
                defaultValue={job.company}
                className={inputCls}
              />
            </div>
            <div className="flex items-end pb-3">
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="isLatest"
                  defaultChecked={job.isLatest}
                  className="w-4 h-4 accent-blue-500"
                />
                Latest job
              </label>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>
                Highlights (one per line)
              </label>
              <textarea
                name="highlights"
                rows={5}
                defaultValue={job.highlights.join("\n")}
                className={`${inputCls} resize-none`}
              />
            </div>
          </ActionForm>
        </div>
      </div>
    </AdminLayout>
  );
}
