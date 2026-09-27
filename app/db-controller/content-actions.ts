"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { pickExistingProjectImages } from "@/lib/project-images";

export type ActionState = {
  success: boolean;
  message?: string;
  error?: string;
};

const initialError: ActionState = {
  success: false,
  error: "Server error. Please try again.",
};

function parseList(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function revalidateAll() {
  revalidatePath("/", "layout");
}

function rethrowRedirect(e: unknown) {
  if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) throw e;
}

// ============================================================
// HERO
// ============================================================

export async function getHero() {
  const hero = await prisma.heroContent.findFirst();
  if (hero) return hero;
  return { id: 1, greeting: "", description: "" };
}

export async function updateHeroAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const greeting = getValue(formData, "greeting");
  const description = getValue(formData, "description");

  if (!greeting || !description) {
    return { success: false, error: "Please fill in all fields." };
  }

  try {
    await prisma.heroContent.upsert({
      where: { id: 1 },
      update: { greeting, description },
      create: { id: 1, greeting, description },
    });
    revalidateAll();
    return { success: true, message: "Hero section has been updated." };
  } catch (error) {
    console.error("Failed to update hero:", error);
    return initialError;
  }
}

// ============================================================
// JOURNEY
// ============================================================

export async function getJourneys() {
  return prisma.journey.findMany({ orderBy: { order: "asc" } });
}

export async function createJourneyAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const year = getValue(formData, "year");
  const title = getValue(formData, "title");
  const description = getValue(formData, "description");
  const status = getValue(formData, "status");
  const type = getValue(formData, "type");
  const tech = parseList(formData.get("tech") as string | null);

  if (!year || !title || !description || !status || !type) {
    return { success: false, error: "Please fill in all required fields." };
  }

  try {
    const last = await prisma.journey.findFirst({
      orderBy: { order: "desc" },
    });
    await prisma.journey.create({
      data: {
        year,
        title,
        description,
        status,
        type,
        tech,
        order: (last?.order ?? -1) + 1,
      },
    });
    revalidateAll();
    redirect("/admin/journey");
  } catch (error) {
    rethrowRedirect(error);
    console.error("Failed to create journey:", error);
    return initialError;
  }
}

export async function updateJourneyAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = getValue(formData, "id");
  const year = getValue(formData, "year");
  const title = getValue(formData, "title");
  const description = getValue(formData, "description");
  const status = getValue(formData, "status");
  const type = getValue(formData, "type");
  const tech = parseList(formData.get("tech") as string | null);

  if (!id || !year || !title || !description || !status || !type) {
    return { success: false, error: "Please fill in all required fields." };
  }

  try {
    await prisma.journey.update({
      where: { id },
      data: { year, title, description, status, type, tech },
    });
    revalidateAll();
    redirect("/admin/journey");
  } catch (error) {
    rethrowRedirect(error);
    console.error("Failed to update journey:", error);
    return initialError;
  }
}

export async function deleteJourneyAction(
  id: string,
  _prev: ActionState
): Promise<ActionState> {
  try {
    await prisma.journey.delete({ where: { id } });
    revalidateAll();
    return { success: true, message: "Journey entry has been deleted." };
  } catch (error) {
    console.error("Failed to delete journey:", error);
    return initialError;
  }
}

export async function moveJourneyAction(
  id: string,
  direction: "up" | "down"
): Promise<ActionState> {
  try {
    const items = await prisma.journey.findMany({ orderBy: { order: "asc" } });
    const index = items.findIndex((item) => item.id === id);
    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (index === -1 || swapWith < 0 || swapWith >= items.length) {
      return { success: false, error: "No items to reorder." };
    }
    await prisma.$transaction([
      prisma.journey.update({
        where: { id: items[index].id },
        data: { order: items[swapWith].order },
      }),
      prisma.journey.update({
        where: { id: items[swapWith].id },
        data: { order: items[index].order },
      }),
    ]);
    revalidateAll();
    return { success: true };
  } catch (error) {
    console.error("Failed to reorder journey:", error);
    return initialError;
  }
}

// ============================================================
// PROJECTS
// ============================================================

