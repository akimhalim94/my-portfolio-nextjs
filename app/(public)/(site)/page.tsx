import { getHero, getJourneys } from "@/app/db-controller/content-actions";
import Ambient from "@/components/motion/Ambient";
import Parallax from "@/components/motion/Parallax";
import Reveal, {
  RevealGroup,
  RevealItem,
} from "@/components/motion/Reveal";
import ScrollRail from "@/components/motion/ScrollRail";
import SplitText from "@/components/motion/SplitText";

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

/** The pulse ring is drawn in `currentColor`, so it needs its own colour. */
const ringColors: Record<string, string> = {
  Education: "text-purple-500",
  Project: "text-green-500",
  Work: "text-blue-500",
  Industrial: "text-orange-500",
  Academic: "text-gray-500",
};

export default async function Home() {
  const hero = await getHero();
  const journeys = await getJourneys();

  return (
    <main className="relative min-h-screen text-white px-6 sm:px-8 pt-28 pb-24 flex flex-col items-center">
      {/* Ambient light field: sits behind everything, drifts on its own clock
          and slides at a different rate than the page. */}
      <Ambient />

      {/* Hero Section */}
      <Reveal variant="fade" amount={0.15} className="w-full max-w-5xl">
        {/* Card drifts slower than the scroll so it separates from the page. */}
        <Parallax y={[-46, 46]} rotate={[-1.2, 1.2]} className="perspective-[1400px]">
          <section
            id="aboutme"
            className="gradient-ring sheen relative overflow-hidden rounded-2xl bg-gray-950/70 p-8 backdrop-blur-md shadow-xl sm:p-12"
          >
            <div className="text-center w-full">
              <SplitText
                text={hero.greeting}
                className="text-5xl font-bold tracking-tight text-white drop-shadow-[0_2px_24px_rgba(56,189,248,0.35)]"
                wordClassName="origin-bottom will-change-transform"
                trigger="load"
              />

              <Reveal variant="blur" delay={0.4} amount={0.2}>
                <p className="mt-6 text-gray-400 text-justify">
                  {hero.description}
                </p>
              </Reveal>

              {/* Three rules that wipe themselves in behind the copy. */}
              <RevealGroup
                amount={0.4}
                stagger={0.12}
                delayChildren={0.7}
                className="mt-10 flex items-center justify-center gap-3"
              >
                <RevealItem
                  variant="grow"
                  duration={0.7}
                  className="h-px w-14 bg-gradient-to-r from-transparent to-white/40"
                />
                <RevealItem variant="scale" className="h-1.5 w-1.5 rounded-full bg-sky-400/80" />
                <RevealItem
                  variant="grow"
                  duration={0.7}
                  className="h-px w-14 bg-gradient-to-l from-transparent to-white/40"
                />
              </RevealGroup>
            </div>
          </section>
        </Parallax>
      </Reveal>

      {/* Journey Timeline Section */}
      <Reveal
        as="section"
        id="journey"
        variant="fade"
        amount={0.1}
        className="w-full max-w-5xl mt-24"
      >
        <RevealGroup amount={0.5} stagger={0.14} className="relative mb-12">
          <RevealItem
            as="h2"
            variant="left"
            className="inline-block text-2xl font-bold"
          >
            The Journey &amp; Learning Phases
          </RevealItem>
          {/* Underline wipes out from the left instead of fading in. */}
          <RevealItem
            variant="grow"
            duration={0.9}
            delay={0.15}
            style={{ originX: 0 }}
            className="mt-2 h-px w-full bg-gradient-to-r from-sky-400/70 via-indigo-500/40 to-transparent"
          />
        </RevealGroup>

        <ScrollRail className="ml-4 pl-10 sm:pl-12">
          {journeys.map((item, index) => {
            const dotColor = dotColors[item.type] || "bg-blue-600";
            const ringColor = ringColors[item.type] || "text-blue-500";
            // Alternate the entrance direction down the timeline so the eye
            // zig-zags instead of marching down one side.
            const entrance = index % 2 === 0 ? "left" : "right";

            return (
              <div key={item.id} className="relative group pb-10 last:pb-0">
                {/* DOT — pops in with a spring, then keeps a ring pulsing.
                    The left offset is exactly half the rail's padding plus
                    half the dot, so the dot always centres on the rail line:
                    -48px against pl-10, -56px against the sm:pl-12. */}
                <Reveal
                  variant="scale"
                  delay={0.05}
                  amount={0.6}
                  style={{ top: 8 }}
                  className="absolute -left-12 sm:-left-14"
                >
                  <div
                    className={`pulse-ring relative h-4 w-4 ${ringColor}`}
                  >
                    <span
                      className={`absolute inset-0 rounded-full ${dotColor} border-4 border-black transition-transform duration-300 group-hover:scale-125`}
                    />
                  </div>
                </Reveal>

                {/* CARD */}
                <Reveal variant={entrance} amount={0.25}>
                  {/* Counter-drift against the page, plus a slight tilt as it
                      passes, so each card has its own motion. */}
                  <Parallax
                    y={[22, -22]}
                    rotate={[index % 2 === 0 ? -0.7 : 0.7, index % 2 === 0 ? 0.7 : -0.7]}
                    className="perspective-[1200px]"
                  >
                    <article className="group/card relative overflow-hidden rounded-xl bg-gray-900/70 p-5 border border-gray-800 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gray-700 hover:shadow-[0_18px_50px_-24px_rgba(56,189,248,0.7)]">
                      {/* Accent wash that lights up from the top edge on hover. */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100 bg-[radial-gradient(420px_circle_at_50%_-10%,rgba(56,189,248,0.12),transparent_70%)]"
                      />

                      {/* HEADER */}
                      <RevealGroup
                        stagger={0.09}
                        delayChildren={0.12}
                        className="relative flex flex-wrap justify-between items-center gap-2 mb-2"
                      >
                        <RevealItem
                          as="span"
                          variant="down"
                          className={`inline-block text-xs font-semibold px-2.5 py-0.5 ${
                            typeColors[item.type] || typeColors.Work
                          } rounded-full border`}
                        >
                          {item.year}
                        </RevealItem>
                        <RevealItem
                          as="span"
                          variant="fade"
                          delay={0.08}
                          className="inline-block text-xs text-gray-500"
                        >
                          {item.status}
                        </RevealItem>
                      </RevealGroup>

                      {/* TITLE */}
                      <RevealGroup
                        stagger={0.1}
                        delayChildren={0.1}
                        className="relative"
                      >
                        <RevealItem
                          as="h3"
                          variant="blur"
                          className="text-lg font-semibold text-white mt-2"
                        >
                          {item.title}
                        </RevealItem>
                        <RevealItem
                          as="p"
                          variant="up"
                          className="text-gray-400 text-sm mt-2 leading-relaxed"
                        >
                          {item.description}
                        </RevealItem>
                      </RevealGroup>

                      {/* TECH BADGES - only shown if present */}
                      {item.tech && item.tech.length > 0 && (
                        <RevealGroup
                          stagger={0.05}
                          delayChildren={0.3}
                          className="relative flex flex-wrap gap-2 mt-3"
                        >
                          {item.tech.map((tech) => (
                            <RevealItem
                              key={tech}
                              as="span"
                              variant="scale"
                              whileHover={{ y: -3, scale: 1.06 }}
                              className="inline-block text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-md border border-gray-700 transition-colors hover:border-sky-500/60 hover:text-white"
                            >
                              {tech}
                            </RevealItem>
                          ))}
                        </RevealGroup>
                      )}
                    </article>
                  </Parallax>
                </Reveal>
              </div>
            );
          })}
        </ScrollRail>
      </Reveal>

      {/* Outro */}
      <Reveal
        variant="tilt"
        amount={0.4}
        className="w-full max-w-5xl mt-24 flex flex-col items-center gap-3 text-center"
      >
        <span className="text-xs font-semibold tracking-[0.3em] uppercase text-gray-600">
          End of the timeline
        </span>
        <span className="h-8 w-px bg-gradient-to-b from-gray-600 to-transparent" />
      </Reveal>
    </main>
  );
}