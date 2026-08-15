"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/admin/resume", label: "Profile" },
  { href: "/admin/resume/education", label: "Education" },
  { href: "/admin/resume/experience", label: "Experience" },
  { href: "/admin/resume/skills", label: "Skills" },
  { href: "/admin/resume/certifications", label: "Certifications" },
];

export default function ResumeTabs() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin/resume") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            isActive(tab.href)
              ? "bg-blue-600/20 border border-blue-500/30 text-blue-300"
              : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