export async function getProjects() {
  return prisma.project.findMany({ orderBy: { order: "asc" } });
}

export async function getProject(id: string) {
  return prisma.project.findUnique({ where: { id } });
}

export async function getProjectImagesInUse(
  excludeProjectId?: string
): Promise<Record<string, string>> {
  const projects = await prisma.project.findMany({
    where: excludeProjectId ? { id: { not: excludeProjectId } } : undefined,
    select: { title: true, images: true },
  });

  const inUse: Record<string, string> = {};
  for (const project of projects) {
    for (const image of project.images) {
      if (!inUse[image]) inUse[image] = project.title;
    }
  }
  return inUse;
}

type ProjectFormInput = {
  title: string;
  type: string;
  year: string;
  description: string;
  images: string[];
  url: string;
  stacks: string[];
  features: string[];
  whatsInside: string;
  howItsBuilt: string;
  whyIBuiltIt: string;
};

async function readProjectForm(
  formData: FormData
): Promise<ProjectFormInput> {
  return {
    title: getValue(formData, "title"),
    type: getValue(formData, "type"),
    year: getValue(formData, "year"),
    description: getValue(formData, "description"),
    images: await pickExistingProjectImages(formData.getAll("images")),
    url: getValue(formData, "url"),
    stacks: parseList(formData.get("stacks") as string | null),
    features: parseList(formData.get("features") as string | null),
    whatsInside: getValue(formData, "whatsInside"),
    howItsBuilt: getValue(formData, "howItsBuilt"),
    whyIBuiltIt: getValue(formData, "whyIBuiltIt"),
  };
}

function validateProject(data: ProjectFormInput): string | null {
  if (!data.title || !data.type || !data.year || !data.description) {
    return "Please fill in all required fields.";
  }
  if (data.url && !/^https?:\/\/\S+$/i.test(data.url)) {
    return "Project link must start with http:// or https://";
  }
  return null;
}

export async function createProjectAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const data = await readProjectForm(formData);
  const error = validateProject(data);
  if (error) return { success: false, error };

  try {
    const last = await prisma.project.findFirst({
      orderBy: { order: "desc" },
    });
    await prisma.project.create({
      data: {
        ...data,
        url: data.url || null,
        order: (last?.order ?? -1) + 1,
      },
    });
    revalidateAll();
    redirect("/admin/projects");
  } catch (e) {
    rethrowRedirect(e);
    console.error("Failed to create project:", e);
    return initialError;
  }
}

export async function updateProjectAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = getValue(formData, "id");
  const data = await readProjectForm(formData);
  const error = validateProject(data);
  if (!id || error) return { success: false, error: error || "Invalid ID." };

  try {
    await prisma.project.update({
      where: { id },
      data: { ...data, url: data.url || null },
    });
    revalidateAll();
    redirect("/admin/projects");
  } catch (e) {
    rethrowRedirect(e);
    console.error("Failed to update project:", e);
    return initialError;
  }
}

export async function deleteProjectAction(
  id: string,
  _prev: ActionState
): Promise<ActionState> {
  try {
    await prisma.project.delete({ where: { id } });
    revalidateAll();
    return { success: true, message: "Project has been deleted." };
  } catch (e) {
    console.error("Failed to delete project:", e);
    return initialError;
  }
}

export async function moveProjectAction(
  id: string,
  direction: "up" | "down"
): Promise<ActionState> {
  try {
    const items = await prisma.project.findMany({ orderBy: { order: "asc" } });
    const index = items.findIndex((item) => item.id === id);
    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (index === -1 || swapWith < 0 || swapWith >= items.length) {
      return { success: false, error: "No items to reorder." };
    }
    await prisma.$transaction([
      prisma.project.update({
        where: { id: items[index].id },
        data: { order: items[swapWith].order },
      }),
      prisma.project.update({
        where: { id: items[swapWith].id },
        data: { order: items[index].order },
      }),
    ]);
    revalidateAll();
    return { success: true };
  } catch (e) {
    console.error("Failed to reorder project:", e);
    return initialError;
  }
}

// ============================================================
// RESUME: PROFILE & SETTINGS
// ============================================================

