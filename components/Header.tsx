"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function LogoMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <defs>
        <linearGradient id="lm" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#3d6bff" />
          <stop offset="100%" stopColor="#9d63ff" />
        </linearGradient>
      </defs>
      <path
        d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z"
        fill="url(#lm)"
      />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const isAuditPage = pathname === "/audit";
  const isResultsPage = pathname.startsWith("/a/");
  const isToolFlow = isAuditPage || isResultsPage;

  return (
    <header className="sticky top-0 z-30 border-b border-ink-100/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-ink-900">
          <LogoMark />
          <span>RightSize</span>
        </Link>

        {isToolFlow && (
          <div className="hidden items-center gap-2 md:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
              {isAuditPage ? "Live Audit Mode" : "Verified Report"}
            </span>
          </div>
        )}

        {!isToolFlow ? (
          <>
            <nav className="hidden items-center gap-1 rounded-full bg-ink-50 px-1.5 py-1.5 ring-1 ring-ink-100 md:flex">
              <Link href="/" className="nav-link-active">
                Home
              </Link>
              <Link href="/#features" className="nav-link">
                + Features
              </Link>
              <Link href="/#about" className="nav-link">
                + About
              </Link>
              <Link href="/#pricing" className="nav-link">
                + Pricing
              </Link>
            </nav>

            <Link href="/audit" className="btn-dark">
              Get Started
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-4">
            {isResultsPage && (
              <Link href="/audit" className="hidden text-sm font-medium text-ink-600 hover:text-ink-900 md:block transition-colors">
                New Audit
              </Link>
            )}
            <Link href="/" className="group flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-900 transition-colors">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-ink-200 bg-white group-hover:bg-ink-50 transition-colors">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
                </svg>
              </span>
              {isResultsPage ? "Exit" : "Exit Audit"}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
