"use client";

import { useActionState } from "react";
import { changePasswordAction } from "@/app/db-controller/auth-actions";
import { inputCls, labelCls, btnPrimaryCls } from "./admin/ui";

export default function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, {});

  return (
    <form action={formAction} className="space-y-4 max-w-sm">
      <div>
        <label className={labelCls}>Current Password *</label>
        <input
          type="password"
          name="currentPassword"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className={inputCls}
        />
      </div>
      <div>
        <label className={labelCls}>New Password * (min. 8 characters)</label>
        <input
          type="password"
          name="newPassword"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="••••••••"
          className={inputCls}
        />
      </div>
      <div>
        <label className={labelCls}>Confirm New Password *</label>
        <input
          type="password"
          name="confirmPassword"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="••••••••"
          className={inputCls}
        />
      </div>

      {state.error && (
        <p className="text-xs text-red-300 bg-red-950/40 border border-red-500/30 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}
      {state.message && (
        <p className="text-xs text-green-300 bg-green-950/40 border border-green-500/30 rounded-lg px-3 py-2">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending} className={btnPrimaryCls}>
        {pending ? "Updating..." : "🔑 Update Password"}
      </button>
    </form>
  );
}
