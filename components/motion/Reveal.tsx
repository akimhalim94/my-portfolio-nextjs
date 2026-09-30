"use client";

import {
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "framer-motion";
import { MOTION_TAGS, type ElementTag } from "@/components/motion/tags";
import { useMemo, type ReactNode } from "react";

/**
 * Scroll-reveal primitives.
 *
 * Three pieces, because a reveal tree needs three different behaviours:
 *
 * - `Reveal`     starts its own in-view trigger. Use it for any standalone
 *                block of the page.
 * - `RevealGroup` triggers once, then staggers its `RevealItem` children.
 * - `RevealItem` only contributes variants; it deliberately sets no
 *                `initial`/`animate`, so it inherits the label from the
 *                nearest ancestor group and picks up its stagger delay there.
 *
 * Every variant collapses to a plain crossfade under
 * `prefers-reduced-motion: reduce`.
 */

export type RevealVariant =
  | "fade"
  | "up"
  | "down"
  | "left"
  | "right"
  | "scale"
  | "grow"
  | "blur"
  | "clip"
  | "flip"
  | "tilt";

/** Decelerating curve: leaves fast, settles slow, reads as "arrived". */
const EASE = [0.32, 0.72, 0, 1] as const;

const TRANSITION: Record<RevealVariant, object> = {
  fade: { duration: 0.6, ease: EASE },
  up: { duration: 0.7, ease: EASE },
  down: { duration: 0.7, ease: EASE },
  left: { duration: 0.75, ease: EASE },
  right: { duration: 0.75, ease: EASE },
  scale: { type: "spring", stiffness: 240, damping: 22 },
  grow: { duration: 0.8, ease: EASE },
  blur: { duration: 0.85, ease: EASE },
  clip: { duration: 0.85, ease: EASE },
  flip: { duration: 0.8, ease: EASE },
  tilt: { duration: 0.85, ease: EASE },
};

const HIDDEN: Record<RevealVariant, object> = {
  fade: { opacity: 0 },
  up: { opacity: 0, y: 56 },
  down: { opacity: 0, y: -56 },
  left: { opacity: 0, x: 76 },
  right: { opacity: 0, x: -76 },
  scale: { opacity: 0, scale: 0.82 },
  grow: { opacity: 0, scaleX: 0.15 },
  blur: { opacity: 0, y: 30, filter: "blur(16px)" },
  clip: { opacity: 0, y: 44, clipPath: "inset(0 0 100% 0)" },
  flip: { opacity: 0, rotateX: -62, y: 40 },
  tilt: { opacity: 0, rotate: -3, scale: 0.94 },
};

const SHOWN: Record<RevealVariant, object> = {
  fade: { opacity: 1 },
  up: { opacity: 1, y: 0 },
  down: { opacity: 1, y: 0 },
  left: { opacity: 1, x: 0 },
  right: { opacity: 1, x: 0 },
  scale: { opacity: 1, scale: 1 },
  grow: { opacity: 1, scaleX: 1 },
  blur: { opacity: 1, y: 0, filter: "blur(0px)" },
  clip: { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" },
  flip: { opacity: 1, rotateX: 0, y: 0 },
  tilt: { opacity: 1, rotate: 0, scale: 1 },
};

const REDUCED_TRANSITION = { duration: 0.2, ease: "linear" } as const;

const VIEWPORT_MARGIN = "0px 0px -8% 0px";

/**
 * `clip` cannot drive the element it is applied to.
 *
 * Chrome's IntersectionObserver folds an element's *own* `clip-path` into the
 * rect it reports, so a hidden state of `inset(0 0 100% 0)` reports an
 * intersection ratio of 0 — the observer never sees the element, so
 * `whileInView` never fires and the element stays clipped away forever. A
 * 50% clip likewise reports 0.5, so no `amount` threshold can rescue it.
 *
 * The fix is to split the job in two: the outer element owns the trigger (it
 * keeps its full, unclipped box, so the observer can see it) and an inner
 * element carries the clip. The inner has `variants` but no `initial`/`animate`,
 * so it inherits the "hidden"/"show" labels from the outer exactly like a
 * `RevealItem` inherits from its group.
 *
 * The same masking cuts both ways: while the clip is closed the inner element
 * reports an empty intersection rect, so a *nested* self-triggering `Reveal`
 * inside a `clip` panel can never see itself, and Chrome does not re-fire its
 * observer when the ancestor's clip later opens. Put `RevealItem`s inside a
 * `clip` panel instead — they inherit the label and need no observer.
 */
const CLIP_TRIGGER: Variants = { hidden: {}, show: {} };

function buildClipVariants(delay: number, duration?: number): Variants {
  return {
    hidden: { y: 44, clipPath: "inset(0 0 100% 0)" },
    show: {
      y: 0,
      clipPath: "inset(0 0 0% 0)",
      transition:
        duration === undefined
          ? { duration: 0.85, ease: EASE, delay }
          : { duration, ease: EASE, delay },
    },
  } as Variants;
}

function buildVariants(
  variant: RevealVariant,
  reduced: boolean,
  delay: number,
  duration?: number,
): Variants {
  if (reduced) {
    return {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: REDUCED_TRANSITION },
    };
  }

  return {
    hidden: HIDDEN[variant],
    show: {
      ...SHOWN[variant],
      // A spring has no meaningful `duration`, so only the tween variants get
      // their speed overridden.
      transition:
        duration === undefined
          ? { ...TRANSITION[variant], delay }
          : { duration, ease: EASE, delay },
    },
  } as Variants;
}

/** How the element decides that it should play. */
type TriggerProps = {
  as?: ElementTag;
  /** Animate again every time the element re-enters the viewport. */
  repeat?: boolean;
  /** Fraction of the element that must be visible before it triggers. */
  amount?: number;
  children?: ReactNode;
};

/** How the element moves once it has been told to play. */
type MotionProps = {
  variant?: RevealVariant;
  /** Seconds to wait before it moves. */
  delay?: number;
  /** Overrides the variant's own duration. Ignored for spring variants. */
  duration?: number;
};

type OverriddenProps = Omit<
  HTMLMotionProps<"div">,
  "children" | "onAnimationComplete"
>;

export type RevealProps = TriggerProps & MotionProps & OverriddenProps;

export function Reveal({
  as = "div",
  variant = "up",
  delay = 0,
  duration,
  repeat = false,
  amount = 0.3,
  children,
  ...rest
}: RevealProps) {
  const reduced = !!useReducedMotion();
  const Tag = MOTION_TAGS[as];
  const viewport = { once: !repeat, amount, margin: VIEWPORT_MARGIN };

  // Both are built unconditionally: branching between them would change the
  // hook count if `variant` ever flipped between renders.
  const variants = useMemo(
    () => buildVariants(variant, reduced, delay, duration),
    [variant, reduced, delay, duration],
  );
  const clipVariants = useMemo(
    () => buildClipVariants(delay, duration),
    [delay, duration],
  );

  // Reduced motion has no clip to deadlock, so it keeps the single-element
  // path and crossfades like every other variant.
  if (variant === "clip" && !reduced) {
    return (
      <Tag
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={CLIP_TRIGGER}
        {...rest}
      >
        <Tag variants={clipVariants}>{children}</Tag>
      </Tag>
    );
  }

  return (
    <Tag
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={variants}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export type RevealGroupProps = TriggerProps &
  OverriddenProps & {
    /** Seconds between each child starting. */
    stagger?: number;
    /** Seconds before the first child starts. */
    delayChildren?: number;
  };

export function RevealGroup({
  as = "div",
  stagger = 0.08,
  delayChildren = 0,
  repeat = false,
  amount = 0.25,
  children,
  ...rest
}: RevealGroupProps) {
  const reduced = !!useReducedMotion();
  const Tag = MOTION_TAGS[as];
  const variants = useMemo<Variants>(
    () => ({
      hidden: {},
      show: reduced
        ? {}
        : { transition: { staggerChildren: stagger, delayChildren } },
    }),
    [reduced, stagger, delayChildren],
  );

  return (
    <Tag
      initial="hidden"
      whileInView="show"
      viewport={{ once: !repeat, amount, margin: "0px 0px -8% 0px" }}
      variants={variants}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export type RevealItemProps = MotionProps &
  Omit<
    HTMLMotionProps<"div">,
    // The trigger belongs to the group, never to the item.
    "children" | "onAnimationComplete" | "initial" | "animate" | "whileInView"
  > & {
    as?: ElementTag;
    children?: ReactNode;
  };

export function RevealItem({
  as = "div",
  variant = "up",
  delay = 0,
  duration,
  children,
  ...rest
}: RevealItemProps) {
  const reduced = !!useReducedMotion();
  const Tag = MOTION_TAGS[as];
  const variants = useMemo(
    () => buildVariants(variant, reduced, delay, duration),
    [variant, reduced, delay, duration],
  );

  return (
    <Tag variants={variants} {...rest}>
      {children}
    </Tag>
  );
}

export default Reveal;