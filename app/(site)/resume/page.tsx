import Link from "next/link";
import {
  getEducation,
  getExperience,
  getSkills,
  getCertifications,
  getContentSettings,
} from "@/app/db-controller/content-actions";

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
    <main className="min-h-screen text-white pt-28 p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ==========================================
              ROW 1: Colspan 3 (Summary)
              ========================================== */}
          <div className="md:col-span-3 p-6 rounded-2xl bg-gray-950/80 border border-white/10 backdrop-blur-md">
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-950 text-blue-300 rounded-full border border-blue-800">
              Summary
            </span>
            <h2 className="text-2xl font-bold mt-3 text-white">
              {settings.resume_name}
            </h2>
            <p className="text-blue-400 font-medium text-sm mt-1">
              {settings.resume_role}
            </p>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed text-justify">
              {settings.resume_summary}
            </p>
          </div>

          {/* ==========================================
              ROW 2: Kolum 1 (Contact & Education)
              ========================================== */}
          <div className="p-6 rounded-2xl bg-gray-950/80 border border-white/10 backdrop-blur-md flex flex-col space-y-6">
            {/* Contact Section */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                📬 Contact
              </h3>
              <div className="space-y-2 text-xs">
                <p className="text-gray-300">
                  <span className="text-orange-400 font-medium">Location:</span>{" "}
                  {settings.resume_location}
                </p>
                <p className="text-gray-300">
                  <span className="text-orange-400 font-medium">Website:</span>{" "}
                  <a
                    href={settings.resume_website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {settings.resume_website_text}
                  </a>
                </p>
                <p className="text-gray-300">
                  <span className="text-orange-400 font-medium">GitHub:</span>{" "}
                  <a
                    href={settings.resume_github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {settings.resume_github_text}
                  </a>
                </p>
                <div className="pt-1">
                  <Link
                    href="/contact"
                    data-view-transition="forward"
                    className="inline-block font-medium px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600/30 transition-colors"
                  >
                    Reach Me &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Education Section (Mapped from educationData) */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                🎓 Education
              </h3>
              <div className="space-y-4">
                {educationData.map((edu, index) => (
                  <div key={index}>
                    <span className="text-xs text-blue-400">{edu.period}</span>
                    <h4 className="font-medium text-sm text-white mt-0.5">
                      {edu.degree}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                      {edu.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ==========================================
              ROW 2: Kolum 2 (Work Experience)
              ========================================== */}
          <div className="p-6 rounded-2xl bg-gray-950/80 border border-white/10 backdrop-blur-md flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                💻 Work Experience
              </h3>

              <div className="space-y-6">
                {experienceData.map((job, index) => (
                  <div
                    key={index}
                    className={`border-l-2 pl-3 space-y-1 ${job.isLatest ? "border-blue-500/40" : "border-white/10"}`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm text-white">
                        {job.title}
                      </h4>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md border whitespace-nowrap ${job.isLatest ? "bg-blue-500/20 text-blue-300 border-blue-500/30" : "bg-white/5 text-gray-300 border-white/10"}`}
                      >
                        {job.period}
                      </span>
                    </div>
                    <p className="text-xs text-blue-400 font-medium">
                      {job.company}
                    </p>
                    <ul className="text-xs text-gray-400 mt-2 space-y-1.5 list-disc list-inside leading-relaxed">
                      {job.highlights.map((item, hIndex) => (
                        <li key={hIndex}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ==========================================
              ROW 2: Kolum 3 (Skills & Certifications)
              ========================================== */}
          <div className="p-6 rounded-2xl bg-gray-950/80 border border-white/10 backdrop-blur-md flex flex-col space-y-8">
            {/* Skills Section (Mapped from skillsData) */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                🚀 Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillsData.map((skill, index) => (
                  <span
                    key={index}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications Section (Mapped from certificationsData) */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                📜 Certifications
              </h3>
              <div className="space-y-3">
                {certificationsData.map((cert, index) => (
                  <div
                    key={index}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-bold text-[9px] text-black">
                        {cert.logoText}
                      </div>
                      <div>
                        <h4 className="font-medium text-xs text-white">
                          {cert.title}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-blue-400">
                            {cert.provider}
                          </span>
                          <span className="text-[10px] text-gray-500">•</span>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {cert.year}
                          </span>
                        </div>
                      </div>
                    </div>

                    {cert.verifyUrl && (
                      <a
                        href={cert.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-medium px-2 py-1 rounded-md bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30 transition-colors whitespace-nowrap"
                      >
                        Verify
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

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
