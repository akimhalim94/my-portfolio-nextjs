"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// The browser blocks painting for the entire duration of a view transition, so
// this is a backstop against freezing the page indefinitely, not the normal
// path. With prefetched routes the pathname updates within a frame or two.
const SAFETY_TIMEOUT = 500;

function clearDirection() {
  document.documentElement.classList.remove("vt-forward", "vt-back");
}

// Waits for the browser to lay out and paint the new route before the "new"
// snapshot is taken. Resolving the moment the pathname changes captures the DOM
// mid-update, which shows up as a flash of half-swapped content at the start of
// the animation.
function afterPaint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

// Wraps client-side navigations in the browser's View Transitions API so page
// changes animate instead of swapping instantly. Next.js's router push does not
// return a promise here, so the transition waits for the pathname to change (the
// signal that the new route has committed) before capturing the new state.
export default function ViewTransitions() {
  const pathname = usePathname();
  const finishRef = useRef<(() => void) | null>(null);
  const inFlightRef = useRef(false);
  // Identifies the current transition so a superseded one cannot undo the
  // state of the transition that replaced it.
  const idRef = useRef(0);

  useEffect(() => {
    if (!inFlightRef.current) return;
    inFlightRef.current = false;
    void afterPaint().then(() => finishRef.current?.());
  }, [pathname]);

  useEffect(() => {
    if (
      typeof document === "undefined" ||
      !("startViewTransition" in document)
    ) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      // Reduced motion is handled entirely in CSS, but starting a transition at
      // all still costs a full-viewport snapshot for no visible benefit.
      if (reducedMotion.matches) return;

      // A transition already owns the page. Starting a second one would cancel
      // the first and orphan its resolver, so let the running transition finish
      // and let Next handle this navigation without one.
      if (inFlightRef.current) return;

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

      inFlightRef.current = true;
      const id = ++idRef.current;

      let settled = false;
      let timer = 0;
      let release: () => void;

      const finish = () => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        if (finishRef.current === finish) finishRef.current = null;
        release();
      };

      // Resolved either by the pathname effect above (route committed, paint
      // settled) or by the safety timeout, whichever happens first.
      const ready = new Promise<void>((resolve) => {
        release = resolve;
      });

      const transition = document.startViewTransition(() => {
        finishRef.current = finish;
        timer = window.setTimeout(finish, SAFETY_TIMEOUT);
        return ready;
      });

      transition.finished
        .catch(() => {
          // Rejects when the transition is skipped or the callback throws.
          // The cleanup below still has to run either way.
        })
        .finally(() => {
          // A newer click already started a transition, which cancelled this
          // one. Clearing the direction class here would strip the direction off
          // the transition that replaced it, so leave its state alone.
          if (idRef.current !== id) return;
          inFlightRef.current = false;
          finishRef.current = null;
          clearDirection();
        });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
