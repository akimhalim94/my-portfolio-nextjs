import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import ActionForm from "@/components/admin/ActionForm";
import DeleteButton from "@/components/admin/DeleteButton";
import MoveButton from "@/components/admin/MoveButton";
import ProjectImagePicker from "@/components/admin/ProjectImagePicker";
import {
  getProjects,
  getContentSettings,
  getProjectImagesInUse,
  createProjectAction,
  deleteProjectAction,
  moveProjectAction,
  updateProjectsIntroAction,
} from "@/app/db-controller/content-actions";
import { inputCls, labelCls, cardCls } from "@/components/admin/ui";

export default async function AdminProjectsPage() {
  const [projects, settings, imagesInUse] = await Promise.all([
    getProjects(),
    getContentSettings(),
    getProjectImagesInUse(),
  ]);

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className={cardCls}>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            💼 Projects
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Manage the project list on the /projects page.
          </p>
        </div>

        {/* Pengenalan Halaman Projects */}
        <div className={cardCls}>
          <h2 className="text-lg font-semibold text-white mb-4">
            📝 Projects Page Introduction
          </h2>
          <ActionForm
            action={updateProjectsIntroAction}
            submitLabel="💾 Save Introduction"
          >
            <textarea
              name="intro"
              rows={3}
              defaultValue={settings.projects_intro}
              className={`${inputCls} resize-none`}
              placeholder="Write the projects page introduction paragraph..."
            />
          </ActionForm>
        </div>

        {/* Add Project */}
        <div className={cardCls}>
          <h2 className="text-lg font-semibold text-white mb-4">
            ➕ Add New Project
          </h2>
          <ActionForm
            action={createProjectAction}
            submitLabel="➕ Add Project"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label className={labelCls}>Title *</label>
              <input
                type="text"
                name="title"
                required
                placeholder="E.g: SFC System"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Type *</label>
              <input
                type="text"
                name="type"
                required
                placeholder="E.g: CMS / Management System"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Year *</label>
              <input
                type="text"
                name="year"
                required
                placeholder="E.g: 2026"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Stacks (separate with commas)</label>
              <input
                type="text"
                name="stacks"
                placeholder="E.g: PHP, MySQL, JavaScript"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Features (separate with commas)</label>
              <input
                type="text"
                name="features"
                placeholder="E.g: CRUD, Auth, Session"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Description *</label>
              <textarea
                name="description"
                required
                rows={2}
                className={`${inputCls} resize-none`}
                placeholder="Brief project description..."
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>
                Project Link (leave blank to hide the button)
              </label>
              <input
                type="url"
                name="url"
                placeholder="https://example.com/project"
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>What&apos;s Inside</label>
              <textarea
                name="whatsInside"
                rows={3}
                className={`${inputCls} resize-none`}
                placeholder="Project content description..."
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>How It&apos;s Built</label>
              <textarea
                name="howItsBuilt"
                rows={3}
                className={`${inputCls} resize-none`}
                placeholder="Description of how the project was built..."
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Why I Built It</label>
              <textarea
                name="whyIBuiltIt"
                rows={3}
                className={`${inputCls} resize-none`}
                placeholder="Description of why the project was built..."
              />
            </div>
            <ProjectImagePicker inUse={imagesInUse} />
          </ActionForm>
        </div>

        {/* Project List */}
        <div className={`${cardCls} space-y-3`}>
          <h2 className="text-lg font-semibold text-white mb-4">
            📋 Projects List ({projects.length})
          </h2>

          {projects.length === 0 ? (
            <p className="text-gray-500 text-sm border border-dashed border-white/10 rounded-xl py-8 text-center">
              No projects yet.
            </p>
          ) : (
            projects.map((project, index) => (
              <div
                key={project.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                      {project.type}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10">
                      {project.year}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mt-2 truncate">
                    {project.title}
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-1 truncate">
                    Stacks: {project.stacks.join(", ") || "-"}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1 truncate">
                    Images: {project.images.join(", ") || "None"}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <MoveButton
                    action={moveProjectAction.bind(null, project.id, "up")}
                    direction="up"
                    disabled={index === 0}
                  />
                  <MoveButton
                    action={moveProjectAction.bind(null, project.id, "down")}
                    direction="down"
                    disabled={index === projects.length - 1}
                  />
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-medium transition-all"
                  >
                    ✏️ Edit
                  </Link>
                  <DeleteButton
                    action={deleteProjectAction.bind(null, project.id)}
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
