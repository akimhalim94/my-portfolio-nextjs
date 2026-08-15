import AdminLayout from "@/components/AdminLayout";
import ActionForm from "@/components/admin/ActionForm";
import DeleteButton from "@/components/admin/DeleteButton";
import MoveButton from "@/components/admin/MoveButton";
import ResumeTabs from "@/components/admin/ResumeTabs";
import {
  getSkills,
  createSkillAction,
  deleteSkillAction,
  moveSkillAction,
} from "@/app/db-controller/content-actions";
import { inputCls, labelCls, cardCls } from "@/components/admin/ui";

export default async function AdminSkillsPage() {
  const skills = await getSkills();

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
            ➕ Add Skill
          </h2>
          <ActionForm
            action={createSkillAction}
            submitLabel="➕ Add Skill"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div className="sm:col-span-2">
              <label className={labelCls}>Skill Name *</label>
              <input
                type="text"
                name="name"
                required
                placeholder="E.g: Next.js"
                className={inputCls}
              />
            </div>
          </ActionForm>
        </div>

        <div className={`${cardCls} space-y-3`}>
          <h2 className="text-lg font-semibold text-white mb-4">
            🚀 Skills List ({skills.length})
          </h2>

          {skills.length === 0 ? (
            <p className="text-gray-500 text-sm border border-dashed border-white/10 rounded-xl py-8 text-center">
              No skills yet.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <div
                  key={skill.id}
                  className="flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200"
                >
                  <span className="px-2 py-1 rounded-lg bg-gray-800 text-gray-300 border border-gray-700">
                    {skill.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <MoveButton
                      action={moveSkillAction.bind(null, skill.id, "up")}
                      direction="up"
                      disabled={index === 0}
                    />
                    <MoveButton
                      action={moveSkillAction.bind(null, skill.id, "down")}
                      direction="down"
                      disabled={index === skills.length - 1}
                    />
                    <DeleteButton
                      action={deleteSkillAction.bind(null, skill.id)}
                      label=""
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
