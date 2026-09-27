import { readdir } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

export const PROJECT_IMAGES_DIR = "project-images";

const IMAGE_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".gif",
];

export function projectImageSrc(file: string): string {
  const encoded = file
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `/${PROJECT_IMAGES_DIR}/${encoded}`;
}

export const getProjectImageFiles = cache(async (): Promise<string[]> => {
  const dir = path.join(process.cwd(), "public", PROJECT_IMAGES_DIR);
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    return entries
      .filter(
        (entry) =>
          entry.isFile() &&
          IMAGE_EXTENSIONS.includes(path.extname(entry.name).toLowerCase())
      )
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  } catch {
    return [];
  }
});

export async function resolveProjectImageSrcs(
  files: string[]
): Promise<string[]> {
  if (files.length === 0) return [];
  const available = new Set(await getProjectImageFiles());
  return files
    .map((file) => file.trim())
    .filter((file) => available.has(file))
    .map(projectImageSrc);
}

export async function pickExistingProjectImages(
  values: FormDataEntryValue[]
): Promise<string[]> {
  const available = new Set(await getProjectImageFiles());
  const picked: string[] = [];
  for (const value of values) {
    if (typeof value !== "string") continue;
    const file = value.trim();
    if (!available.has(file) || picked.includes(file)) continue;
    picked.push(file);
  }
  return picked;
}
