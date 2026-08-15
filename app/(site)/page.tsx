import { getHero, getJourneys } from "@/app/db-controller/content-actions";

export default async function Home() {
  const hero = await getHero();
  const journeys = await getJourneys();

  return (
    <main className="min-h-screen text-white p-8 pt-28 flex flex-col items-center">
      {/* Hero Section */}
      <section
        id="aboutme"
        className="w-full max-w-5xl min-h-[300px] mb-12 bg-gray-950 border border-gray-800 text-white rounded-2xl flex items-center justify-center p-8 shadow-xl"
      >
        <div className="text-center w-full">
          <h1 className="text-5xl font-bold">{hero.greeting}</h1>
          <p className="mt-6 text-gray-400 text-justify">{hero.description}</p>
        </div>
      </section>

      {/* Journey Timeline Section */}
      <section id="journey" className="w-full max-w-5xl mb-12">
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-2">
          The Journey & Learning Phases
        </h2>

        <div className="relative border-l border-gray-800 ml-4 pl-6 space-y-8">
          {journeys.map((item, index) => {
            // Color by type
            const typeColors: Record<string, string> = {
              Education: "bg-purple-950 text-purple-300 border-purple-800",
              Project: "bg-green-950 text-green-300 border-green-800",
              Work: "bg-blue-950 text-blue-300 border-blue-800",
              Industrial: "bg-orange-950 text-orange-300 border-orange-800",
              Academic: "bg-gray-800 text-gray-300 border-gray-700",
            };

            const dotColors: Record<string, string> = {
              Education: "bg-purple-600",
              Project: "bg-green-600",
              Work: "bg-blue-600",
              Industrial: "bg-orange-600",
              Academic: "bg-gray-600",
            };

            return (
              <div key={index} className="relative group">
                {/* DOT */}
                <div
                  className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full ${dotColors[item.type] || "bg-blue-600"} border-4 border-black group-hover:scale-125 transition-transform`}
                ></div>

                {/* CARD */}
                <div className="p-5 rounded-xl bg-gray-900 border-gray-800 hover:border-gray-700 hover:bg-gray-900/80 transition-all">
                  {/* HEADER */}
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 ${typeColors[item.type] || typeColors.Work} rounded-full border`}
                    >
                      {item.year}
                    </span>
                    <span className="text-xs text-gray-500">{item.status}</span>
                  </div>

                  {/* TITLE */}
                  <h3 className="text-lg font-semibold text-white mt-2">
                    {item.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* TECH BADGES - only shown if present */}
                  {item.tech && item.tech.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.tech.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-md border border-gray-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
