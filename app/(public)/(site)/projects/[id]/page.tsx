import Image from "next/image";
import Link from "next/link";
import { getProjects } from "@/app/db-controller/content-actions";
import ProjectGallery from "@/components/ProjectGallery";
import { resolveProjectImageSrcs } from "@/lib/project-images";
import Ambient from "@/components/motion/Ambient";
import Parallax from "@/components/motion/Parallax";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import SplitText from "@/components/motion/SplitText";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;

  const projects = await getProjects();

  if (projects.length === 0) {
    return (
      <main className="relative min-h-screen text-white pt-28 p-8 flex flex-col items-center">
        <Ambient />
        <Reveal variant="up" amount={0.2} className="text-center">
          <p className="text-gray-400 text-sm">
            No projects available at the moment.
          </p>
          <Reveal variant="fade" delay={0.2} className="pt-4 pb-12">
            <Link
              href="/projects"
              data-view-transition="back"
              className="inline-block px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl text-xs font-medium transition-colors"
            >
              &larr; Back to Projects
            </Link>
          </Reveal>
        </Reveal>
      </main>
    );
  }

  // Find project by ID, fallback to the first project if missing
  const project = projects.find((p) => p.id === id) || projects[0];

  const imageMap = new Map(
    await Promise.all(
      projects.map(
        async (item) =>
          [item.id, await resolveProjectImageSrcs(item.images)] as const,
      ),
    ),
  );
  const gallery = imageMap.get(project.id) ?? [];
  const cover = gallery[0];

  // Filter to get the 3 other projects at the bottom
  const otherProjects = projects.filter((p) => p.id !== project.id);

  return (
    <main className="relative min-h-screen text-white pt-28 p-8 flex flex-col items-center">
      <Ambient />

      <div className="w-full max-w-3xl space-y-8">
        {/* ================= HEADER KANDUNGAN UTAMA ================= */}
        <Reveal
          variant="tilt"
          amount={0.1}
          className="relative rounded-2xl bg-gray-950/80 border border-white/10 backdrop-blur-md p-8 shadow-2xl overflow-hidden"
        >
          {/* The panel leans in, then drifts against the page as it passes. */}
          <Parallax y={[-16, 16]} rotate={[-0.7, 0.7]} className="relative">
            {cover && (
              /* The cover unrolls open and keeps drifting, so the detail view
                 opens on the picture rather than on a wall of text. */
              <Reveal variant="clip" duration={0.9} amount={0.15}>
                <Parallax
                  y={[20, -20]}
                  scale={[1, 1.07]}
                  className="relative -mx-8 -mt-8 mb-6 aspect-video overflow-hidden rounded-t-2xl bg-gray-950"
                >
                  <Image
                    src={cover}
                    alt={`${project.title} cover`}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/10 to-transparent" />
                  <RevealItem
                    as="span"
                    variant="scale"
                    delay={0.3}
                    /* `type` is free text: cap the pill to the cover minus its
                       insets and ellipsise, or a long value wraps and turns the
                       rounded-full into a lozenge. */
                    className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] truncate text-[10px] font-semibold px-2.5 py-1 bg-blue-950/90 text-blue-300 rounded-full border border-blue-800"
                  >
                    {project.type}
                  </RevealItem>
                </Parallax>
              </Reveal>
            )}

            <RevealGroup stagger={0.1} delayChildren={cover ? 0.25 : 0.05}>
              <RevealGroup
                stagger={0.09}
                className="flex flex-wrap items-center justify-between gap-4"
              >
                <RevealItem variant="down" className="flex items-center gap-3">
                  {!cover && (
                    <span className="inline-block max-w-full text-[10px] font-semibold px-2.5 py-1 bg-blue-950 text-blue-300 rounded-full border border-blue-800 truncate">
                      {project.type}
                    </span>
                  )}
                  <SplitText
                    as="h1"
                    text={project.title}
                    className="text-3xl font-bold text-white"
                    stagger={0.07}
                  />
                </RevealItem>
                <RevealItem variant="right" className="text-left md:text-right">
                  <span className="text-xs text-gray-400 block">Year Made</span>
                  <span className="text-sm font-semibold text-blue-400">
                    {project.year}
                  </span>
                </RevealItem>
              </RevealGroup>

              <Reveal
                variant="blur"
                delay={0.15}
                amount={0.4}
                className="text-gray-300 text-sm leading-relaxed border-b border-white/10 pb-6 mt-5"
              >
                {project.description}
              </Reveal>
            </RevealGroup>

            {/* Stacks & Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <RevealGroup stagger={0.06} delayChildren={0.2} amount={0.3}>
                <RevealItem
                  as="h2"
                  variant="grow"
                  className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 origin-left"
                >
                  Built With
                </RevealItem>
                <RevealGroup
                  stagger={0.04}
                  className="flex flex-wrap gap-1.5"
                >
                  {project.stacks.map((stack, idx) => (
                    <RevealItem
                      key={idx}
                      as="span"
                      variant="scale"
                      whileHover={{ y: -2 }}
                      className="inline-block text-xs text-blue-300 font-medium bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20"
                    >
                      {stack}
                    </RevealItem>
                  ))}
                </RevealGroup>
              </RevealGroup>

              <RevealGroup stagger={0.06} delayChildren={0.26} amount={0.3}>
                <RevealItem
                  as="h2"
                  variant="grow"
                  className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 origin-left"
                >
                  Key Features
                </RevealItem>
                <RevealGroup
                  stagger={0.04}
                  className="flex flex-wrap gap-1.5"
                >
                  {project.features.map((feat, idx) => (
                    <RevealItem
                      key={idx}
                      as="span"
                      variant="scale"
                      whileHover={{ y: -2 }}
                      className="inline-block text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300"
                    >
                      {feat}
                    </RevealItem>
                  ))}
                </RevealGroup>
              </RevealGroup>
            </div>

            {project.url && (
              <Reveal
                variant="up"
                delay={0.1}
                amount={0.4}
                className="pt-6 border-t border-white/10"
              >
                <RevealItem
                  whileHover={{ x: 4 }}
                  className="inline-block"
                >
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-semibold transition-all hover:border-blue-500/60 hover:gap-3"
                  >
                    Visit Project
                    <span aria-hidden>&rarr;</span>
                  </a>
                </RevealItem>
              </Reveal>
            )}
          </Parallax>
        </Reveal>

        {/* ================= GALERI GAMBAR ================= */}
        {gallery.length > 0 && (
          <Reveal
            variant="up"
            amount={0.1}
            className="rounded-2xl border border-white/10 bg-gray-950/40 p-3"
          >
            <ProjectGallery images={gallery} title={project.title} />
          </Reveal>
        )}

        {/* ================= PENERANGAN TERPERINCI (WHAT'S INSIDE, HOW, WHY) ================= */}
        <div className="grid grid-cols-1 gap-6">
          {/* Each panel gets its own entrance and drifts at a different rate,
              so the three read as separate beats rather than one stack. */}
          <Reveal
            variant="clip"
            amount={0.15}
            className="relative rounded-2xl bg-gray-950/80 border border-white/10 backdrop-blur-md p-6 overflow-hidden"
          >
            <Parallax y={[14, -14]} className="relative">
              <RevealItem
                as="h2"
                variant="left"
                className="text-lg font-semibold text-white flex items-center gap-2 mb-3"
              >
                What&apos;s Inside
              </RevealItem>
              <RevealItem
                variant="blur"
                delay={0.12}
                className="text-gray-400 text-xs sm:text-sm leading-relaxed"
              >
                {project.whatsInside}
              </RevealItem>
            </Parallax>
          </Reveal>

          <Reveal
            variant="clip"
            amount={0.15}
            className="relative rounded-2xl bg-gray-950/80 border border-white/10 backdrop-blur-md p-6 overflow-hidden"
          >
            <Parallax y={[-14, 14]} className="relative">
              <RevealItem
                as="h2"
                variant="right"
                className="text-lg font-semibold text-white flex items-center gap-2 mb-3"
              >
                How It&apos;s Built
              </RevealItem>
              <RevealItem
                variant="blur"
                delay={0.12}
                className="text-gray-400 text-xs sm:text-sm leading-relaxed"
              >
                {project.howItsBuilt}
              </RevealItem>
            </Parallax>
          </Reveal>

          <Reveal
            variant="clip"
            amount={0.15}
            className="relative rounded-2xl bg-gray-950/80 border border-white/10 backdrop-blur-md p-6 overflow-hidden"
          >
            <Parallax y={[10, -10]} className="relative">
              <RevealItem
                as="h2"
                variant="tilt"
                className="text-lg font-semibold text-white flex items-center gap-2 mb-3"
              >
                Why I Built It
              </RevealItem>
              <RevealItem
                variant="blur"
                delay={0.12}
                className="text-gray-400 text-xs sm:text-sm leading-relaxed"
              >
                {project.whyIBuiltIt}
              </RevealItem>
            </Parallax>
          </Reveal>
        </div>

        {/* ================= 3 RECENT PROJECTS DI BAWAH ================= */}
        {otherProjects.length > 0 && (
          <div className="pt-6 space-y-4">
            <SplitText
              as="h2"
              text="Other Recent Projects"
              className="text-xl font-bold text-white"
              stagger={0.07}
            />
            <RevealGroup
              stagger={0.1}
              amount={0.1}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {otherProjects.slice(0, 3).map((other) => {
                const otherCover = imageMap.get(other.id)?.[0];

                return (
                  <RevealItem
                    key={other.id}
                    variant="up"
                    className="h-full"
                  >
                    <Link
                      href={`/projects/${other.id}`}
                      prefetch
                      data-view-transition="forward"
                      className="group h-full p-5 rounded-xl bg-gray-950/80 border border-white/10 backdrop-blur-md hover:border-blue-500/50 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        {otherCover && (
                          <Reveal variant="clip" duration={0.8} amount={0.3}>
                            <Parallax
                              y={[12, -12]}
                              scale={[1, 1.05]}
                              className="relative -mx-5 -mt-5 mb-4 aspect-video overflow-hidden rounded-t-xl bg-gray-950"
                            >
                              <Image
                                src={otherCover}
                                alt={`${other.title} cover`}
                                fill
                                sizes="(max-width: 640px) 100vw, 40vw"
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-transparent to-transparent" />
                              <RevealItem
                                as="span"
                                variant="scale"
                                delay={0.2}
                                className="absolute bottom-2.5 left-2.5 max-w-[calc(100%-1.25rem)] truncate text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800"
                              >
                                {other.type}
                              </RevealItem>
                            </Parallax>
                          </Reveal>
                        )}
                        <RevealGroup
                          stagger={0.06}
                          delayChildren={otherCover ? 0.18 : 0}
                          className="flex justify-between items-start mb-2"
                        >
                          {!otherCover && (
                            <RevealItem
                              as="span"
                              variant="scale"
                              className="inline-block max-w-full text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 truncate"
                            >
                              {other.type}
                            </RevealItem>
                          )}
                          <RevealItem
                            as="span"
                            variant="right"
                            className="text-[10px] text-blue-400 font-medium ml-auto"
                          >
                            {other.year}
                          </RevealItem>
                        </RevealGroup>
                        <RevealItem
                          as="h3"
                          variant="blur"
                          className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors"
                        >
                          {other.title}
                        </RevealItem>
                        <Reveal
                          variant="up"
                          delay={0.1}
                          amount={0.4}
                          className="text-gray-400 text-xs mt-1 line-clamp-2"
                        >
                          {other.description}
                        </Reveal>
                      </div>
                      <RevealItem
                        variant="fade"
                        delay={0.14}
                        className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-blue-400 font-medium"
                      >
                        <span>Explore project</span>
                        <RevealItem
                          as="span"
                          variant="right"
                          /* Motion owns this transform, so the nudge has to be a
                             whileHover target rather than a Tailwind
                             `translate-x-1`, which the inline style would win. */
                          whileHover={{ x: 5 }}
                          className="inline-block"
                        >
                          &rarr;
                        </RevealItem>
                      </RevealItem>
                    </Link>
                  </RevealItem>
                );
              })}
            </RevealGroup>
          </div>
        )}

        {/* ================= NAVIGASI KEMBALI ================= */}
        <RevealGroup
          stagger={0.1}
          amount={0.4}
          className="pt-4 pb-12 flex justify-between items-center"
        >
          <RevealItem variant="right" whileHover={{ x: -3 }}>
            <Link
              href="/projects"
              data-view-transition="back"
              className="inline-block px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl text-xs font-medium transition-colors"
            >
              &larr; Back to Projects
            </Link>
          </RevealItem>
          <RevealItem variant="left" whileHover={{ x: 3 }}>
            <Link
              href="/"
              data-view-transition="back"
              className="inline-block px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-medium transition-colors"
            >
              Return to Homepage
            </Link>
          </RevealItem>
        </RevealGroup>
      </div>
    </main>
  );
}
