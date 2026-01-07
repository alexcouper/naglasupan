"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth";

export function Navigation() {
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-gray-200/50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
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
              Projects <span className="text-xs">[Coming Soon]</span>
            </span>
          )}

        </div>

        <div className="flex items-center gap-4">
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
      </div>
    </nav>
  );
}
