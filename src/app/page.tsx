'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown, ScanSearch, ShieldCheck, Share2, ArrowRight } from 'lucide-react';
import { SmokeBackground } from '@/components/ui/spooky-smoke-animation';

export default function HomePage() {
  const exploreRef = useRef<HTMLDivElement>(null);

  // Gently scroll to the next section once, shortly after load —
  // only if the user hasn't already scrolled themselves.
  useEffect(() => {
    let userScrolled = false;
    const onScroll = () => { userScrolled = true; };
    window.addEventListener('scroll', onScroll, { passive: true });

    const t = setTimeout(() => {
      if (!userScrolled) {
        exploreRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 4000);

    return () => {
      clearTimeout(t);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <>
      {/* ---------- SECTION 1 — Smoke hero ---------- */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <SmokeBackground smokeColor="#3b82f6" />
        </div>

        <div className="relative z-10 flex h-full items-center justify-center px-4">
          <h1 className="text-center text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
            Verify Before You Share
          </h1>
        </div>

        {/* Scroll-down indicator */}
        <button
          onClick={() => exploreRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/70 hover:text-white transition-colors"
          aria-label="Scroll down"
        >
          <ChevronDown className="h-8 w-8 animate-bounce" />
        </button>
      </section>

      {/* ---------- SECTION 2 — Microscope ---------- */}
      <section
        ref={exploreRef}
        className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-[#09090b]"
      >
        {/* Large magnifying glass — left side, upright, head tilting toward center */}
        <div
          className="pointer-events-none absolute top-1/2 -left-24 -translate-y-1/2 opacity-[0.18]"
          style={{ filter: 'drop-shadow(0 0 30px rgba(34,211,238,0.5))' }}
        >
          <svg
            width="560"
            height="720"
            viewBox="0 0 200 260"
            fill="none"
            stroke="#67e8f9"
            className="rotate-[20deg]"
          >
            {/* outer lens ring — thick */}
            <circle cx="100" cy="80" r="62" strokeWidth="9" />
            {/* inner bezel */}
            <circle cx="100" cy="80" r="50" strokeWidth="2.5" />
            {/* lens glare arc */}
            <path d="M64 56 A44 44 0 0 1 116 40" strokeWidth="2.5" strokeLinecap="round" />
            {/* handle collar */}
            <path d="M100 142 L100 158" strokeWidth="13" strokeLinecap="round" />
            {/* thick upright handle */}
            <path d="M100 158 L100 244" strokeWidth="20" strokeLinecap="round" />
          </svg>
        </div>

        {/* Soft ambient glow behind center */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-500/5 blur-3xl rounded-full" />

        {/* Center — objectives */}
        <div className="relative z-10 w-full px-8 md:px-16 lg:px-24">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">Our Objectives</h2>
            <p className="text-gray-400 text-lg">What TruthGuard sets out to do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: ScanSearch,
                title: 'Detect Misinformation',
                desc: 'Instantly analyze any news article, post, or forwarded message to flag false and misleading claims.',
                color: 'text-cyan-400',
                bg: 'bg-cyan-500/10',
                border: 'hover:border-cyan-500/30',
              },
              {
                icon: ShieldCheck,
                title: 'Verify With Real Sources',
                desc: 'Cross-reference every claim against trusted outlets and fact-checkers — Reuters, AP, BBC, Snopes & more.',
                color: 'text-blue-400',
                bg: 'bg-blue-500/10',
                border: 'hover:border-blue-500/30',
              },
              {
                icon: Share2,
                title: 'Control the Spread',
                desc: 'Empower people to know the truth before they share, stopping misinformation at the source.',
                color: 'text-purple-400',
                bg: 'bg-purple-500/10',
                border: 'hover:border-purple-500/30',
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className={`rounded-2xl border border-white/12 bg-white/[0.03] backdrop-blur-sm p-12 lg:p-16 min-h-[440px] flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-white/[0.06] ${card.border}`}
                >
                  <div className={`w-24 h-24 rounded-2xl ${card.bg} flex items-center justify-center mx-auto mb-8`}>
                    <Icon className={`h-12 w-12 ${card.color}`} />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-5">{card.title}</h3>
                  <p className="text-lg text-gray-300 leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- SECTION 3 — Final CTA box ---------- */}
      <section className="relative w-full py-24 px-6 bg-[#09090b]">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/10 via-blue-600/5 to-purple-600/10 p-12 md:p-16 text-center shadow-2xl">
            {/* glow */}
            <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-cyan-500/15 blur-3xl rounded-full" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                Ready to verify the truth?
              </h2>
              <p className="text-gray-300 text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                Paste any news article, social post, or WhatsApp forward and get an
                instant credibility verdict backed by real sources.
              </p>
              <Link href="/verify">
                <button className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300">
                  Start Verifying
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
