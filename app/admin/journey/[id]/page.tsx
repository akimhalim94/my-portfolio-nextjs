import Link from "next/link";
import { notFound } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import ActionForm from "@/components/admin/ActionForm";
import {
  getJourneys,
  updateJourneyAction,
} from "@/app/db-controller/content-actions";
import { inputCls, labelCls, cardCls } from "@/components/admin/ui";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function AdminJourneyEditPage({ params }: PageProps) {
  const { id } = await params;
  const journeys = await getJourneys();
  const journey = journeys.find((j) => j.id === id);

  if (!journey) notFound();

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className={cardCls}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              ✏️ Edit Journey
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Update the timeline entry.
            </p>
          </div>
          <Link
            href="/admin/journey"
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl text-xs font-medium transition-all"
          >
            &larr; Back
          </Link>
        </div>

        <div className={cardCls}>
          <ActionForm
            action={updateJourneyAction}
            submitLabel="💾 Save Changes"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <input type="hidden" name="id" value={journey.id} />
            <div>
              <label className={labelCls}>Year *</label>
              <input
                type="text"
                name="year"
                required
                defaultValue={journey.year}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Status *</label>
              <input
                type="text"
                name="status"
                required
                defaultValue={journey.status}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Type *</label>
              <select
                name="type"
                required
                defaultValue={journey.type}
                className={inputCls}
              >
                <option value="Education">Education</option>
                <option value="Project">Project</option>
                <option value="Work">Work</option>
                <option value="Industrial">Industrial</option>
                <option value="Academic">Academic</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Tech (separate with commas)</label>
              <input
                type="text"
                name="tech"
                defaultValue={journey.tech.join(", ")}
                className={inputCls}
                placeholder="E.g: Next.js, React, Tailwind"
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Title *</label>
              <input
                type="text"
                name="title"
                required
                defaultValue={journey.title}
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Description *</label>
              <textarea
                name="description"
                required
                rows={5}
                defaultValue={journey.description}
                className={`${inputCls} resize-none`}
              />
            </div>
          </ActionForm>
        </div>
      </div>
    </AdminLayout>
  );
}
