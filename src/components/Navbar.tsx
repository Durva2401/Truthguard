'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const serif = { fontFamily: '"Times New Roman", Times, serif' };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent border border-white/25">
      <div className="w-full px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left — brand */}
          <Link
            href="/"
            className="text-2xl font-bold text-white tracking-wide"
            style={serif}
          >
            TruthGuard
          </Link>

          {/* Right — rectangular nav items */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/verify"
              style={serif}
              className="px-5 py-2 border border-white/40 text-white text-base font-medium hover:bg-white/10 transition-colors duration-200"
            >
              Verify
            </Link>
            <Link
              href="/dashboard"
              style={serif}
              className="px-5 py-2 border border-white/40 text-white text-base font-medium hover:bg-white/10 transition-colors duration-200"
            >
              History
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden flex flex-col gap-2 pb-4">
            <Link
              href="/verify"
              onClick={() => setMobileOpen(false)}
              style={serif}
              className="px-5 py-2 border border-white/40 text-white text-base font-medium hover:bg-white/10 transition-colors text-center"
            >
              Verify
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              style={serif}
              className="px-5 py-2 border border-white/40 text-white text-base font-medium hover:bg-white/10 transition-colors text-center"
            >
              History
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
