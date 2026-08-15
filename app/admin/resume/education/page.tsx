import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import ActionForm from "@/components/admin/ActionForm";
import DeleteButton from "@/components/admin/DeleteButton";
import MoveButton from "@/components/admin/MoveButton";
import ResumeTabs from "@/components/admin/ResumeTabs";
import {
  getEducation,
  createEducationAction,
  deleteEducationAction,
  moveEducationAction,
} from "@/app/db-controller/content-actions";
import { inputCls, labelCls, cardCls } from "@/components/admin/ui";

export default async function AdminEducationPage() {
  const education = await getEducation();

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
            ➕ Add Education
          </h2>
          <ActionForm
            action={createEducationAction}
            submitLabel="➕ Add Education"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label className={labelCls}>Period *</label>
              <input
                type="text"
                name="period"
                required
                placeholder="E.g: 2024 - Present"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Degree *</label>
              <input
                type="text"
                name="degree"
                required
                placeholder="E.g: Bachelor of Computer Science"
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Description *</label>
              <textarea
                name="description"
                required
                rows={3}
                className={`${inputCls} resize-none`}
                placeholder="Education description..."
              />
            </div>
          </ActionForm>
        </div>

        <div className={`${cardCls} space-y-3`}>
          <h2 className="text-lg font-semibold text-white mb-4">
            🎓 Education List ({education.length})
          </h2>

          {education.length === 0 ? (
            <p className="text-gray-500 text-sm border border-dashed border-white/10 rounded-xl py-8 text-center">
              No education entries yet.
            </p>
          ) : (
            education.map((edu, index) => (
              <div
                key={edu.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                      {edu.period}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mt-2 truncate">
                    {edu.degree}
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">
                    {edu.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <MoveButton
                    action={moveEducationAction.bind(null, edu.id, "up")}
                    direction="up"
                    disabled={index === 0}
                  />
                  <MoveButton
                    action={moveEducationAction.bind(null, edu.id, "down")}
                    direction="down"
                    disabled={index === education.length - 1}
                  />
                  <Link
                    href={`/admin/resume/education/${edu.id}`}
                    className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-medium transition-all"
                  >
                    ✏️ Edit
                  </Link>
                  <DeleteButton
                    action={deleteEducationAction.bind(null, edu.id)}
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
