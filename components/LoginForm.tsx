"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { loginAction } from "@/app/db-controller/auth-actions";
import { inputCls, labelCls } from "@/components/admin/ui";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, {});

  return (
    <form action={formAction}>
      <RevealGroup stagger={0.11} delayChildren={0.15} amount={0.1}>
        <RevealItem variant="right">
          <label className={labelCls}>Email</label>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="admin@example.com"
            className={inputCls}
          />
        </RevealItem>

        <RevealItem variant="right" delay={0.06}>
          <label className={labelCls}>Password</label>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className={inputCls}
          />
        </RevealItem>

        <RevealItem variant="scale" delay={0.14} className="mt-2">
          <motion.button
            type="submit"
            disabled={pending}
            whileHover={pending ? undefined : { y: -2 }}
            whileTap={pending ? undefined : { scale: 0.98 }}
            className="w-full py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-lg disabled:opacity-50"
          >
            {pending ? "Processing..." : "Login"}
          </motion.button>
        </RevealItem>

        <Reveal variant="fade" delay={0.1} className="mt-8">
          <Link
            href="/"
            data-view-transition="back"
            className="inline-block px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-medium transition-colors"
          >
            &larr; Return to Homepage
          </Link>
        </Reveal>
      </RevealGroup>

      {/* A failed login is a response to the user's action, not part of the
          page's scroll choreography, so it animates on its own. */}
      <AnimatePresence>
        {state.error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            role="alert"
            className="mt-4 text-xs text-red-300 bg-red-950/40 border border-red-500/30 rounded-lg px-3 py-2"
          >
            {state.error}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}