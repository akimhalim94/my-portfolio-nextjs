"use client";

import { useActionState } from "react";
import type { ActionState } from "@/app/db-controller/content-actions";

type Action = (
  prev: ActionState,
  formData: FormData
) => Promise<ActionState>;

export default function MoveButton({
  action,
  direction,
  disabled = false,
}: {
  action: Action;
  direction: "up" | "down";
  disabled?: boolean;
}) {
  const [, formAction, pending] = useActionState(action, { success: false });

  return (
    <form action={formAction}>
      <button
        type="submit"
        disabled={disabled || pending}
        className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs disabled:opacity-30"
        title={direction === "up" ? "Move up" : "Move down"}
      >
        {direction === "up" ? "▲" : "▼"}
      </button>
    </form>
  );
}
