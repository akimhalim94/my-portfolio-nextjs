import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import ActionForm from "@/components/admin/ActionForm";
import DeleteButton from "@/components/admin/DeleteButton";
import MoveButton from "@/components/admin/MoveButton";
import ResumeTabs from "@/components/admin/ResumeTabs";
import {
  getCertifications,
  createCertificationAction,
  deleteCertificationAction,
  moveCertificationAction,
} from "@/app/db-controller/content-actions";
import { inputCls, labelCls, cardCls } from "@/components/admin/ui";

export default async function AdminCertificationsPage() {
  const certifications = await getCertifications();

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
            ➕ Add Certification
          </h2>
          <ActionForm
            action={createCertificationAction}
            submitLabel="➕ Add Certification"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label className={labelCls}>Title *</label>
              <input
                type="text"
                name="title"
                required
                placeholder="E.g: Google Cybersecurity"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Provider *</label>
              <input
                type="text"
                name="provider"
                required
                placeholder="E.g: Coursera"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Year *</label>
              <input
                type="text"
                name="year"
                required
                placeholder="E.g: 2025"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Logo Text *</label>
              <input
                type="text"
                name="logoText"
                required
                placeholder="E.g: GOOGLE"
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Verify URL</label>
              <input
                type="url"
                name="verifyUrl"
                placeholder="https://..."
                className={inputCls}
              />
            </div>
          </ActionForm>
        </div>

        <div className={`${cardCls} space-y-3`}>
          <h2 className="text-lg font-semibold text-white mb-4">
            📜 Certifications List ({certifications.length})
          </h2>

          {certifications.length === 0 ? (
            <p className="text-gray-500 text-sm border border-dashed border-white/10 rounded-xl py-8 text-center">
              No certifications yet.
            </p>
          ) : (
            certifications.map((cert, index) => (
              <div
                key={cert.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center font-bold text-[10px] text-black shrink-0">
                    {cert.logoText}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {cert.title}
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-0.5 truncate">
                      {cert.provider} • {cert.year}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <MoveButton
                    action={moveCertificationAction.bind(null, cert.id, "up")}
                    direction="up"
                    disabled={index === 0}
                  />
                  <MoveButton
                    action={moveCertificationAction.bind(
                      null,
                      cert.id,
                      "down"
                    )}
                    direction="down"
                    disabled={index === certifications.length - 1}
                  />
                  <Link
                    href={`/admin/resume/certifications/${cert.id}`}
                    className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-medium transition-all"
                  >
                    ✏️ Edit
                  </Link>
                  <DeleteButton
                    action={deleteCertificationAction.bind(null, cert.id)}
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
