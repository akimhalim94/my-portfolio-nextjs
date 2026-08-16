import Image from "next/image";
import Link from "next/link";
import {
  getProjects,
  getContentSettings,
} from "@/app/db-controller/content-actions";

export default async function ProjectsPage() {
  const [projects, settings] = await Promise.all([
    getProjects(),
    getContentSettings(),
  ]);

  return (
    <main className="min-h-screen text-white pt-28 p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        {/* Tajuk & Penerangan */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-gray-400 text-sm">
            {settings.projects_intro}
          </p>
        </div>

        {/* Project Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              data-view-transition="forward"
              className="p-6 rounded-2xl bg-gray-950/80 border border-white/10 backdrop-blur-md hover:border-blue-500/50 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Project Cover Image */}
                <div className="relative -mx-6 -mt-6 mb-5 aspect-video overflow-hidden rounded-t-2xl bg-gradient-to-br from-blue-950/50 via-gray-950 to-indigo-950/50">
                  {project.images[0] ? (
                    <Image
                      src={project.images[0]}
                      alt={`${project.title} cover`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-3xl">
                      📸
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-[10px] font-semibold px-2.5 py-1 bg-blue-950 text-blue-300 rounded-full border border-blue-800">
                    {project.type}
                  </span>
                </div>

                {/* Header Kad */}
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h3 className="text-lg font-semibold text-white mt-2 group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                </div>

                {/* Penerangan */}
                <p className="text-gray-400 text-xs leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Ciri-ciri / Features */}
                <div className="mb-4">
                  <span className="text-[11px] text-gray-500 font-medium block mb-1.5">Key Features:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.features.map((feature, fIndex) => (
                      <span key={fIndex} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stack & Tindakan */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-2">
                <div className="flex flex-wrap gap-1">
                  {project.stacks.map((stack, sIndex) => (
                    <span key={sIndex} className="text-[10px] text-blue-400 font-medium bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      {stack}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-blue-400 font-medium group-hover:translate-x-1 transition-transform">
                  View &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Butang Kembali */}
        <div className="mt-8">
          <Link
            href="/"
            data-view-transition="back"
            className="inline-block px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-medium transition-colors"
          >
            &larr; Return to Homepage
          </Link>
        </div>

      </div>
    </main>
  );
}
