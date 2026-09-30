import Link from "next/link";
import {
  getEducation,
  getExperience,
  getSkills,
  getCertifications,
  getContentSettings,
} from "@/app/db-controller/content-actions";
import Ambient from "@/components/motion/Ambient";
import Parallax from "@/components/motion/Parallax";
import Reveal, {
  RevealGroup,
  RevealItem,
} from "@/components/motion/Reveal";

export default async function ResumePage() {
  const [
    educationData,
    experienceData,
    skillsData,
    certificationsData,
    settings,
  ] = await Promise.all([
    getEducation(),
    getExperience(),
    getSkills(),
    getCertifications(),
    getContentSettings(),
  ]);

  return (
    <main className="relative min-h-screen text-white pt-28 p-8 pb-20 flex flex-col items-center">
      <Ambient />

      <div className="w-full max-w-5xl">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ==========================================
              ROW 1: Colspan 3 (Summary)
              ========================================== */}
          <Reveal
            variant="clip"
            amount={0.15}
            className="md:col-span-3 relative p-6 rounded-2xl bg-gray-950/80 border border-white/10 backdrop-blur-md overflow-hidden"
          >
            {/* The name drifts at its own rate, so the panel feels like it has
                depth rather than being a flat sheet sliding past. */}
            <Parallax y={[-14, 14]} className="relative">
              <RevealGroup stagger={0.1} delayChildren={0.15}>
                <RevealItem
                  as="span"
                  variant="scale"
                  className="inline-block text-xs font-semibold px-2.5 py-1 bg-blue-950 text-blue-300 rounded-full border border-blue-800"
                >
                  Summary
                </RevealItem>
                {/* The name is the page's subject, so it's the h1: the panel
                    below is still the resume, but the outline needs a root. */}
                <RevealItem
                  as="h1"
                  variant="blur"
                  className="text-2xl font-bold mt-3 text-white"
                >
                  {settings.resume_name}
                </RevealItem>
                <RevealItem
                  as="p"
                  variant="down"
                  className="text-blue-400 font-medium text-sm mt-1"
                >
                  {settings.resume_role}
                </RevealItem>
                <RevealItem
                  as="p"
                  variant="up"
                  delay={0.1}
                  className="text-gray-400 text-sm mt-3 leading-relaxed text-justify"
                >
                  {settings.resume_summary}
                </RevealItem>
              </RevealGroup>
            </Parallax>
          </Reveal>

          {/* ==========================================
              ROW 2: Kolum 1 (Contact & Education)
              ========================================== */}
          <Reveal
            variant="left"
            amount={0.12}
            className="p-6 rounded-2xl bg-gray-950/80 border border-white/10 backdrop-blur-md flex flex-col space-y-6"
          >
            {/* Contact Section */}
            <RevealGroup stagger={0.08} delayChildren={0.15}>
              <RevealItem
                as="h3"
                variant="down"
                className="text-lg font-semibold text-white mb-3 flex items-center gap-2"
              >
                📬 Contact
              </RevealItem>
              <RevealItem
                variant="fade"
                className="space-y-2 text-xs"
              >
                <RevealItem as="p" variant="right">
                  <span className="text-orange-400 font-medium">Location:</span>{" "}
                  {settings.resume_location}
                </RevealItem>
                <RevealItem as="p" variant="right" delay={0.06}>
                  <span className="text-orange-400 font-medium">Website:</span>{" "}
                  <a
                    href={settings.resume_website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {settings.resume_website_text}
                  </a>
                </RevealItem>
                <RevealItem as="p" variant="right" delay={0.12}>
                  <span className="text-orange-400 font-medium">GitHub:</span>{" "}
                  <a
                    href={settings.resume_github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {settings.resume_github_text}
                  </a>
                </RevealItem>
                <RevealItem variant="scale" delay={0.18} className="pt-1">
                  <Link
                    href="/contact"
                    prefetch
                    data-view-transition="forward"
                    className="inline-block font-medium px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600/30 transition-colors"
                  >
                    Reach Me &rarr;
                  </Link>
                </RevealItem>
              </RevealItem>
            </RevealGroup>

            {/* Education Section (Mapped from educationData) */}
            <RevealGroup stagger={0.09} delayChildren={0.1}>
              <RevealItem
                as="h3"
                variant="down"
                className="text-lg font-semibold text-white mb-3 flex items-center gap-2"
              >
                🎓 Education
              </RevealItem>
              <RevealGroup stagger={0.07} className="space-y-4">
                {educationData.map((edu, index) => (
<RevealItem key={index} variant="tilt">
                    <RevealGroup stagger={0.06}>
                      <RevealItem as="span" variant="down" className="text-xs text-blue-400">
                        {edu.period}
                      </RevealItem>
                      <RevealItem
                        as="h4"
                        variant="blur"
                        className="font-medium text-sm text-white mt-0.5"
                      >
                        {edu.degree}
                      </RevealItem>
                      <RevealItem
                        as="p"
                        variant="up"
                        delay={0.06}
                        className="text-xs text-gray-400 mt-0.5 leading-relaxed"
                      >
                        {edu.description}
                      </RevealItem>
                    </RevealGroup>
                  </RevealItem>
                ))}
              </RevealGroup>
            </RevealGroup>
          </Reveal>

          {/* ==========================================
              ROW 2: Kolum 2 (Work Experience)
              ========================================== */}
          <Reveal
            variant="up"
            amount={0.12}
            className="p-6 rounded-2xl bg-gray-950/80 border border-white/10 backdrop-blur-md flex flex-col justify-between"
          >
            <div>
              <Reveal variant="down" amount={0.4}>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  💻 Work Experience
                </h3>
              </Reveal>

              {/* Each job slides in from its own side, alternating down the
                  column so the list reads as a zigzag rather than a queue. */}
              <RevealGroup
                stagger={0.1}
                delayChildren={0.15}
                className="space-y-6"
              >
                {experienceData.map((job, index) => (
                  <RevealItem
                    key={index}
                    variant={index % 2 === 0 ? "left" : "right"}
                    className={`border-l-2 pl-3 space-y-1 ${
                      job.isLatest ? "border-blue-500/40" : "border-white/10"
                    }`}
                  >
                    <RevealItem
                      variant="blur"
                      className="flex justify-between items-start"
                    >
                      <h4 className="font-medium text-sm text-white">
                        {job.title}
                      </h4>
                      <RevealItem
                        as="span"
                        variant="scale"
                        delay={0.08}
                        className={`text-[10px] px-2 py-0.5 rounded-md border whitespace-nowrap ${
                          job.isLatest
                            ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                            : "bg-white/5 text-gray-300 border-white/10"
                        }`}
                      >
                        {job.period}
                      </RevealItem>
                    </RevealItem>
                    <RevealItem
                      as="p"
                      variant="down"
                      delay={0.06}
                      className="text-xs text-blue-400 font-medium"
                    >
                      {job.company}
                    </RevealItem>
                    <RevealItem variant="fade" delay={0.12}>
                      {/* The <ul> stays a single list: the wrapper is a plain
                          div, since a <ul> directly inside a <ul> is invalid. */}
                      <RevealGroup
                        as="ul"
                        stagger={0.05}
                        className="text-xs text-gray-400 mt-2 space-y-1.5 list-disc list-inside leading-relaxed"
                      >
                        {job.highlights.map((item, hIndex) => (
                          <RevealItem
                            key={hIndex}
                            variant="right"
                            className="marker:text-gray-600"
                          >
                            {item}
                          </RevealItem>
                        ))}
                      </RevealGroup>
                    </RevealItem>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </Reveal>

          {/* ==========================================
              ROW 2: Kolum 3 (Skills & Certifications)
              ========================================== */}
          <Reveal
            variant="right"
            amount={0.12}
            className="p-6 rounded-2xl bg-gray-950/80 border border-white/10 backdrop-blur-md flex flex-col space-y-8"
          >
            {/* Skills Section (Mapped from skillsData) */}
            <RevealGroup stagger={0.08} delayChildren={0.15}>
              <RevealItem
                as="h3"
                variant="down"
                className="text-lg font-semibold text-white mb-3 flex items-center gap-2"
              >
                🚀 Skills
              </RevealItem>
              <RevealGroup stagger={0.05} className="flex flex-wrap gap-2">
                {skillsData.map((skill, index) => (
                  <RevealItem
                    key={index}
                    as="span"
                    variant="scale"
                    whileHover={{ y: -3, scale: 1.05 }}
                    className="inline-block text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300"
                  >
                    {skill.name}
                  </RevealItem>
                ))}
              </RevealGroup>
            </RevealGroup>

            {/* Certifications Section (Mapped from certificationsData) */}
            <RevealGroup stagger={0.08} delayChildren={0.15}>
              <RevealItem
                as="h3"
                variant="down"
                className="text-lg font-semibold text-white mb-3 flex items-center gap-2"
              >
                📜 Certifications
              </RevealItem>
              <RevealGroup stagger={0.08} className="space-y-3">
                {certificationsData.map((cert, index) => (
                  <RevealItem
                    key={index}
                    variant="tilt"
                    whileHover={{ x: 4 }}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 transition-colors hover:border-blue-500/40"
                  >
                    <RevealItem
                      variant="blur"
                      /* Perspective has to live on the parent: the `perspective`
                         property applies to an element's children, never to
                         its own transform, so putting it on the flipping tile
                         itself would do nothing. */
                      className="flex items-center gap-2.5 perspective-[600px]"
                    >
                      {/* Logo tile flips itself in on the X axis. */}
                      <RevealItem
                        variant="flip"
                        delay={0.08}
                        className="w-8 h-8 shrink-0"
                      >
                        <span className="flex w-full h-full rounded-lg bg-white items-center justify-center font-bold text-[9px] text-black">
                          {cert.logoText}
                        </span>
                      </RevealItem>
                      <div>
                        <h4 className="font-medium text-xs text-white">
                          {cert.title}
                        </h4>
                        <RevealItem
                          variant="fade"
                          delay={0.16}
                          className="flex items-center gap-1.5 mt-0.5"
                        >
                          <span className="text-[10px] text-blue-400">
                            {cert.provider}
                          </span>
                          <span className="text-[10px] text-gray-500">•</span>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {cert.year}
                          </span>
                        </RevealItem>
                      </div>
                    </RevealItem>

                    {cert.verifyUrl && (
                      <RevealItem
                        variant="scale"
                        delay={0.2}
                        className="shrink-0"
                      >
                        <a
                          href={cert.verifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-[10px] font-medium px-2 py-1 rounded-md bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30 transition-colors whitespace-nowrap"
                        >
                          Verify
                        </a>
                      </RevealItem>
                    )}
                  </RevealItem>
                ))}
              </RevealGroup>
            </RevealGroup>
          </Reveal>
        </div>

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