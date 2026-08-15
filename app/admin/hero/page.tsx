import AdminLayout from "@/components/AdminLayout";
import ActionForm from "@/components/admin/ActionForm";
import { getHero, updateHeroAction } from "@/app/db-controller/content-actions";
import { inputCls, labelCls, cardCls } from "@/components/admin/ui";

export default async function AdminHeroPage() {
  const hero = await getHero();

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className={cardCls}>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            👋 Hero Section
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Manage the main heading and introduction on the homepage.
          </p>
        </div>

        <div className={cardCls}>
          <ActionForm action={updateHeroAction} submitLabel="💾 Save Hero">
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Greeting (Main Title)</label>
                <input
                  type="text"
                  name="greeting"
                  defaultValue={hero.greeting}
                  required
                  className={inputCls}
                  placeholder="E.g: Hi, I'm Akim 👋"
                />
              </div>
              <div>
                <label className={labelCls}>Description (Introduction)</label>
                <textarea
                  name="description"
                  defaultValue={hero.description}
                  required
                  rows={6}
                  className={`${inputCls} resize-none`}
                  placeholder="Write your introduction paragraph..."
                />
              </div>
            </div>
          </ActionForm>
        </div>
      </div>
    </AdminLayout>
  );
}
