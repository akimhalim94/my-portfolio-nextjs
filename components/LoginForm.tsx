"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/app/db-controller/auth-actions";
import { inputCls, labelCls } from "@/components/admin/ui";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label className={labelCls}>Email</label>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="admin@example.com"
          className={inputCls}
        />
      </div>
      <div>
        <label className={labelCls}>Password</label>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className={inputCls}
        />
      </div>

      {state.error && (
        <p className="text-xs text-red-300 bg-red-950/40 border border-red-500/30 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-lg disabled:opacity-50"
      >
        {pending ? "Processing..." : "Login &rarr;"}
      </button>

      <div className="mt-4 text-center">
        <Link href="/" className="text-xs text-blue-400 hover:underline">
          &larr; Back to Homepage
        </Link>
      </div>
    </form>
  );
}