export async function getContentSettings(): Promise<Record<string, string>> {
  const settings = await prisma.contentSetting.findMany();
  return Object.fromEntries(settings.map((s) => [s.key, s.value]));
}

export async function updateResumeProfileAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const keys = [
    "resume_name",
    "resume_role",
    "resume_summary",
    "resume_location",
    "resume_website_text",
    "resume_website_url",
    "resume_github_text",
    "resume_github_url",
  ];

  try {
    await prisma.$transaction(
      keys.map((key) =>
        prisma.contentSetting.upsert({
          where: { key },
          update: { value: getValue(formData, key) },
          create: { key, value: getValue(formData, key) },
        })
      )
    );
    revalidateAll();
    return { success: true, message: "Resume profile has been updated." };
  } catch (e) {
    console.error("Failed to update resume profile:", e);
    return initialError;
  }
}

export async function updateContactIntroAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await prisma.contentSetting.upsert({
      where: { key: "contact_intro" },
      update: { value: getValue(formData, "intro") },
      create: { key: "contact_intro", value: getValue(formData, "intro") },
    });
    revalidateAll();
    return { success: true, message: "Contact page introduction has been updated." };
  } catch (e) {
    console.error("Failed to update contact intro:", e);
    return initialError;
  }
}

export async function updateProjectsIntroAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await prisma.contentSetting.upsert({
      where: { key: "projects_intro" },
      update: { value: getValue(formData, "intro") },
      create: { key: "projects_intro", value: getValue(formData, "intro") },
    });
    revalidateAll();
    return { success: true, message: "Projects page introduction has been updated." };
  } catch (e) {
    console.error("Failed to update projects intro:", e);
    return initialError;
  }
}

// ============================================================
// RESUME: EDUCATION
// ============================================================

export async function getEducation() {
  return prisma.education.findMany({ orderBy: { order: "asc" } });
}

export async function createEducationAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const period = getValue(formData, "period");
  const degree = getValue(formData, "degree");
  const description = getValue(formData, "description");

  if (!period || !degree || !description) {
    return { success: false, error: "Please fill in all fields." };
  }

  try {
    const last = await prisma.education.findFirst({
      orderBy: { order: "desc" },
    });
    await prisma.education.create({
      data: { period, degree, description, order: (last?.order ?? -1) + 1 },
    });
    revalidateAll();
    redirect("/admin/resume/education");
  } catch (e) {
    rethrowRedirect(e);
    console.error("Failed to create education:", e);
    return initialError;
  }
}

export async function updateEducationAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = getValue(formData, "id");
  const period = getValue(formData, "period");
  const degree = getValue(formData, "degree");
  const description = getValue(formData, "description");

  if (!id || !period || !degree || !description) {
    return { success: false, error: "Please fill in all fields." };
  }

  try {
    await prisma.education.update({
      where: { id },
      data: { period, degree, description },
    });
    revalidateAll();
    redirect("/admin/resume/education");
  } catch (e) {
    rethrowRedirect(e);
    console.error("Failed to update education:", e);
    return initialError;
  }
}

export async function deleteEducationAction(
  id: string,
  _prev: ActionState
): Promise<ActionState> {
  try {
    await prisma.education.delete({ where: { id } });
    revalidateAll();
    return { success: true };
  } catch (e) {
    console.error("Failed to delete education:", e);
    return initialError;
  }
}

export async function moveEducationAction(
  id: string,
  direction: "up" | "down"
): Promise<ActionState> {
  return moveItem("education", id, direction);
}

// ============================================================
// RESUME: EXPERIENCE
// ============================================================

export async function getExperience() {
  return prisma.experience.findMany({ orderBy: { order: "asc" } });
}

