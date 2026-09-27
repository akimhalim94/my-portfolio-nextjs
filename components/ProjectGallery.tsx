"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Direction = 1 | -1;

const AUTOPLAY_MS = 5000;

const slideVariants = {
  enter: (direction: Direction) => ({
    opacity: 0,
    x: direction > 0 ? 80 : -80,
    scale: 0.98,
  }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (direction: Direction) => ({
    opacity: 0,
    x: direction > 0 ? -80 : 80,
    scale: 0.98,
  }),
};

export default function ProjectGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [[index, direction], setState] = useState<[number, Direction]>([0, 1]);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (next: number) => {
      if (images.length === 0) return;
      const count = images.length;
      setState(([prev]) => [
        ((next % count) + count) % count,
        next > prev ? 1 : -1,
      ]);
    },
    [images.length]
  );

  useEffect(() => {
    if (paused || images.length < 2) return;
    const id = setInterval(() => {
      setState(([prev]) => [((prev + 1) % images.length), 1]);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, images.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(index - 1);
      if (e.key === "ArrowRight") goTo(index + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, index]);

  if (images.length === 0) return null;

  const current = images[index];

  return (
    <div
      className="space-y-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Main Stage */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 group">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={current}
              alt={`${title} screenshot ${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
              preload={index === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Arrows */}
        <button
          onClick={() => goTo(index - 1)}
          aria-label="Previous image"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-blue-600/70 border border-white/10 text-white text-sm flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110 opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          ←
        </button>
        <button
          onClick={() => goTo(index + 1)}
          aria-label="Next image"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-blue-600/70 border border-white/10 text-white text-sm flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110 opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          →
        </button>

        {/* Counter */}
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-3 right-3 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-gray-200 backdrop-blur-sm"
        >
          {index + 1} / {images.length}
        </motion.span>

        {/* Autoplay Progress */}
        {!paused && images.length > 1 && (
          <div
            aria-hidden
            className="absolute bottom-3 left-3 h-1 w-24 rounded-full bg-white/10 overflow-hidden"
          >
            <motion.div
              key={index}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
              className="h-full rounded-full bg-blue-500/80"
            />
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button
            key={img}
            onClick={() => goTo(i)}
            aria-label={`Show image ${i + 1}`}
            className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors shrink-0 ${
              i === index
                ? "border-blue-500"
                : "border-white/10 hover:border-white/40 opacity-60 hover:opacity-100"
            }`}
          >
            <Image
              src={img}
              alt=""
              fill
              sizes="64px"
              className="object-cover"
            />
            {i === index && (
              <motion.span
                layoutId="gallery-thumb-active"
                className="absolute inset-0 ring-2 ring-blue-500/40 rounded-lg pointer-events-none"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
