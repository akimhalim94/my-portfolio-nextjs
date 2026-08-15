"use client";

import { useActionState } from "react";
import type { ActionState } from "@/app/db-controller/content-actions";
import { btnPrimaryCls } from "./ui";

type Action = (
  prev: ActionState,
  formData: FormData
) => Promise<ActionState>;

export default function ActionForm({
  action,
  children,
  submitLabel = "Save",
  pendingLabel = "Saving...",
  className = "",
}: {
  action: Action;
  children: React.ReactNode;
  submitLabel?: string;
  pendingLabel?: string;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {
    success: false,
  });

  return (
    <form action={formAction} className={className}>
      {children}

      {state.error && (
        <p className="text-xs text-red-300 bg-red-950/40 border border-red-500/30 rounded-lg px-3 py-2 mt-4">
          {state.error}
        </p>
      )}
      {state.success && state.message && (
        <p className="text-xs text-green-300 bg-green-950/40 border border-green-500/30 rounded-lg px-3 py-2 mt-4">
          {state.message}
        </p>
      )}

      <div className="mt-4">
        <button type="submit" disabled={pending} className={btnPrimaryCls}>
          {pending ? pendingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
