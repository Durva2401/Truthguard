'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import type { Check, Verdict } from '@/types';
import { VERDICT_MAP } from '@/types';
import Link from 'next/link';

export default function RecentChecks() {
  const [checks, setChecks] = useState<Check[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecent() {
      try {
        const res = await fetch('/api/history?limit=5');
        const data = await res.json();
        setChecks(data.checks || []);
      } catch {
        // Silently fail — no checks to show
      } finally {
        setLoading(false);
      }
    }
    fetchRecent();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-16">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-400">Recently Verified</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (checks.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-16">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-400">Recently Verified</h2>
        </div>
        <div className="text-center py-8 text-gray-600">
          <p>No checks yet. Be the first to verify a claim!</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="w-full max-w-2xl mx-auto mt-16"
    >
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-5 w-5 text-gray-500" />
        <h2 className="text-lg font-semibold text-gray-400">Recently Verified</h2>
      </div>

      <div className="space-y-3">
        {checks.map((check, index) => {
          const display = VERDICT_MAP[check.verdict as Verdict] || VERDICT_MAP.unverified;

          return (
            <motion.div
              key={check.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link
                href={`/result/${check.id}`}
                className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <span className="text-xl flex-shrink-0">{display.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300 truncate">
                    {check.raw_input.substring(0, 100)}
                    {check.raw_input.length > 100 && '...'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-medium ${display.color}`}>
                      {display.label}
                    </span>
                    <span className="text-xs text-gray-600">•</span>
                    <span className="text-xs text-gray-500">
                      {new Date(check.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors flex-shrink-0" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
