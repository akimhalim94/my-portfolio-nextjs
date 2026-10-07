"use client";

import {
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "framer-motion";
import { MOTION_TAGS, type ElementTag } from "@/components/motion/tags";
import { useRef, type ReactNode } from "react";

/**
 * Scroll-linked (parallax) wrapper.
 *
 * Unlike `Reveal`, nothing here has a duration: the transform is derived
 * directly from how far the element has travelled through the viewport, so it
 * tracks the scrollbar in both directions and can never be "out of sync" with
 * a one-shot transition. The value is spring-smoothed so fast flicks glide
 * instead of snapping.
 *
 * The default offset spans the element's whole journey — progress 0 when its
 * top edge reaches the bottom of the viewport, 1 when its bottom edge reaches
 * the top — so `y={[-40, 40]}` means "drift up 80px across its full passage".
 */

/** Derived from the hook's own signature so it tracks the library's type. */
type ScrollOffsets = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

type Range = number | [number, number];

/** A single number is shorthand for a symmetric travel: 40 -> [-40, 40]. */
function toRange(value: Range | undefined, fallback: [number, number]) {
  const range = value === undefined ? fallback : value;
  return typeof range === "number" ? [-range, range] : range;
}

type ParallaxProps = {
  as?: ElementTag;
  /** Vertical travel in px. A single number means [-n, n]. */
  y?: Range;
  /** Horizontal travel in px. A single number means [-n, n]. */
  x?: Range;
  scale?: Range;
  /** Gaussian blur in px, driven by scroll progress. */
  blur?: Range;
  opacity?: Range;
  /** `useScroll` offsets. Rarely needs changing. */
  offset?: ScrollOffsets;
  stiffness?: number;
  damping?: number;
  mass?: number;
  className?: string;
  children?: ReactNode;
} & Omit<HTMLMotionProps<"div">, "children" | "style">;

export default function Parallax({
  as = "div",
  y,
  x,
  scale,
  blur,
  opacity,
  offset = ["start end", "end start"],
  stiffness = 140,
  damping = 30,
  mass = 0.4,
  className,
  children,
  ...rest
}: ParallaxProps) {
  const reduced = !!useReducedMotion();
  const target = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target, offset });
  const progress = useSpring(scrollYProgress, { stiffness, damping, mass });

  const yRange = toRange(y, [0, 0]);
  const xRange = toRange(x, [0, 0]);
  const scaleRange = toRange(scale, [1, 1]);
  const blurRange = toRange(blur, [0, 0]);
  const opacityRange = toRange(opacity, [1, 1]);

  const motionY = useTransform(progress, [0, 1], yRange);
  const motionX = useTransform(progress, [0, 1], xRange);
  const motionScale = useTransform(progress, [0, 1], scaleRange);
  const motionOpacity = useTransform(progress, [0, 1], opacityRange);
  const motionBlur = useTransform(progress, [0, 1], blurRange);
  const motionFilter = useMotionTemplate`blur(${motionBlur}px)`;

  const Tag = MOTION_TAGS[as];

  return (
    <Tag
      ref={target}
      style={{
        y: reduced ? 0 : motionY,
        x: reduced ? 0 : motionX,
        scale: reduced ? 1 : motionScale,
        opacity: reduced ? 1 : motionOpacity,
        filter: reduced ? undefined : motionFilter,
      }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}