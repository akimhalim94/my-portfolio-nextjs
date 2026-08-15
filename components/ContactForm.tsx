"use client";

import { useState, useTransition } from "react";
import { sendMessageAction } from "@/app/db-controller/server-actions";

export default function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{
    success?: boolean;
    text?: string;
  } | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage(null);

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await sendMessageAction(formData);
      if (result.success) {
        setStatusMessage({ success: true, text: result.message });
        (event.target as HTMLFormElement).reset();
      } else {
        setStatusMessage({ success: false, text: result.error });
      }
    });
  }

  return (
    <>
      {statusMessage && (
        <div
          className={`p-3 mb-4 rounded-xl text-xs sm:text-sm border ${statusMessage.success ? "bg-green-950/40 border-green-500/30 text-green-300" : "bg-red-950/40 border-red-500/30 text-red-300"}`}
        >
          {statusMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            Your Name
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="E.g: Michel"
            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            Your Email
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="E.g: michel@example.com"
            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            Your Message
          </label>
          <textarea
            name="message"
            required
            placeholder="Write your message or inquiry here..."
            rows={4}
            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="mt-2 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-lg disabled:opacity-50"
        >
          {isPending ? "Sending..." : "Send Message \u2192"}
        </button>
      </form>
    </>
  );
}
