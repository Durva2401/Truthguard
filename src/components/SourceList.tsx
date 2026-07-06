'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import type { Source } from '@/types';

interface SourceListProps {
  sources: Source[];
}

type Tab = 'all' | 'supporting' | 'contradicting';

export default function SourceList({ sources }: SourceListProps) {
  const [tab, setTab] = useState<Tab>('all');
  const [isExpanded, setIsExpanded] = useState(false);

  const supportingSources = sources.filter((s) => s.supports_claim);
  const contradictingSources = sources.filter((s) => !s.supports_claim);

  const displayed = tab === 'all' ? sources : tab === 'supporting' ? supportingSources : contradictingSources;
  const visibleSources = isExpanded ? displayed : displayed.slice(0, 3);

  const getCredibilityBadge = (score: number) => {
    if (score >= 85) return { label: `${score}`, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    if (score >= 65) return { label: `${score}`, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
    if (score >= 45) return { label: `${score}`, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    return { label: `${score}`, color: 'text-red-400 bg-red-500/10 border-red-500/20' };
  };

  const getFavicon = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
    } catch {
      return null;
    }
  };

  const tabs: { key: Tab; label: string; count: number; color: string }[] = [
    { key: 'all', label: 'All', count: sources.length, color: 'text-gray-400' },
    { key: 'supporting', label: 'Supporting', count: supportingSources.length, color: 'text-emerald-400' },
    { key: 'contradicting', label: 'Contradicting', count: contradictingSources.length, color: 'text-red-400' },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Tab Bar */}
      <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/8 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setIsExpanded(false); }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab === t.key
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-gray-200 hover:text-white'
            }`}
          >
            <span>{t.label}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
              tab === t.key ? t.color : 'text-gray-600'
            } bg-white/5`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Source Cards */}
      <div className="space-y-2.5">
        <AnimatePresence mode="popLayout">
          {visibleSources.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-500 text-sm"
            >
              No {tab} sources found
            </motion.div>
          ) : (
            visibleSources.map((source, index) => {
              const credBadge = getCredibilityBadge(source.credibility_score);
              const favicon = getFavicon(source.url);

              return (
                <motion.div
                  key={source.url + index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: index * 0.06 }}
                  className={`group relative rounded-xl border p-4 transition-all duration-200 hover:scale-[1.01] ${
                    source.supports_claim
                      ? 'border-emerald-500/15 bg-emerald-500/5 hover:border-emerald-500/30 hover:bg-emerald-500/8'
                      : 'border-red-500/15 bg-red-500/5 hover:border-red-500/30 hover:bg-red-500/8'
                  }`}
                >
                  {/* Left accent bar */}
                  <div className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-full ${
                    source.supports_claim ? 'bg-emerald-500/60' : 'bg-red-500/60'
                  }`} />

                  <div className="flex items-start gap-3 pl-2">
                    {/* Support icon */}
                    <div className={`mt-0.5 flex-shrink-0 p-1 rounded-md ${
                      source.supports_claim
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {source.supports_claim
                        ? <ThumbsUp className="h-3.5 w-3.5" />
                        : <ThumbsDown className="h-3.5 w-3.5" />
                      }
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Publisher row */}
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {favicon && (
                          <img
                            src={favicon}
                            alt=""
                            className="w-3.5 h-3.5 rounded-sm flex-shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        )}
                        <span className="text-sm font-semibold text-white truncate max-w-[140px]">
                          {source.publisher}
                        </span>
                        <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium ${credBadge.color}`}>
                          <Shield className="h-2.5 w-2.5" />
                          {credBadge.label}/100
                        </span>
                      </div>

                      {/* Title */}
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base text-white hover:text-cyan-300 transition-colors line-clamp-2 font-semibold leading-snug"
                      >
                        {source.title}
                        <ExternalLink className="inline ml-1 h-3 w-3 opacity-40 group-hover:opacity-80 transition-opacity" />
                      </a>

                      {/* Snippet */}
                      {source.snippet && (
                        <p className="mt-1.5 text-sm text-gray-200 line-clamp-2 leading-relaxed">
                          {source.snippet}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Expand/Collapse */}
      {displayed.length > 3 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm text-gray-200 hover:text-white transition-colors mx-auto py-1.5 px-4 rounded-lg hover:bg-white/10"
        >
          {isExpanded ? (
            <><ChevronUp className="h-3.5 w-3.5" />Show less</>
          ) : (
            <><ChevronDown className="h-3.5 w-3.5" />Show {displayed.length - 3} more sources</>
          )}
        </button>
      )}
    </div>
  );
}
