import Link from "next/link";
import { notFound } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import ActionForm from "@/components/admin/ActionForm";
import ProjectImagePicker from "@/components/admin/ProjectImagePicker";
import {
  getProject,
  updateProjectAction,
} from "@/app/db-controller/content-actions";
import { inputCls, labelCls, cardCls } from "@/components/admin/ui";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function AdminProjectEditPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) notFound();

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className={cardCls}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              ✏️ Edit Project
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Update project information.
            </p>
          </div>
          <Link
            href="/admin/projects"
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl text-xs font-medium transition-all"
          >
            &larr; Back
          </Link>
        </div>

        <div className={cardCls}>
          <ActionForm
            action={updateProjectAction}
            submitLabel="💾 Save Changes"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <input type="hidden" name="id" value={project.id} />
            <div>
              <label className={labelCls}>Title *</label>
              <input
                type="text"
                name="title"
                required
                defaultValue={project.title}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Type *</label>
              <input
                type="text"
                name="type"
                required
                defaultValue={project.type}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Year *</label>
              <input
                type="text"
                name="year"
                required
                defaultValue={project.year}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Stacks (separate with commas)</label>
              <input
                type="text"
                name="stacks"
                defaultValue={project.stacks.join(", ")}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Features (separate with commas)</label>
              <input
                type="text"
                name="features"
                defaultValue={project.features.join(", ")}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Description *</label>
              <textarea
                name="description"
                required
                rows={2}
                defaultValue={project.description}
                className={`${inputCls} resize-none`}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>What&apos;s Inside</label>
              <textarea
                name="whatsInside"
                rows={3}
                defaultValue={project.whatsInside ?? ""}
                className={`${inputCls} resize-none`}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>How It&apos;s Built</label>
              <textarea
                name="howItsBuilt"
                rows={3}
                defaultValue={project.howItsBuilt ?? ""}
                className={`${inputCls} resize-none`}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Why I Built It</label>
              <textarea
                name="whyIBuiltIt"
                rows={3}
                defaultValue={project.whyIBuiltIt ?? ""}
                className={`${inputCls} resize-none`}
              />
            </div>
            <ProjectImagePicker selected={project.images} />
          </ActionForm>
        </div>
      </div>
    </AdminLayout>
  );
}
