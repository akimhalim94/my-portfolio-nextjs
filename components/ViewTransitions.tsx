"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const SAFETY_TIMEOUT = 2500;

// Wraps client-side navigations in the browser's View Transitions API so
// page changes animate instead of swapping instantly. Next.js's router push
// does not return a promise here, so the transition waits for the pathname
// to change (the signal that the new route has committed) before capturing
// the new state.
export default function ViewTransitions() {
  const pathname = usePathname();
  const resolveRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    resolveRef.current?.();
    resolveRef.current = null;
  }, [pathname]);

  useEffect(() => {
    if (typeof document === "undefined" || !("startViewTransition" in document)) {
      return;
    }

    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const target = e.target as Element | null;
      const link = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      if (link.target && link.target !== "_self") return;
      if (link.hasAttribute("download")) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      const direction = link.getAttribute("data-view-transition");
      if (direction === "forward" || direction === "back") {
        document.documentElement.classList.add(`vt-${direction}`);
      }

      const transition = document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            resolveRef.current = resolve;
            const timer = window.setTimeout(finish, SAFETY_TIMEOUT);
            function finish() {
              window.clearTimeout(timer);
              if (resolveRef.current === resolve) resolveRef.current = null;
              resolve();
            }
          })
      );
      transition.finished.finally(() => {
        document.documentElement.classList.remove("vt-forward", "vt-back");
      });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
