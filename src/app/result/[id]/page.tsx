'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Search, Newspaper } from 'lucide-react';
import Link from 'next/link';
import VerdictCard from '@/components/VerdictCard';
import SourceList from '@/components/SourceList';
import ShareCard from '@/components/ShareCard';
import type { VerifyResponse, ExtractedClaim } from '@/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import FallingSymbolsBackground from '@/components/ui/falling-symbols-background';

// Shared background used on the verification page, continued here
function ResultBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <FallingSymbolsBackground
        symbols="01░▒▓█▌▐?!#✓✗"
        symbolColors={[
          'rgba(34,211,238,0.55)',
          'rgba(59,130,246,0.4)',
          'rgba(255,255,255,0.3)',
        ]}
        backgroundColor="#080A12"
        fallSpeed={0.6}
      />
    </div>
  );
}

// Reusable opaque liquid-glass surface (solid enough to sit over the animated bg)
const glass =
  'rounded-3xl bg-[#0d1018]/90 backdrop-blur-2xl border border-white/20 shadow-[0_8px_36px_rgba(0,0,0,0.6)] ring-1 ring-white/5';

export default function ResultPage() {
  const params = useParams();
  const id = params.id as string;
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = sessionStorage.getItem(`result-${id}`);
    if (cached) {
      setResult(JSON.parse(cached));
      setLoading(false);
      return;
    }
    async function fetchResult() {
      try {
        const res = await fetch(`/api/history?limit=20&offset=0`);
        const data = await res.json();
        const check = data.checks?.find((c: VerifyResponse) => c.id === id);
        if (check) setResult(check);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-12 pt-28">
        <ResultBackground />
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-6 w-32 bg-white/10" />
          <Skeleton className="h-20 w-full rounded-3xl bg-white/10" />
          <Skeleton className="h-96 w-full rounded-3xl bg-white/10" />
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-52 w-full rounded-3xl bg-white/10" />
            <Skeleton className="h-52 w-full rounded-3xl bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <ResultBackground />
        <div className="text-center">
          <div className="text-7xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold text-white mb-2">Result Not Found</h1>
          <p className="text-gray-300 mb-6 text-lg">This verification result may have expired or doesn&apos;t exist.</p>
          <Link href="/verify">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl h-12 px-6 text-base">
              Check Another Claim
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const rawInput = (result as VerifyResponse & { raw_input?: string }).raw_input;
  const hasClaims = result.extracted_claims && result.extracted_claims.length > 0;
  const hasSources = result.sources && result.sources.length > 0;

  // Consistent section header
  const SectionTitle = ({ icon: Icon, color, children, meta }: {
    icon: typeof Search; color: string; children: React.ReactNode; meta?: string;
  }) => (
    <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-white/10">
      <Icon className={`h-5 w-5 ${color}`} />
      <h2 className="text-xl font-bold text-white">{children}</h2>
      {meta && <span className="ml-auto text-sm text-white/60 font-medium">{meta}</span>}
    </div>
  );

  return (
    <div className="min-h-screen px-4 py-10 pt-28">
      <ResultBackground />
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Link href="/verify" className="inline-flex items-center gap-2 text-base text-gray-200 hover:text-white transition-colors group">
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Verify
          </Link>
        </motion.div>

        {/* 1 — Verified claim banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 ${glass} flex items-start gap-4`}
        >
          <div className="p-2.5 rounded-xl bg-white/20 flex-shrink-0 mt-0.5">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-white/70 uppercase tracking-widest font-bold mb-1.5">Verified Claim</p>
            <p className="text-lg text-white leading-relaxed">
              {rawInput || result.extracted_claims?.[0]?.claim || 'Original claim text'}
            </p>
          </div>
        </motion.div>

        {/* 2 — Verdict (hero, centered) */}
        <VerdictCard
          verdict={result.verdict}
          confidence={result.confidence_score}
          summary={result.summary}
        />

        {/* 3 — Claims + Sources stacked full width */}
        <div className="space-y-8">
          {/* Extracted Claims */}
          {hasClaims && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className={`${glass} p-7`}
            >
              <SectionTitle icon={Search} color="text-cyan-200" meta={`${result.extracted_claims.length} found`}>
                Extracted Claims
              </SectionTitle>
              <div className="space-y-3">
                {result.extracted_claims.map((claim: ExtractedClaim, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.07] border border-white/15 hover:bg-white/[0.12] transition-colors"
                  >
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold flex-shrink-0 mt-0.5 uppercase tracking-wide ${
                      claim.importance === 'high'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : claim.importance === 'medium'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-gray-500/20 text-gray-200 border border-gray-500/30'
                    }`}>
                      {claim.importance}
                    </span>
                    <p className="text-base text-white leading-relaxed">{claim.claim}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Evidence & Sources */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className={`${glass} p-7`}
          >
            <SectionTitle icon={Newspaper} color="text-blue-200">
              Evidence &amp; Sources
            </SectionTitle>
            {hasSources ? (
              <SourceList sources={result.sources} />
            ) : (
              <div className="py-8 text-center">
                <Newspaper className="h-9 w-9 text-gray-300 mx-auto mb-3" />
                <p className="text-base text-gray-200">No sources were found for this claim</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* 4 — Share (full width) */}
        <ShareCard
          verdict={result.verdict}
          confidence={result.confidence_score}
          summary={result.summary}
          checkId={id}
        />

        {/* 5 — Full-width CTA banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="rounded-3xl border border-white/20 bg-[#0d1018]/90 ring-1 ring-white/5 backdrop-blur-2xl p-10 md:p-12 flex flex-col items-center justify-center gap-6 text-center shadow-[0_8px_36px_rgba(0,0,0,0.6)]"
        >
          <div>
            <p className="text-2xl md:text-3xl font-bold text-white mb-2">Want to verify another claim?</p>
            <p className="text-base text-gray-200">Paste a claim, URL, or screenshot and get an instant verdict.</p>
          </div>
          <Link href="/verify">
            <Button className="h-14 px-12 text-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300">
              Check Another Claim
            </Button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
