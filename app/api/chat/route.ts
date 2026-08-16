import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { prisma } from "@/lib/prisma";

export const maxDuration = 30;

const TRUNCATE = 400;

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "...";
}

async function buildPortfolioContext(): Promise<string> {
  const [
    projects,
    hero,
    journeys,
    education,
    experience,
    skills,
    certifications,
    socialLinks,
    settings,
  ] = await Promise.all([
    prisma.project.findMany({ orderBy: { order: "asc" } }),
    prisma.heroContent.findFirst(),
    prisma.journey.findMany({ orderBy: { order: "asc" } }),
    prisma.education.findMany({ orderBy: { order: "asc" } }),
    prisma.experience.findMany({ orderBy: { order: "asc" } }),
    prisma.skill.findMany({ orderBy: { order: "asc" } }),
    prisma.certification.findMany({ orderBy: { order: "asc" } }),
    prisma.socialLink.findMany({ orderBy: { order: "asc" } }),
    prisma.contentSetting.findMany(),
  ]);

  const settingsMap = Object.fromEntries(
    settings.map((s) => [s.key, s.value])
  );
  const name = settingsMap.resume_name || "Akim Halim";
  const role = settingsMap.resume_role || "";
  const summary = settingsMap.resume_summary || hero?.description || "";
  const location = settingsMap.resume_location || "";
  const website = settingsMap.resume_website_url || "";
  const github = settingsMap.resume_github_url || "";
  const contactIntro = settingsMap.contact_intro || "";
  const projectsIntro = settingsMap.projects_intro || "";

  const sections: string[] = [];

  sections.push(
    [
      `## Profile`,
      `Name: ${name}`,
      role ? `Role: ${role}` : "",
      summary ? `Summary: ${truncate(summary, TRUNCATE)}` : "",
      location ? `Location: ${location}` : "",
      website ? `Website: ${website}` : "",
      github ? `GitHub: ${github}` : "",
    ]
      .filter(Boolean)
      .join("\n")
  );

  if (projects.length) {
    sections.push(
      [
        "## Projects",
        ...projects.map((p) =>
          [
            `- ${p.title} (${p.type}, ${p.year})`,
            p.description ? `  Description: ${truncate(p.description, TRUNCATE)}` : "",
            p.stacks?.length ? `  Stacks: ${p.stacks.join(", ")}` : "",
            p.features?.length ? `  Features: ${p.features.join(", ")}` : "",
          ]
            .filter(Boolean)
            .join("\n")
        ),
      ].join("\n")
    );
  }

  if (journeys.length) {
    sections.push(
      [
        "## Journey",
        ...journeys.map((j) =>
          [
            `- ${j.year} - ${j.title} (${j.type})`,
            j.description ? `  ${truncate(j.description, TRUNCATE)}` : "",
            j.tech?.length ? `  Tech: ${j.tech.join(", ")}` : "",
            j.status ? `  Status: ${j.status}` : "",
          ]
            .filter(Boolean)
            .join("\n")
        ),
      ].join("\n")
    );
  }

  if (education.length) {
    sections.push(
      [
        "## Education",
        ...education.map((e) =>
          [
            `- ${e.degree} (${e.period})`,
            e.description ? `  ${truncate(e.description, TRUNCATE)}` : "",
          ]
            .filter(Boolean)
            .join("\n")
        ),
      ].join("\n")
    );
  }

  if (experience.length) {
    sections.push(
      [
        "## Experience",
        ...experience.map((x) =>
          [
            `- ${x.title} at ${x.company} (${x.period})${x.isLatest ? " - latest" : ""}`,
            x.highlights?.length ? `  Highlights: ${x.highlights.join("; ")}` : "",
          ]
            .filter(Boolean)
            .join("\n")
        ),
      ].join("\n")
    );
  }

  if (skills.length) {
    sections.push(
      `## Skills\n${skills.map((s) => s.name).join(", ")}`
    );
  }

  if (certifications.length) {
    sections.push(
      [
        "## Certifications",
        ...certifications.map((c) =>
          `- ${c.title} - ${c.provider} (${c.year})${c.verifyUrl ? ` - ${c.verifyUrl}` : ""}`
        ),
      ].join("\n")
    );
  }

  if (socialLinks.length) {
    sections.push(
      [
        "## Social Links",
        ...socialLinks.map((l) => `- ${l.name}: ${l.url}`),
      ].join("\n")
    );
  }

  if (contactIntro || projectsIntro) {
    sections.push(
      [
        "## Page Intros",
        contactIntro ? `Contact page: ${truncate(contactIntro, TRUNCATE)}` : "",
        projectsIntro ? `Projects page: ${truncate(projectsIntro, TRUNCATE)}` : "",
      ]
        .filter(Boolean)
        .join("\n")
    );
  }

  return sections.join("\n\n");
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const modelMessages = messages.map(
      (m: { role: string; parts: { type: string; text: string }[] }) => ({
        role: m.role,
        content: m.parts
          .filter((p) => p.type === "text")
          .map((p) => p.text)
          .join(""),
      })
    );

    const context = await buildPortfolioContext();

    const result = await streamText({
      model: google("gemini-3-flash-preview"),
      messages: modelMessages,
      system: [
        `You are the digital personal assistant for ${context.split("\n")[1]?.replace("Name: ", "") || "Akim Halim"}'s portfolio website.`,
        `Answer visitors' questions ONLY using the portfolio information below.`,
        `Rules:`,
        `- Answer in the same language the visitor uses.`,
        `- Be professional, friendly, and concise.`,
        `- If the information is not present below, say you don't have that information and suggest visiting the relevant page or the contact form.`,
        `- Never invent details that are not in the data.`,
        ``,
        `===== PORTFOLIO DATA =====`,
        context,
      ].join("\n"),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("API Chat Error:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
