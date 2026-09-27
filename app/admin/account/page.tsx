import AdminLayout from "@/components/AdminLayout";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import { getCurrentUser } from "@/app/db-controller/auth-actions";
import { cardCls } from "@/components/admin/ui";

export default async function AdminAccountPage() {
  const user = await getCurrentUser();

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className={cardCls}>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            🔑 Account
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Signed in as{" "}
            <span className="text-white">{user ? user.email : "..."}</span>
          </p>
        </div>

        <div className={cardCls}>
          <h2 className="text-lg font-semibold text-white mb-1">
            Change Password
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mb-4">
            Pick something only you know. You stay signed in on this device,
            and the new password is required the next time you log in.
          </p>
          <ChangePasswordForm />
        </div>
      </div>
    </AdminLayout>
  );
}
