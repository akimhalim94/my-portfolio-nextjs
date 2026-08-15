"use client";

import { deleteMessageAction } from "@/app/db-controller/server-actions";

export default function DeleteMessageButton({
  id,
  senderName,
}: {
  id: string;
  senderName: string;
}) {
  return (
    <form
      action={deleteMessageAction.bind(null, id)}
      onSubmit={(e) => {
        if (!window.confirm(`Delete message from ${senderName}?`)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
        title="Delete message"
      >
        🗑️
      </button>
    </form>
  );
}
