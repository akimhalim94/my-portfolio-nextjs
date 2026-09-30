import Image from "next/image";
import Link from "next/link";
import {
  getProjects,
  getContentSettings,
} from "@/app/db-controller/content-actions";
import { resolveProjectImageSrcs } from "@/lib/project-images";
import Ambient from "@/components/motion/Ambient";
import Parallax from "@/components/motion/Parallax";
import Reveal, {
  RevealGroup,
  RevealItem,
} from "@/components/motion/Reveal";
import SplitText from "@/components/motion/SplitText";

export default async function ProjectsPage() {
  const [projects, settings] = await Promise.all([
    getProjects(),
    getContentSettings(),
  ]);

  const imageMap = new Map(
    await Promise.all(
      projects.map(
        async (project) =>
          [project.id, await resolveProjectImageSrcs(project.images)] as const
      )
    )
  );

  return (
    <main className="relative min-h-screen text-white pt-28 p-8 pb-20 flex flex-col items-center">
      <Ambient />

      <div className="w-full max-w-5xl">
        {/* Tajuk & Penerangan */}
        <div className="mb-10 text-center md:text-left">
          <SplitText
            text="Projects"
            className="text-3xl font-bold mb-2 inline-block"
            trigger="load"
            stagger={0.08}
          />
          <Reveal variant="blur" delay={0.3} amount={0.4}>
            <p className="text-gray-400 text-sm">{settings.projects_intro}</p>
          </Reveal>
          <Reveal
            variant="grow"
            duration={0.9}
            delay={0.45}
            amount={0.4}
            style={{ originX: 0 }}
            className="mt-4 h-px w-full max-w-xs bg-gradient-to-r from-sky-400/70 to-transparent"
          />
        </div>

        {/* Project Cards List — one trigger for the grid, so the cards cascade
            in instead of each one racing its own in-view check. */}
        <RevealGroup
          stagger={0.09}
          amount={0.1}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {projects.map((project) => {
            const cover = imageMap.get(project.id)?.[0];

            return (
              <RevealItem
                key={project.id}
                variant="up"
                className="h-full"
              >
                <Link
                  href={`/projects/${project.id}`}
                  prefetch
                  data-view-transition="forward"
                  className="group h-full p-6 rounded-2xl bg-gray-950/80 border border-white/10 backdrop-blur-md hover:border-blue-500/50 transition-colors flex flex-col justify-between"
                >
                  <div>
                    {cover && (
                      /* Cover unrolls open, and drifts against the page so
                         neighbouring images pass at different speeds. */
                      <Reveal variant="clip" duration={0.9} amount={0.4}>
                        <Parallax
                          y={[16, -16]}
                          scale={[1, 1.06]}
                          className="relative -mx-6 -mt-6 mb-5 aspect-video overflow-hidden rounded-t-2xl bg-gray-950"
                        >
                          <Image
                            src={cover}
                            alt={`${project.title} cover`}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
                          <RevealItem
                            as="span"
                            variant="scale"
                            delay={0.25}
                            className="absolute bottom-3 left-3 text-[10px] font-semibold px-2.5 py-1 bg-blue-950 text-blue-300 rounded-full border border-blue-800"
                          >
                            {project.type}
                          </RevealItem>
                        </Parallax>
                      </Reveal>
                    )}

                    {/* Header Kad */}
                    <RevealGroup
                      stagger={0.07}
                      delayChildren={0.12}
                      className="mb-3"
                    >
                      {!cover && (
                        <RevealItem
                          as="span"
                          variant="scale"
                          className="inline-block mb-2 text-[10px] font-semibold px-2.5 py-1 bg-blue-950 text-blue-300 rounded-full border border-blue-800"
                        >
                          {project.type}
                        </RevealItem>
                      )}
                      <RevealItem
                        as="h3"
                        variant="blur"
                        className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors"
                      >
                        {project.title}
                      </RevealItem>
                    </RevealGroup>

                    {/* Penerangan */}
                    <Reveal variant="up" delay={0.2} amount={0.4}>
                      <p className="text-gray-400 text-xs leading-relaxed mb-4">
                        {project.description}
                      </p>
                    </Reveal>

                    {/* Ciri-ciri / Features */}
                    <RevealGroup
                      stagger={0.05}
                      delayChildren={0.28}
                      amount={0.4}
                      className="mb-4"
                    >
                      <RevealItem
                        as="span"
                        variant="fade"
                        className="text-[11px] text-gray-500 font-medium block mb-1.5"
                      >
                        Key Features:
                      </RevealItem>
                      <RevealGroup
                        stagger={0.04}
                        delayChildren={0.1}
                        className="flex flex-wrap gap-1.5"
                      >
                        {project.features.map((feature, fIndex) => (
                          <RevealItem
                            key={fIndex}
                            as="span"
                            variant="scale"
                            whileHover={{ y: -2 }}
                            className="inline-block text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300"
                          >
                            {feature}
                          </RevealItem>
                        ))}
                      </RevealGroup>
                    </RevealGroup>
                  </div>

                  {/* Stack & Tindakan */}
                  <RevealGroup
                    stagger={0.05}
                    delayChildren={0.2}
                    amount={0.4}
                    className="pt-4 border-t border-white/5 flex items-center justify-between mt-2"
                  >
                    <RevealGroup stagger={0.04} className="flex flex-wrap gap-1">
                      {project.stacks.map((stack, sIndex) => (
                        <RevealItem
                          key={sIndex}
                          as="span"
                          variant="fade"
                          className="inline-block text-[10px] text-blue-400 font-medium bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20"
                        >
                          {stack}
                        </RevealItem>
                      ))}
                    </RevealGroup>
                    <RevealItem
                      as="span"
                      variant="right"
                      /* Motion owns the transform here, so the nudge on hover
                         has to be a whileHover target — a Tailwind
                         `translate-x-1` would be overwritten by the inline
                         transform that reveals the arrow. */
                      whileHover={{ x: 6 }}
                      className="text-xs text-blue-400 font-medium cursor-pointer"
                    >
                      View &rarr;
                    </RevealItem>
                  </RevealGroup>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>

        {/* Butang Kembali */}
        {/* The last thing on the page can never scroll far enough to satisfy a
            high threshold, so this one asks for a sliver instead of half. */}
        <Reveal variant="fade" amount={0.2} className="mt-8">
          <Link
            href="/"
            data-view-transition="back"
            className="inline-block px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-medium transition-colors"
          >
            &larr; Return to Homepage
          </Link>
        </Reveal>
      </div>
    </main>
  );
}