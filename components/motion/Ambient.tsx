"use client";

import Parallax from "@/components/motion/Parallax";

/**
 * The ambient light field behind a page.
 *
 * Each blob is a `Parallax` wrapper (scroll-linked travel) around an element
 * with its own `drift` loop, so the light both follows the scroll at a
 * different rate than the content and keeps breathing while the page sits
 * still. Blobs are decorative and never take pointer events.
 *
 * Every page needs the same one, so it lives here rather than being copied
 * into each `main`.
 */
export default function Ambient() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <Parallax
        y={[-90, 90]}
        blur={[10, 0]}
        className="absolute inset-x-0 top-0 h-[34rem]"
      >
        <div className="drift mx-auto h-full w-[34rem] max-w-[80vw] rounded-full bg-blue-600/20 blur-[110px]" />
      </Parallax>

      <Parallax
        y={[70, -70]}
        className="absolute -left-24 top-[42rem] h-[26rem] w-[26rem]"
      >
        <div className="drift-slow h-full w-full rounded-full bg-purple-600/20 blur-[110px]" />
      </Parallax>

      <Parallax
        y={[-60, 60]}
        className="absolute -right-32 top-[78rem] h-[24rem] w-[24rem]"
      >
        <div className="drift h-full w-full rounded-full bg-cyan-500/15 blur-[110px]" />
      </Parallax>
    </div>
  );
}