export async function createExperienceAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const title = getValue(formData, "title");
  const period = getValue(formData, "period");
  const company = getValue(formData, "company");
  const isLatest = formData.get("isLatest") === "on";
  const highlights = parseList(formData.get("highlights") as string | null);

  if (!title || !period || !company) {
    return { success: false, error: "Please fill in the required fields." };
  }

  try {
    const last = await prisma.experience.findFirst({
      orderBy: { order: "desc" },
    });
    await prisma.experience.create({
      data: {
        title,
        period,
        company,
        isLatest,
        highlights,
        order: (last?.order ?? -1) + 1,
      },
    });
    revalidateAll();
    redirect("/admin/resume/experience");
  } catch (e) {
    rethrowRedirect(e);
    console.error("Failed to create experience:", e);
    return initialError;
  }
}

export async function updateExperienceAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = getValue(formData, "id");
  const title = getValue(formData, "title");
  const period = getValue(formData, "period");
  const company = getValue(formData, "company");
  const isLatest = formData.get("isLatest") === "on";
  const highlights = parseList(formData.get("highlights") as string | null);

  if (!id || !title || !period || !company) {
    return { success: false, error: "Please fill in the required fields." };
  }

  try {
    await prisma.experience.update({
      where: { id },
      data: { title, period, company, isLatest, highlights },
    });
    revalidateAll();
    redirect("/admin/resume/experience");
  } catch (e) {
    rethrowRedirect(e);
    console.error("Failed to update experience:", e);
    return initialError;
  }
}

export async function deleteExperienceAction(
  id: string,
  _prev: ActionState
): Promise<ActionState> {
  try {
    await prisma.experience.delete({ where: { id } });
    revalidateAll();
    return { success: true };
  } catch (e) {
    console.error("Failed to delete experience:", e);
    return initialError;
  }
}

export async function moveExperienceAction(
  id: string,
  direction: "up" | "down"
): Promise<ActionState> {
  return moveItem("experience", id, direction);
}

// ============================================================
// RESUME: SKILLS
// ============================================================

export async function getSkills() {
  return prisma.skill.findMany({ orderBy: { order: "asc" } });
}

export async function createSkillAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = getValue(formData, "name");
  if (!name) return { success: false, error: "Please enter the skill name." };

  try {
    const last = await prisma.skill.findFirst({ orderBy: { order: "desc" } });
    await prisma.skill.create({
      data: { name, order: (last?.order ?? -1) + 1 },
    });
    revalidateAll();
    return { success: true, message: "Skill has been added." };
  } catch (e) {
    console.error("Failed to add skill:", e);
    return initialError;
  }
}

export async function deleteSkillAction(
  id: string,
  _prev: ActionState
): Promise<ActionState> {
  try {
    await prisma.skill.delete({ where: { id } });
    revalidateAll();
    return { success: true };
  } catch (e) {
    console.error("Failed to delete skill:", e);
    return initialError;
  }
}

export async function moveSkillAction(
  id: string,
  direction: "up" | "down"
): Promise<ActionState> {
  return moveItem("skill", id, direction);
}

// ============================================================
// RESUME: CERTIFICATIONS
// ============================================================

export async function getCertifications() {
  return prisma.certification.findMany({ orderBy: { order: "asc" } });
}

export async function createCertificationAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const title = getValue(formData, "title");
  const provider = getValue(formData, "provider");
  const year = getValue(formData, "year");
  const logoText = getValue(formData, "logoText");
  const verifyUrl = getValue(formData, "verifyUrl") || null;

  if (!title || !provider || !year || !logoText) {
    return { success: false, error: "Please fill in all fields." };
  }

  try {
    const last = await prisma.certification.findFirst({
      orderBy: { order: "desc" },
    });
    await prisma.certification.create({
      data: { title, provider, year, logoText, verifyUrl, order: (last?.order ?? -1) + 1 },
    });
    revalidateAll();
    redirect("/admin/resume/certifications");
  } catch (e) {
    rethrowRedirect(e);
    console.error("Failed to create certification:", e);
    return initialError;
  }
}

export async function updateCertificationAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = getValue(formData, "id");
  const title = getValue(formData, "title");
  const provider = getValue(formData, "provider");
  const year = getValue(formData, "year");
  const logoText = getValue(formData, "logoText");
  const verifyUrl = getValue(formData, "verifyUrl") || null;

  if (!id || !title || !provider || !year || !logoText) {
    return { success: false, error: "Please fill in all fields." };
  }

  try {
    await prisma.certification.update({
      where: { id },
      data: { title, provider, year, logoText, verifyUrl },
    });
    revalidateAll();
    redirect("/admin/resume/certifications");
  } catch (e) {
    rethrowRedirect(e);
    console.error("Failed to update certification:", e);
    return initialError;
  }
}

