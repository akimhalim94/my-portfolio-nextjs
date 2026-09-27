import Image from "next/image";
import Link from "next/link";
import { getProjects } from "@/app/db-controller/content-actions";
import ProjectGallery from "@/components/ProjectGallery";
import { resolveProjectImageSrcs } from "@/lib/project-images";

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
      <main className="min-h-screen text-white pt-28 p-8 flex flex-col items-center">
        <p className="text-gray-400 text-sm">
          No projects available at the moment.
        </p>
        <div className="pt-4 pb-12">
          <Link
            href="/projects"
            data-view-transition="back"
            className="inline-block px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl text-xs font-medium transition-colors"
          >
            &larr; Back to Projects
          </Link>
        </div>
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

  // Filter to get the 3 other projects at the bottom
  const otherProjects = projects.filter((p) => p.id !== project.id);

  return (
    <main className="min-h-screen text-white pt-28 p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-8">
        {/* ================= HEADER KANDUNGAN UTAMA ================= */}
        <div className="rounded-2xl bg-gray-950/80 border border-white/10 backdrop-blur-md p-8 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-semibold px-2.5 py-1 bg-blue-950 text-blue-300 rounded-full border border-blue-800">
                {project.type}
              </span>
              <h1 className="text-3xl font-bold mt-3 text-white">
                {project.title}
              </h1>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400 block">Year Made</span>
              <span className="text-sm font-semibold text-blue-400">
                {project.year}
              </span>
            </div>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed border-b border-white/10 pb-6">
            {project.description}
          </p>

          {/* Stacks & Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Built With
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.stacks.map((stack, idx) => (
                  <span
                    key={idx}
                    className="text-xs text-blue-300 font-medium bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20"
                  >
                    {stack}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Key Features
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {project.url && (
            <div className="pt-6 border-t border-white/10">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-semibold transition-all hover:border-blue-500/60 hover:gap-3"
              >
                Visit Project
                <span aria-hidden></span>
              </a>
            </div>
          )}
        </div>

        {/* ================= GALERI GAMBAR ================= */}
        {gallery.length > 0 && (
          <ProjectGallery images={gallery} title={project.title} />
        )}

        {/* ================= PENERANGAN TERPERINCI (WHAT'S INSIDE, HOW, WHY) ================= */}
        <div className="grid grid-cols-1 gap-6">
          <div className="rounded-2xl bg-gray-950/80 border border-white/10 backdrop-blur-md p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              📦 What&apos;s Inside
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              {project.whatsInside}
            </p>
          </div>

          <div className="rounded-2xl bg-gray-950/80 border border-white/10 backdrop-blur-md p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              🛠️ How It&apos;s Built
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              {project.howItsBuilt}
            </p>
          </div>

          <div className="rounded-2xl bg-gray-950/80 border border-white/10 backdrop-blur-md p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              💡 Why I Built It
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              {project.whyIBuiltIt}
            </p>
          </div>
        </div>

        {/* ================= 3 RECENT PROJECTS DI BAWAH ================= */}
        {otherProjects.length > 0 && (
          <div className="pt-6 space-y-4">
            <h2 className="text-xl font-bold text-white">
              Other Recent Projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherProjects.slice(0, 3).map((other) => {
                const cover = imageMap.get(other.id)?.[0];

                return (
                  <Link
                    key={other.id}
                    href={`/projects/${other.id}`}
                    prefetch
                    data-view-transition="forward"
                    className="p-5 rounded-xl bg-gray-950/80 border border-white/10 backdrop-blur-md hover:border-blue-500/50 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {cover && (
                        <div className="relative -mx-5 -mt-5 mb-4 aspect-video overflow-hidden rounded-t-xl bg-gray-950">
                          <Image
                            src={cover}
                            alt={`${other.title} cover`}
                            fill
                            sizes="(max-width: 768px) 100vw, 40vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
                          <span className="absolute bottom-2.5 left-2.5 text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                            {other.type}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-start mb-2">
                        {!cover && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                            {other.type}
                          </span>
                        )}
                        <span className="text-[10px] text-blue-400 font-medium ml-auto">
                          {other.year}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {other.title}
                      </h3>
                      <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                        {other.description}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-blue-400 font-medium">
                      <span>Explore project</span>
                      <span className="group-hover:translate-x-1 transition-transform">
                        &rarr;
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= NAVIGASI KEMBALI ================= */}
        <div className="pt-4 pb-12 flex justify-between items-center">
          <Link
            href="/projects"
            data-view-transition="back"
            className="inline-block px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl text-xs font-medium transition-colors"
          >
            &larr; Back to Projects
          </Link>
          <Link
            href="/"
            data-view-transition="back"
            className="inline-block px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-medium transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
