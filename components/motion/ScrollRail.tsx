"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

/** Derived from the hook's own signature so it tracks the library's type. */
type ScrollOffsets = NonNullable<
  Parameters<typeof useScroll>[0]
>["offset"];

/**
 * A vertical rail that draws itself as the section scrolls past.
 *
 * The track is static; the fill is a scaleY driven by this element's own
 * scroll progress, and the "comet" head rides the same progress value so the
 * two can never drift apart. Both use one shared spring so the fill and the
 * head decelerate together.
 *
 * Children are laid out as-is; the rail is purely decorative and sits under
 * them (`pointer-events-none`), so nothing about the caller's markup changes.
 */
export default function ScrollRail({
  children,
  className = "",
  offsets = ["start 78%", "end 65%"],
}: {
  children: ReactNode;
  className?: string;
  /** `useScroll` offsets: [when progress is 0, when progress is 1]. */
  offsets?: string[];
}) {
  const reduced = !!useReducedMotion();
  const rail = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: rail,
    offset: offsets as ScrollOffsets,
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.45,
  });

  // Growth: 0 -> 1 down the rail, anchored at the top.
  const fill = useTransform(progress, [0, 1], [0, 1]);
  // Head position along the rail, as a percentage of its height.
  const head = useTransform(progress, (value) => `${value * 100}%`);
  // Fade the head in and out so it does not park on either end of the rail.
  const headOpacity = useTransform(
    progress,
    [0, 0.03, 0.97, 1],
    [0, 1, 1, 0],
  );
  const glowOpacity = useTransform(progress, [0, 0.15, 1], [0.15, 0.6, 1]);

  return (
    <div ref={rail} className={`relative ${className}`}>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-px bg-white/10" />
      {!reduced && (
        <>
          <motion.div
            aria-hidden
            style={{ scaleY: fill, opacity: glowOpacity }}
            className="pointer-events-none absolute inset-y-0 left-0 w-px origin-top bg-gradient-to-b from-sky-300 via-indigo-400 to-purple-500"
          />
          <motion.div
            aria-hidden
            style={{ top: head, opacity: headOpacity, x: "-50%", y: "-50%" }}
            className="pointer-events-none absolute left-0 h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_18px_5px_rgba(129,140,248,0.65)]"
          />
        </>
      )}
      {children}
    </div>
  );
}