"use client";

import { useActionState } from "react";
import type { ActionState } from "@/app/db-controller/content-actions";
import { btnDangerCls } from "./ui";

type Action = (
  prev: ActionState,
  formData: FormData
) => Promise<ActionState>;

export default function DeleteButton({
  action,
  label = "Delete",
  confirmText = "Are you sure you want to delete this item?",
}: {
  action: Action;
  label?: string;
  confirmText?: string;
}) {
  const [, formAction, pending] = useActionState(action, {
    success: false,
  });

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
    >
      <button type="submit" disabled={pending} className={btnDangerCls}>
        {pending ? "Deleting..." : label ? `🗑 ${label}` : "🗑"}
      </button>
    </form>
  );
}
