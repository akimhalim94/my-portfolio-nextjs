"use client";

import { motion } from "framer-motion";

const variants = {
  hidden: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={{
        duration: 0.35,
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
}
