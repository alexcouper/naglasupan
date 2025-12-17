"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth";

export function Navigation() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, logout } = useAuth();

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
          {isAuthenticated && (
            <Link href="/my-projects" className={linkClass("/my-projects")}>
              My Projects
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
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
