"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { getCurrentUser, logoutAction } from "@/app/db-controller/auth-actions";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<{
    id: string;
    email: string;
    name: string;
  } | null>(null);
  const [isLoggingOut, startLogout] = useTransition();
  const pathname = usePathname();

  useEffect(() => {
    getCurrentUser().then((current) => setUser(current));
  }, []);

  const handleLogout = () => {
    startLogout(async () => {
      await logoutAction();
    });
  };

  const isActive = (path: string) => {
    if (path === "/admin/dashboard") return pathname === path;
    return pathname.startsWith(path);
  };

  const navItems = [
    { href: "/admin/dashboard", icon: "📊", label: "Messages Dashboard" },
    { href: "/admin/hero", icon: "👋", label: "Hero Section" },
    { href: "/admin/journey", icon: "🗺️", label: "Journey Timeline" },
    { href: "/admin/projects", icon: "💼", label: "Projects" },
    { href: "/admin/resume", icon: "📄", label: "Resume" },
    { href: "/admin/contact", icon: "📬", label: "Contact Page" },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* SIDEBAR (Left) */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 bg-gray-950 border-r border-white/10 flex flex-col z-25 sticky top-0 h-screen`}
      >
        {/* Logo / Sidebar Title */}
        <div className="p-5 flex items-center justify-between border-b border-white/10">
          {sidebarOpen ? (
            <span className="font-bold tracking-wider text-sm text-blue-400">
              System Admin
            </span>
          ) : (
            <span className="font-bold tracking-wider text-sm text-blue-400">
              SA
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title="Toggle Sidebar"
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        {/* Sidebar Menu Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive(item.href)
                  ? "bg-blue-600/20 border border-blue-500/30 text-blue-300"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <span className="text-base">🌐</span>
            {sidebarOpen && <span>View Homepage</span>}
          </Link>
        </nav>
      </aside>

      {/* MAIN AREA (Right) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP NAVBAR (Top) */}
        <header className="h-16 bg-gray-950/80 backdrop-blur-md border-b border-white/10 px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="text-xs sm:text-sm font-semibold text-gray-300">
            Admin Dashboard
          </div>

          {/* Profil & Dropdown (hover) */}
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button className="flex items-center gap-2 p-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 transition-all focus:outline-none cursor-default">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                {user ? user.name.charAt(0).toUpperCase() : "A"}
              </div>
              <span className="text-xs font-medium px-2 hidden sm:inline text-gray-200">
                {user ? user.name : "Admin"}
              </span>
              <span className="text-xs text-gray-400 pr-1">▼</span>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full pt-2 w-48 z-30">
                <div className="rounded-xl bg-gray-950 border border-white/10 shadow-2xl py-2">
                  <div className="px-4 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-xs font-medium text-white truncate">
                      {user ? user.email : "Loading..."}
                    </p>
                  </div>
                  <Link
                    href="/admin/resume"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full text-left px-4 py-2 text-xs text-gray-200 hover:bg-white/10 transition-colors flex items-center gap-2"
                  >
                    <span>✏️</span> Edit Profile
                  </Link>
                  <Link
                    href="/admin/account"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full text-left px-4 py-2 text-xs text-gray-200 hover:bg-white/10 transition-colors flex items-center gap-2"
                  >
                    <span>🔑</span> Change Password
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <span>🚪</span> {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
