"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth";

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const isPreview = searchParams.get("preview") === "True";

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const linkClass = (path: string) =>
    `transition-colors ${
      isActive(path)
        ? "text-foreground font-medium"
        : "text-gray-500 hover:text-gray-900"
    }`;

  const mobileLinkClass = (path: string) =>
    `block py-3 text-lg transition-colors ${
      isActive(path)
        ? "text-foreground font-medium"
        : "text-gray-600 hover:text-gray-900"
    }`;

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Hamburger button - mobile only */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900"
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className={linkClass("/")}>
              Home
            </Link>
            <Link href="/why" className={linkClass("/why")}>
              Why
            </Link>
            <Link href="/prizes" className={linkClass("/prizes")}>
              Prizes
            </Link>
            {isPreview ? (
              <Link href="/projects?preview=True" className={linkClass("/projects")}>
                Projects
              </Link>
            ) : (
              <span className="text-gray-400 cursor-not-allowed">
                Projects <span className="label-subtle ml-1">Coming Soon</span>
              </span>
            )}
          </div>

          {/* Desktop auth links */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && (
              <Link href="/my-projects" className={linkClass("/my-projects")}>
                My Projects
              </Link>
            )}
            {isLoading ? (
              <span className="text-gray-400 text-sm">...</span>
            ) : isAuthenticated ? (
              <button
                onClick={logout}
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                Log out
              </button>
            ) : (
              <>
                <Link href="/login" className={linkClass("/login")}>
                  Log in
                </Link>
                <Link href="/register" className={linkClass("/register")}>
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile: show logo or empty space on right */}
          <div className="md:hidden" />
        </div>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile slide-in menu */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-72 bg-background z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          {/* Close button */}
          <button
            onClick={closeMenu}
            className="p-2 -ml-2 mb-4 text-gray-600 hover:text-gray-900"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Mobile nav links */}
          <div className="border-b border-gray-200 pb-4 mb-4">
            <Link href="/" className={mobileLinkClass("/")} onClick={closeMenu}>
              Home
            </Link>
            <Link href="/why" className={mobileLinkClass("/why")} onClick={closeMenu}>
              Why
            </Link>
            <Link href="/prizes" className={mobileLinkClass("/prizes")} onClick={closeMenu}>
              Prizes
            </Link>
            {isPreview ? (
              <Link
                href="/projects?preview=True"
                className={mobileLinkClass("/projects")}
                onClick={closeMenu}
              >
                Projects
              </Link>
            ) : (
              <span className="block py-3 text-lg text-gray-400 cursor-not-allowed">
                Projects <span className="label-subtle ml-1">Coming Soon</span>
              </span>
            )}
          </div>

          {/* Mobile auth links */}
          <div>
            {isAuthenticated && (
              <Link
                href="/my-projects"
                className={mobileLinkClass("/my-projects")}
                onClick={closeMenu}
              >
                My Projects
              </Link>
            )}
            {isLoading ? (
              <span className="block py-3 text-lg text-gray-400">...</span>
            ) : isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="block py-3 text-lg text-gray-600 hover:text-gray-900 transition-colors"
              >
                Log out
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className={mobileLinkClass("/login")}
                  onClick={closeMenu}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className={mobileLinkClass("/register")}
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
