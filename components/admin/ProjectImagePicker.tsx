import Image from "next/image";
import { getProjectImageFiles, projectImageSrc } from "@/lib/project-images";
import { labelCls } from "./ui";

export default async function ProjectImagePicker({
  name = "images",
  selected = [],
}: {
  name?: string;
  selected?: string[];
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

  return (
    <div className="sm:col-span-2">
      <label className={labelCls}>
        Gallery Images (from public/project-images, first selected is the cover)
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {files.map((file) => (
          <label key={file} className="group relative block cursor-pointer">
            <input
              type="checkbox"
              name={name}
              value={file}
              defaultChecked={selected.includes(file)}
              className="peer sr-only"
            />
            <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 transition peer-checked:border-blue-500 peer-checked:ring-2 peer-checked:ring-blue-500/40">
              <Image
                src={projectImageSrc(file)}
                alt={file}
                fill
                sizes="(max-width: 640px) 45vw, 160px"
                className="object-cover"
              />
            </div>
            <span
              aria-hidden
              className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center opacity-0 transition peer-checked:opacity-100"
            >
              ✓
            </span>
            <span className="mt-1 block truncate text-[10px] text-gray-500 group-hover:text-gray-300 transition-colors">
              {file}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
