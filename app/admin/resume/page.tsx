import AdminLayout from "@/components/AdminLayout";
import ActionForm from "@/components/admin/ActionForm";
import ResumeTabs from "@/components/admin/ResumeTabs";
import {
  getContentSettings,
  updateResumeProfileAction,
} from "@/app/db-controller/content-actions";
import { inputCls, labelCls, cardCls } from "@/components/admin/ui";

export default async function AdminResumePage() {
  const settings = await getContentSettings();

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
            👤 Profile & Summary
          </h2>
          <ActionForm
            action={updateResumeProfileAction}
            submitLabel="💾 Save Profile"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label className={labelCls}>Name *</label>
              <input
                type="text"
                name="resume_name"
                defaultValue={settings.resume_name}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Job Title / Role *</label>
              <input
                type="text"
                name="resume_role"
                defaultValue={settings.resume_role}
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Summary *</label>
              <textarea
                name="resume_summary"
                rows={6}
                defaultValue={settings.resume_summary}
                className={`${inputCls} resize-none`}
              />
            </div>
            <div>
              <label className={labelCls}>Location</label>
              <input
                type="text"
                name="resume_location"
                defaultValue={settings.resume_location}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Website text (display)</label>
              <input
                type="text"
                name="resume_website_text"
                defaultValue={settings.resume_website_text}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>URL Website</label>
              <input
                type="url"
                name="resume_website_url"
                defaultValue={settings.resume_website_url}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>GitHub text (display)</label>
              <input
                type="text"
                name="resume_github_text"
                defaultValue={settings.resume_github_text}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>URL GitHub</label>
              <input
                type="url"
                name="resume_github_url"
                defaultValue={settings.resume_github_url}
                className={inputCls}
              />
            </div>
          </ActionForm>
        </div>
      </div>
    </AdminLayout>
  );
}
