import { motion, type HTMLMotionProps } from "framer-motion";
import type { ComponentType, RefAttributes } from "react";

/**
 * A static registry of motion elements, so the animation primitives can take
 * an `as` prop without building a component during render.
 *
 * `motion.create(tag)` inside render would hand back a brand-new component
 * type on every pass, which remounts the subtree and throws away whatever
 * animation state it had, and is flagged by `react-hooks/static-components`.
 * Looking the tag up in this module-level table keeps one stable identity per
 * element type.
 */

export type ElementTag =
  | "div"
  | "section"
  | "span"
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "li"
  | "ul"
  | "ol"
  | "article"
  | "header"
  | "footer"
  | "figure"
  | "a"
  | "strong";

/**
 * Props are widened to the `div` set. Every tag here shares the attributes
 * these components actually accept (`className`, `id`, `style`, `aria-*`),
 * and the alternative — a union of per-tag prop types — would reject valid
 * combinations at the call site instead of at the definition.
 */
export type AnyMotionProps = HTMLMotionProps<"div"> & RefAttributes<HTMLDivElement>;

export const MOTION_TAGS = {
  div: motion.div,
  section: motion.section,
  span: motion.span,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  li: motion.li,
  ul: motion.ul,
  ol: motion.ol,
  article: motion.article,
  header: motion.header,
  footer: motion.footer,
  figure: motion.figure,
  a: motion.a,
  strong: motion.strong,
} as unknown as Record<ElementTag, ComponentType<AnyMotionProps>>;