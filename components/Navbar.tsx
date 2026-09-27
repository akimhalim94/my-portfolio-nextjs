"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import LinkPendingHint from "@/components/LinkPendingHint";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false);
  const [isDesktopAboutOpen, setIsDesktopAboutOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  // Tutup dropdown desktop/iPad jika klik di luar kawasan
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDesktopAboutOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    // The navbar is named so it is excluded from the page transition and stays
    // put as a spatial anchor while the content behind it slides. Paired with
    // the `::view-transition-group(site-header)` rules in globals.css.
    <header
      style={{ viewTransitionName: "site-header" }}
      className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
    >
      <nav className="w-full max-w-xl flex items-center justify-between px-6 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] text-white transition-all">
        {/* Logo / Brand */}
        <div className="font-bold text-sm tracking-wider flex items-center">
          <Link
            href="/"
            data-view-transition="back"
            className="hover:opacity-80 transition-opacity flex items-center gap-2"
          >
            <div className="relative w-8 h-8 overflow-hidden rounded-full">
              <Image
                src="/favicon.ico"
                alt="Logo"
                fill
                className="object-cover"
              />
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links (Hidden on mobile) */}
        <div className="hidden lg:flex items-center gap-2 text-sm font-medium">
          {/* About Me Dropdown */}
          <div
            className="relative group"
            ref={dropdownRef}
            onMouseEnter={() => setIsDesktopAboutOpen(true)}
            onMouseLeave={() => setIsDesktopAboutOpen(false)}
          >
            <button
              onClick={() => setIsDesktopAboutOpen(!isDesktopAboutOpen)}
              className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1 ${
                isActive("/#aboutme") || isDesktopAboutOpen
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              About Me
              <svg
                className={`w-3 h-3 opacity-70 transition-transform ${
                  isDesktopAboutOpen ? "rotate-180" : "group-hover:rotate-180"
                }`}
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
            <div
              className={`absolute left-0 top-full pt-2 w-60 transition-all duration-200 ${
                isDesktopAboutOpen
                  ? "opacity-100 visible"
                  : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"
              }`}
            >
              <div className="p-2 rounded-2xl bg-gray-900/95 backdrop-blur-md border border-white/10 shadow-xl flex flex-col gap-1">
                <Link
                  href="/#aboutme"
                  data-view-transition="back"
                  onClick={() => setIsDesktopAboutOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Introduction
                </Link>
                <Link
                  href="/#journey"
                  data-view-transition="back"
                  onClick={() => setIsDesktopAboutOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Journey & Learning Phases
                </Link>
              </div>
            </div>
          </div>

          {/* Projects */}
          <Link
            href="/projects"
            prefetch
            data-view-transition="forward"
            className={`relative px-4 py-1.5 rounded-full transition-all ${
              isActive("/projects")
                ? "bg-white/15 text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Projects
            <LinkPendingHint />
          </Link>

          {/* Resume */}
          <Link
            href="/resume"
            prefetch
            data-view-transition="forward"
            className={`relative px-4 py-1.5 rounded-full transition-all ${
              isActive("/resume")
                ? "bg-white/15 text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Resume
            <LinkPendingHint />
          </Link>

          {/* Contact Me */}
          <Link
            href="/contact"
            prefetch
            data-view-transition="forward"
            className={`relative px-4 py-1.5 rounded-full transition-all ${
              isActive("/contact")
                ? "bg-white/15 text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Contact Me
            <LinkPendingHint />
          </Link>

          {/* Login */}
          <Link
            href="/login"
            prefetch
            data-view-transition="forward"
            className={`relative px-4 py-1.5 rounded-full transition-all ${
              isActive("/login")
                ? "bg-white/15 text-white shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Login
            <LinkPendingHint />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-gray-300 hover:text-white focus:outline-none"
          aria-label="Toggle Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu Dropdown Overlay */}
      {isOpen && (
        <div className="absolute top-20 left-4 right-4 z-50 lg:hidden p-4 rounded-3xl bg-gray-950/95 backdrop-blur-xl border border-white/15 shadow-2xl flex flex-col gap-2 text-sm">
          {/* Mobile About Me Dropdown */}
          <div>
            <button
              onClick={() => setIsMobileAboutOpen(!isMobileAboutOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-gray-300 hover:bg-white/10 transition-colors"
            >
              <span>About Me</span>
              <svg
                className={`w-4 h-4 transition-transform ${isMobileAboutOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isMobileAboutOpen && (
              <div className="pl-4 pt-1 flex flex-col gap-1 border-l border-white/10 ml-4 mt-1">
                <Link
                  href="/#aboutme"
                  data-view-transition="back"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/10"
                >
                  Introduction
                </Link>
                <Link
                  href="/#journey"
                  data-view-transition="back"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/10"
                >
                  Journey & Learning Phases
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/projects"
            prefetch
            data-view-transition="forward"
            onClick={() => setIsOpen(false)}
            className="relative px-4 py-2.5 rounded-xl text-gray-300 hover:bg-white/10 transition-colors"
          >
            Projects
            <LinkPendingHint />
          </Link>
          <Link
            href="/resume"
            prefetch
            data-view-transition="forward"
            onClick={() => setIsOpen(false)}
            className="relative px-4 py-2.5 rounded-xl text-gray-300 hover:bg-white/10 transition-colors"
          >
            Resume
            <LinkPendingHint />
          </Link>
          <Link
            href="/contact"
            prefetch
            data-view-transition="forward"
            onClick={() => setIsOpen(false)}
            className="relative px-4 py-2.5 rounded-xl text-gray-300 hover:bg-white/10 transition-colors"
          >
            Contact Me
            <LinkPendingHint />
          </Link>
          <Link
            href="/login"
            prefetch
            data-view-transition="forward"
            onClick={() => setIsOpen(false)}
            className="relative px-4 py-2.5 rounded-xl text-gray-300 hover:bg-white/10 transition-colors"
          >
            Login
            <LinkPendingHint />
          </Link>
        </div>
      )}
    </header>
  );
}
