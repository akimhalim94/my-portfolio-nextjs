import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import ActionForm from "@/components/admin/ActionForm";
import DeleteButton from "@/components/admin/DeleteButton";
import MoveButton from "@/components/admin/MoveButton";
import ResumeTabs from "@/components/admin/ResumeTabs";
import {
  getExperience,
  createExperienceAction,
  deleteExperienceAction,
  moveExperienceAction,
} from "@/app/db-controller/content-actions";
import { inputCls, labelCls, cardCls } from "@/components/admin/ui";

export default async function AdminExperiencePage() {
  const experience = await getExperience();

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className={cardCls}>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            📄 Resume
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Manage all content on the /resume page.
          </p>
        </div>

        <ResumeTabs />

        <div className={cardCls}>
          <h2 className="text-lg font-semibold text-white mb-4">
            ➕ Add Experience
          </h2>
          <ActionForm
            action={createExperienceAction}
            submitLabel="➕ Add Experience"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label className={labelCls}>Job Title *</label>
              <input
                type="text"
                name="title"
                required
                placeholder="E.g: Administrative Assistant (N1)"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Period *</label>
              <input
                type="text"
                name="period"
                required
                placeholder="E.g: Jun 2020 - Present"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Company *</label>
              <input
                type="text"
                name="company"
                required
                placeholder="E.g: MOHE & Department of Wildlife"
                className={inputCls}
              />
            </div>
            <div className="flex items-end pb-3">
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="isLatest"
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
                rows={4}
                className={`${inputCls} resize-none`}
                placeholder={"One highlight per line..."}
              />
            </div>
          </ActionForm>
        </div>

        <div className={`${cardCls} space-y-3`}>
          <h2 className="text-lg font-semibold text-white mb-4">
            💼 Experience List ({experience.length})
          </h2>

          {experience.length === 0 ? (
            <p className="text-gray-500 text-sm border border-dashed border-white/10 rounded-xl py-8 text-center">
              No experience entries yet.
            </p>
          ) : (
            experience.map((job, index) => (
              <div
                key={job.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                      {job.period}
                    </span>
                    {job.isLatest && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-950 text-green-300 border border-green-800">
                        Latest
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-white mt-2 truncate">
                    {job.title}
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-1 truncate">
                    {job.company} • {job.highlights.length} highlights
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <MoveButton
                    action={moveExperienceAction.bind(null, job.id, "up")}
                    direction="up"
                    disabled={index === 0}
                  />
                  <MoveButton
                    action={moveExperienceAction.bind(null, job.id, "down")}
                    direction="down"
                    disabled={index === experience.length - 1}
                  />
                  <Link
                    href={`/admin/resume/experience/${job.id}`}
                    className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-medium transition-all"
                  >
                    ✏️ Edit
                  </Link>
                  <DeleteButton
                    action={deleteExperienceAction.bind(null, job.id)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