export async function deleteCertificationAction(
  id: string,
  _prev: ActionState
): Promise<ActionState> {
  try {
    await prisma.certification.delete({ where: { id } });
    revalidateAll();
    return { success: true };
  } catch (e) {
    console.error("Failed to delete certification:", e);
    return initialError;
  }
}

export async function moveCertificationAction(
  id: string,
  direction: "up" | "down"
): Promise<ActionState> {
  return moveItem("certification", id, direction);
}

// ============================================================
// CONTACT: SOCIAL LINKS
// ============================================================

export async function getSocialLinks() {
  return prisma.socialLink.findMany({ orderBy: { order: "asc" } });
}

export async function createSocialLinkAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = getValue(formData, "name");
  const url = getValue(formData, "url");
  if (!name || !url) return { success: false, error: "Please fill in all fields." };

  try {
    const last = await prisma.socialLink.findFirst({
      orderBy: { order: "desc" },
    });
    await prisma.socialLink.create({
      data: { name, url, order: (last?.order ?? -1) + 1 },
    });
    revalidateAll();
    redirect("/admin/contact");
  } catch (e) {
    rethrowRedirect(e);
    console.error("Failed to create social link:", e);
    return initialError;
  }
}

export async function updateSocialLinkAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = getValue(formData, "id");
  const name = getValue(formData, "name");
  const url = getValue(formData, "url");
  if (!id || !name || !url) {
    return { success: false, error: "Please fill in all fields." };
  }

  try {
    await prisma.socialLink.update({ where: { id }, data: { name, url } });
    revalidateAll();
    redirect("/admin/contact");
  } catch (e) {
    rethrowRedirect(e);
    console.error("Failed to update social link:", e);
    return initialError;
  }
}

export async function deleteSocialLinkAction(
  id: string,
  _prev: ActionState
): Promise<ActionState> {
  try {
    await prisma.socialLink.delete({ where: { id } });
    revalidateAll();
    return { success: true };
  } catch (e) {
    console.error("Failed to delete social link:", e);
    return initialError;
  }
}

export async function moveSocialLinkAction(
  id: string,
  direction: "up" | "down"
): Promise<ActionState> {
  return moveItem("socialLink", id, direction);
}

// ============================================================
// SHARED HELPERS
// ============================================================

type OrderableDelegate = {
  findMany(args: {
    orderBy: { order: "asc" };
  }): Promise<{ id: string; order: number }[]>;
  update(args: {
    where: { id: string };
    data: { order: number };
  }): Promise<unknown>;
};

async function moveItem(
  model: "education" | "experience" | "skill" | "certification" | "socialLink",
  id: string,
  direction: "up" | "down"
): Promise<ActionState> {
  try {
    const table: Record<
      "education" | "experience" | "skill" | "certification" | "socialLink",
      OrderableDelegate
    > = {
      education: prisma.education as unknown as OrderableDelegate,
      experience: prisma.experience as unknown as OrderableDelegate,
      skill: prisma.skill as unknown as OrderableDelegate,
      certification: prisma.certification as unknown as OrderableDelegate,
      socialLink: prisma.socialLink as unknown as OrderableDelegate,
    };
    const delegate = table[model];
    const items = await delegate.findMany({ orderBy: { order: "asc" } });
    const index = items.findIndex((item) => item.id === id);
    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (index === -1 || swapWith < 0 || swapWith >= items.length) {
      return { success: false, error: "No items to reorder." };
    }
    await delegate.update({
      where: { id: items[index].id },
      data: { order: items[swapWith].order },
    });
    await delegate.update({
      where: { id: items[swapWith].id },
      data: { order: items[index].order },
    });
    revalidateAll();
    return { success: true };
  } catch (e) {
    console.error("Failed to reorder item:", e);
    return initialError;
  }
}
