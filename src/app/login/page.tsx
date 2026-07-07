'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const inputWrapCls =
    'flex items-center gap-3 w-full rounded-[16px] px-4 h-12 transition-colors ' +
    'border border-[#a3a6af]/40 dark:border-[#3a3d42]/70 ' +
    'bg-[#f7f7f8] dark:bg-[#222429] ' +
    'focus-within:border-[#17191c] dark:focus-within:border-[#8a8e99]';
  const inputCls =
    'flex-1 bg-transparent text-[16px] tracking-[-0.009em] focus:outline-none ' +
    'text-[#17191c] dark:text-[#e8e9eb] ' +
    'placeholder:text-[#a3a6af] dark:placeholder:text-[#52565e]';
  const iconCls = 'h-[18px] w-[18px] text-[#a3a6af] dark:text-[#52565e] flex-shrink-0';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      await refresh();
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden"
         style={{ backgroundColor: 'var(--surface-page)' }}>
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[520px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(251,225,209,0.45) 0%, transparent 68%)' }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[520px] pointer-events-none opacity-0 dark:opacity-100"
        style={{ background: 'radial-gradient(ellipse at top, rgba(196,122,90,0.12) 0%, transparent 68%)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        {/* Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl mb-5
                          bg-[#fbe1d1] dark:bg-[#2e1f17]">
            <ShieldCheck className="h-[22px] w-[22px] text-[#5d2a1a] dark:text-[#c47a5a]" />
          </div>
          <h1 className="font-display text-[34px] leading-[1.1] tracking-[-0.66px] mb-2
                         text-[#17191c] dark:text-[#e8e9eb]">
            Welcome back
          </h1>
          <p className="text-[16px] tracking-[-0.16px] text-[#4c4c4c] dark:text-[#b0b3bb]">
            Sign in to your TruthGuard account
          </p>
        </div>

        {/* Card */}
        <div className="rounded-[24px] p-6 md:p-8 bg-white dark:bg-[#1e2025]"
             style={{ boxShadow: 'var(--shadow-card)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[14px] font-[450] tracking-[-0.009em] mb-2 text-[#777b86] dark:text-[#8a8e99]">
                Email
              </label>
              <div className={inputWrapCls}>
                <Mail className={iconCls} />
                <input
                  type="email" autoComplete="email" required
                  placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  disabled={loading} className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className="block text-[14px] font-[450] tracking-[-0.009em] mb-2 text-[#777b86] dark:text-[#8a8e99]">
                Password
              </label>
              <div className={inputWrapCls}>
                <Lock className={iconCls} />
                <input
                  type="password" autoComplete="current-password" required
                  placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  disabled={loading} className={inputCls}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-[14px] px-4 py-3 text-[14px] tracking-[-0.009em]
                              border border-[#5d2a1a]/20 bg-[#fbe1d1] dark:bg-[#2e1f17]
                              text-[#5d2a1a] dark:text-[#c47a5a]">
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full h-12 rounded-full text-[15px] font-[450] tracking-[-0.009em] flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                         bg-[#17191c] dark:bg-[#e8e9eb] text-white dark:text-[#141618] hover:bg-[#2c2f34] dark:hover:bg-[#d0d2d6]"
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Signing in...</> : <>Sign in<ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-[15px] tracking-[-0.009em] text-[#777b86] dark:text-[#8a8e99]">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-[500] text-[#17191c] dark:text-[#e8e9eb] hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
