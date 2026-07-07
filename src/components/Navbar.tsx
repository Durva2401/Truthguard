'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { History, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from './AuthProvider';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const linkCls = "text-[15px] font-[450] tracking-[-0.009em] transition-colors duration-150 " +
    "text-[#17191c] hover:text-[#4c4c4c] dark:text-[#e8e9eb] dark:hover:text-[#b0b3bb]";

  const ctaCls = "px-5 py-2 rounded-full text-[15px] font-[450] tracking-[-0.009em] transition-colors duration-150 " +
    "bg-[#17191c] text-white hover:bg-[#2c2f34] " +
    "dark:bg-[#e8e9eb] dark:text-[#141618] dark:hover:bg-[#d0d2d6]";

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    router.push('/');
  };

  const initial = user?.name?.trim()?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?';

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-[#a3a6af]/20 dark:border-[#3a3d42]/60"
      style={{ backgroundColor: 'var(--surface-nav)' }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[15px] font-[500] tracking-[-0.009em] text-[#17191c] dark:text-[#e8e9eb]">
              TruthGuard
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/" className={`${linkCls} px-3 py-1.5 rounded-full`}>
              Verify
            </Link>
            <Link href="/dashboard" className={`${linkCls} px-3 py-1.5 rounded-full flex items-center gap-1.5`}>
              <History className="h-3.5 w-3.5" />
              History
            </Link>
          </div>

          {/* Desktop right: auth + toggle */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-9 h-9 rounded-full bg-[#f7f7f8] dark:bg-[#222429] animate-pulse" />
            ) : user ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-[500]
                                   bg-[#fbe1d1] dark:bg-[#2e1f17] text-[#5d2a1a] dark:text-[#c47a5a]">
                    {initial}
                  </span>
                  <span className="text-[15px] font-[450] tracking-[-0.009em] text-[#17191c] dark:text-[#e8e9eb] max-w-[140px] truncate">
                    {user.name}
                  </span>
                </div>
                <ThemeToggle />
                <button
                  onClick={handleLogout}
                  className={`${linkCls} flex items-center gap-1.5`}
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={linkCls}>
                  Sign in
                </Link>
                <ThemeToggle />
                <Link href="/signup" className={ctaCls}>
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile: toggle + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-[#17191c] dark:text-[#e8e9eb] p-1 transition-colors"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#a3a6af]/20 dark:border-[#3a3d42]/60 py-4 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block text-[15px] text-[#17191c] dark:text-[#e8e9eb] px-3 py-2 rounded-xl font-[450] tracking-[-0.009em]
                         hover:bg-[#f7f7f8] dark:hover:bg-[#1e2025] transition-colors"
            >
              Verify Claims
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 text-[15px] text-[#17191c] dark:text-[#e8e9eb] px-3 py-2 rounded-xl font-[450] tracking-[-0.009em]
                         hover:bg-[#f7f7f8] dark:hover:bg-[#1e2025] transition-colors"
            >
              <History className="h-4 w-4" />
              History
            </Link>

            <div className="border-t border-[#a3a6af]/20 dark:border-[#3a3d42]/60 my-2" />

            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-[500]
                                   bg-[#fbe1d1] dark:bg-[#2e1f17] text-[#5d2a1a] dark:text-[#c47a5a]">
                    {initial}
                  </span>
                  <span className="text-[15px] font-[450] tracking-[-0.009em] text-[#17191c] dark:text-[#e8e9eb] truncate">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left text-[15px] text-[#17191c] dark:text-[#e8e9eb] px-3 py-2 rounded-xl font-[450] tracking-[-0.009em]
                             hover:bg-[#f7f7f8] dark:hover:bg-[#1e2025] transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-[15px] text-[#17191c] dark:text-[#e8e9eb] px-3 py-2 rounded-xl font-[450] tracking-[-0.009em]
                             hover:bg-[#f7f7f8] dark:hover:bg-[#1e2025] transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="block text-[15px] px-3 py-2 rounded-xl font-[450] tracking-[-0.009em] text-center
                             bg-[#17191c] text-white hover:bg-[#2c2f34]
                             dark:bg-[#e8e9eb] dark:text-[#141618] dark:hover:bg-[#d0d2d6] transition-colors"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
