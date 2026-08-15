import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import ActionForm from "@/components/admin/ActionForm";
import DeleteButton from "@/components/admin/DeleteButton";
import MoveButton from "@/components/admin/MoveButton";
import {
  getSocialLinks,
  getContentSettings,
  createSocialLinkAction,
  deleteSocialLinkAction,
  moveSocialLinkAction,
  updateContactIntroAction,
} from "@/app/db-controller/content-actions";
import { inputCls, labelCls, cardCls } from "@/components/admin/ui";

export default async function AdminContactPage() {
  const [socialLinks, settings] = await Promise.all([
    getSocialLinks(),
    getContentSettings(),
  ]);

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className={cardCls}>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            📬 Contact Page
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Manage the contact page introduction and social links.
          </p>
        </div>

        {/* Pengenalan Halaman Contact */}
        <div className={cardCls}>
          <h2 className="text-lg font-semibold text-white mb-4">
            📝 Page Introduction
          </h2>
          <ActionForm
            action={updateContactIntroAction}
            submitLabel="💾 Save Introduction"
          >
            <textarea
              name="intro"
              rows={3}
              defaultValue={settings.contact_intro}
              className={`${inputCls} resize-none`}
              placeholder="Write the contact page introduction paragraph..."
            />
          </ActionForm>
        </div>

        {/* Add Social Link */}
        <div className={cardCls}>
          <h2 className="text-lg font-semibold text-white mb-4">
            ➕ Add Social Link
          </h2>
          <ActionForm
            action={createSocialLinkAction}
            submitLabel="➕ Add Link"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label className={labelCls}>Name *</label>
              <input
                type="text"
                name="name"
                required
                placeholder="E.g: LinkedIn"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>URL *</label>
              <input
                type="url"
                name="url"
                required
                placeholder="https://..."
                className={inputCls}
              />
            </div>
          </ActionForm>
        </div>

        {/* Social Links List */}
        <div className={`${cardCls} space-y-3`}>
          <h2 className="text-lg font-semibold text-white mb-4">
            🔗 Social Links List ({socialLinks.length})
          </h2>

          {socialLinks.length === 0 ? (
            <p className="text-gray-500 text-sm border border-dashed border-white/10 rounded-xl py-8 text-center">
              No social links yet.
            </p>
          ) : (
            socialLinks.map((link, index) => (
              <div
                key={link.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white truncate">
                    {link.name}
                  </h3>
                  <p className="text-[10px] text-gray-500 truncate">
                    {link.url}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <MoveButton
                    action={moveSocialLinkAction.bind(null, link.id, "up")}
                    direction="up"
                    disabled={index === 0}
                  />
                  <MoveButton
                    action={moveSocialLinkAction.bind(null, link.id, "down")}
                    direction="down"
                    disabled={index === socialLinks.length - 1}
                  />
                  <Link
                    href={`/admin/contact/${link.id}`}
                    className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-medium transition-all"
                  >
                    ✏️ Edit
                  </Link>
                  <DeleteButton
                    action={deleteSocialLinkAction.bind(null, link.id)}
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
