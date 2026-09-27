import Image from "next/image";
import { getProjectImageFiles, projectImageSrc } from "@/lib/project-images";
import { labelCls } from "./ui";

export default async function ProjectImagePicker({
  name = "images",
  selected = [],
  inUse = {},
}: {
  name?: string;
  selected?: string[];
  inUse?: Record<string, string>;
}) {
  const files = await getProjectImageFiles();

  if (files.length === 0) {
    return (
      <div className="sm:col-span-2">
        <label className={labelCls}>Gallery Images</label>
        <p className="text-xs text-gray-500 border border-dashed border-white/10 rounded-xl px-3 py-6 text-center">
          No images found in{" "}
          <span className="text-gray-400">public/project-images</span>. Drop
          image files there, then reload this page.
        </p>
      </div>
    );
  }

  const available = files.filter((file) => !inUse[file]);
  const taken = files.filter((file) => inUse[file]);

  return (
    <div className="sm:col-span-2">
      <label className={labelCls}>
        Gallery Images (from public/project-images, first selected is the cover)
      </label>

      {taken.length > 0 && (
        <p className="mb-2 text-[11px] text-gray-500">
          {taken.length} image{taken.length > 1 ? "s are" : " is"} already used
          by another project and can&apos;t be selected again.
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {files.map((file) => {
          const owner = inUse[file];
          const isTaken = Boolean(owner);
          const isSelected = selected.includes(file);

          return (
            <label
              key={file}
              title={isTaken ? `Used by ${owner}` : file}
              className={`group relative block ${
                isTaken ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <input
                type="checkbox"
                name={name}
                value={file}
                defaultChecked={isSelected}
                disabled={isTaken}
                className="peer sr-only"
              />
              {isTaken && isSelected && (
                <input type="hidden" name={name} value={file} />
              )}

              <div
                className={`relative aspect-video overflow-hidden rounded-xl border transition ${
                  isTaken
                    ? "border-white/5 opacity-40"
                    : "border-white/10 peer-checked:border-blue-500 peer-checked:ring-2 peer-checked:ring-blue-500/40"
                }`}
              >
                <Image
                  src={projectImageSrc(file)}
                  alt={file}
                  fill
                  sizes="(max-width: 640px) 45vw, 160px"
                  className="object-cover"
                />
              </div>

              {isTaken ? (
                <span className="absolute bottom-6 left-1.5 right-1.5 truncate text-[9px] font-semibold px-1.5 py-0.5 rounded bg-black/70 text-gray-300 border border-white/10">
                  Used by {owner}
                </span>
              ) : (
                <span
                  aria-hidden
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center opacity-0 transition peer-checked:opacity-100"
                >
                  ✓
                </span>
              )}

              <span
                className={`mt-1 block truncate text-[10px] transition-colors ${
                  isTaken
                    ? "text-gray-600"
                    : "text-gray-500 group-hover:text-gray-300"
                }`}
              >
                {file}
              </span>
            </label>
          );
        })}
      </div>

      {available.length === 0 && (
        <p className="mt-2 text-[11px] text-amber-300/80">
          Every image in this folder is already assigned to a project.
        </p>
      )}
    </div>
  );
}
