"use client";

import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sendMessageAction } from "@/app/db-controller/server-actions";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

const inputCls =
  "w-full p-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors";

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
      {/* The status line is not part of the staggered reveal: it appears long
          after the form has been read, so it animates in on its own. */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            key="status"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            role="status"
            aria-live="polite"
            className={`p-3 mb-4 rounded-xl text-xs sm:text-sm border ${
              statusMessage.success
                ? "bg-green-950/40 border-green-500/30 text-green-300"
                : "bg-red-950/40 border-red-500/30 text-red-300"
            }`}
          >
            {statusMessage.text}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit}>
        {/* Each field rises on its own, so reading down the form feels like the
            page is handing you one question at a time. */}
        <RevealGroup
          stagger={0.11}
          delayChildren={0.1}
          amount={0.1}
          className="flex flex-col gap-4"
        >
          <RevealItem variant="right">
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="E.g: Michel"
              className={inputCls}
            />
          </RevealItem>

          <RevealItem variant="right" delay={0.05}>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Your Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="E.g: michel@example.com"
              className={inputCls}
            />
          </RevealItem>

          <RevealItem variant="up" delay={0.1}>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Your Message
            </label>
            <textarea
              name="message"
              required
              placeholder="Write your message or inquiry here..."
              rows={4}
              className={`${inputCls} resize-none`}
            />
          </RevealItem>

          <RevealItem variant="scale" delay={0.16} className="mt-2">
            <motion.button
              type="submit"
              disabled={isPending}
              whileHover={isPending ? undefined : { y: -2 }}
              whileTap={isPending ? undefined : { scale: 0.98 }}
              className="w-full py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-lg disabled:opacity-50"
            >
              {isPending ? "Sending..." : "Send Message \u2192"}
            </motion.button>
          </RevealItem>
        </RevealGroup>
      </form>
    </>
  );
}