"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="w-full max-w-xl flex items-center justify-between px-6 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] text-white transition-all">
        {/* Logo / Brand (Replaced with Favicon Image) */}
        <div className="font-bold text-sm tracking-wider flex items-center">
          <Link
            href="/"
            className="hover:opacity-80 transition-opacity flex items-center gap-2"
          >
            <div className="relative w-8 h-8 overflow-hidden rounded-full">
              <Image
                src="/favicon.ico" // Replace with "/favicon.png" if using png format
                alt="Logo"
                fill
                className="object-cover"
              />
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-2 text-sm font-medium">
          {/* About Me Dropdown */}
          <div className="relative group">
            <button
              className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1 ${
                isActive("/#aboutme")
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              About Me
              <svg
                className="w-3 h-3 opacity-70 group-hover:rotate-180 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>

            {/* Menu Dropdown */}
            <div className="absolute left-0 top-full pt-2 w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="p-2 rounded-2xl bg-gray-900/95 backdrop-blur-md border border-white/10 shadow-xl flex flex-col gap-1">
                <Link
                  href="/#aboutme"
                  className="px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  👋 Introduction
                </Link>
                <Link
                  href="/#journey"
                  className="px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  📬 Journey & Learning Phases
                </Link>
              </div>
            </div>
          </div>

          {/* Projects */}
          <Link
            href="/projects"
            className={`px-4 py-1.5 rounded-full transition-all ${
              isActive("/projects")
                ? "bg-white/15 text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Projects
          </Link>

          {/* Resume */}
          <Link
            href="/resume"
            className={`px-4 py-1.5 rounded-full transition-all ${
              isActive("/resume")
                ? "bg-white/15 text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Resume
          </Link>

          {/* Contact Me */}
          <Link
            href="/contact"
            className={`px-4 py-1.5 rounded-full transition-all ${
              isActive("/contact")
                ? "bg-white/15 text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Contact Me
          </Link>

          {/* Login */}
          <Link
            href="/login"
            className={`px-4 py-1.5 rounded-full transition-all ${
              isActive("/login")
                ? "bg-white/15 text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}
