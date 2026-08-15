import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import ActionForm from "@/components/admin/ActionForm";
import DeleteButton from "@/components/admin/DeleteButton";
import MoveButton from "@/components/admin/MoveButton";
import {
  getJourneys,
  createJourneyAction,
  deleteJourneyAction,
  moveJourneyAction,
} from "@/app/db-controller/content-actions";
import { inputCls, labelCls, cardCls } from "@/components/admin/ui";

export default async function AdminJourneyPage() {
  const journeys = await getJourneys();

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className={cardCls}>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            🗺️ Journey Timeline
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Manage the &quot;The Journey &amp; Learning Phases&quot; timeline
            entries on the homepage.
          </p>
        </div>

        {/* Add Journey */}
        <div className={cardCls}>
          <h2 className="text-lg font-semibold text-white mb-4">
            ➕ Add New Entry
          </h2>
          <ActionForm
            action={createJourneyAction}
            submitLabel="➕ Add Entry"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label className={labelCls}>Year *</label>
              <input
                type="text"
                name="year"
                required
                placeholder="E.g: 2024 - Present"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Status *</label>
              <input
                type="text"
                name="status"
                required
                placeholder="E.g: Undergraduate"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Type *</label>
              <select name="type" required className={inputCls}>
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
                placeholder="E.g: Next.js, React, Tailwind"
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Title *</label>
              <input
                type="text"
                name="title"
                required
                placeholder="E.g: Bachelor of Computer Science (Hons)"
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
                placeholder="Write the entry description..."
              />
            </div>
          </ActionForm>
        </div>

        {/* Journey List */}
        <div className={`${cardCls} space-y-3`}>
          <h2 className="text-lg font-semibold text-white mb-4">
            📋 Entries List ({journeys.length})
          </h2>

          {journeys.length === 0 ? (
            <p className="text-gray-500 text-sm border border-dashed border-white/10 rounded-xl py-8 text-center">
              No journey entries yet.
            </p>
          ) : (
            journeys.map((journey, index) => (
              <div
                key={journey.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                      {journey.year}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10">
                      {journey.type}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {journey.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mt-2 truncate">
                    {journey.title}
                  </h3>
                  {journey.tech.length > 0 && (
                    <p className="text-[10px] text-gray-500 mt-1 truncate">
                      Tech: {journey.tech.join(", ")}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <MoveButton
                    action={moveJourneyAction.bind(null, journey.id, "up")}
                    direction="up"
                    disabled={index === 0}
                  />
                  <MoveButton
                    action={moveJourneyAction.bind(null, journey.id, "down")}
                    direction="down"
                    disabled={index === journeys.length - 1}
                  />
                  <Link
                    href={`/admin/journey/${journey.id}`}
                    className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-medium transition-all"
                  >
                    ✏️ Edit
                  </Link>
                  <DeleteButton
                    action={deleteJourneyAction.bind(null, journey.id)}
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
