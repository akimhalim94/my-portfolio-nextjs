"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { MOTION_TAGS, type ElementTag } from "@/components/motion/tags";
import { Fragment, useMemo } from "react";

const EASE = [0.32, 0.72, 0, 1] as const;

const WORD_VARIANTS: Variants = {
  hidden: { opacity: 0, y: "0.7em", rotate: 3, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: "0em",
    rotate: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: EASE },
  },
};

/**
 * Reveals a heading one word at a time when it scrolls into view.
 *
 * Each word is an `inline-block` so it can be transformed on its own, and the
 * gaps between them stay real text nodes — so the heading is still one plain
 * line of prose to a screen reader and to copy-paste. The heading element
 * itself is the motion component, so the page's semantics are unchanged and
 * the word variants stagger down from it automatically.
 */
export default function SplitText({
  text,
  as = "h1",
  className = "",
  wordClassName = "will-change-transform",
  trigger = "view",
  stagger = 0.06,
  delayChildren = 0.1,
  repeat = false,
}: {
  text: string;
  as?: Extract<ElementTag, "h1" | "h2" | "h3" | "p" | "span" | "div">;
  className?: string;
  wordClassName?: string;
  /** `view` waits for the heading to scroll in; `load` plays on mount. */
  trigger?: "view" | "load";
  stagger?: number;
  delayChildren?: number;
  repeat?: boolean;
}) {
  const reduced = !!useReducedMotion();
  const words = useMemo(() => text.trim().split(/\s+/).filter(Boolean), [text]);

  const Tag = MOTION_TAGS[as];

  if (reduced) {
    return (
      <Tag className={className}>{text}</Tag>
    );
  }

  const variants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren } },
  };

  const triggerProps =
    trigger === "load"
      ? { animate: "show" as const }
      : {
          whileInView: "show" as const,
          viewport: { once: !repeat, amount: 0.4, margin: "0px 0px -10% 0px" },
        };

  return (
    <Tag
      className={className}
      initial="hidden"
      variants={variants}
      {...triggerProps}
    >
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <motion.span
            variants={WORD_VARIANTS}
            className={`inline-block ${wordClassName}`}
          >
            {word}
          </motion.span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}