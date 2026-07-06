'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { History, Filter, Search, ArrowRight, Loader2, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import type { Check, Verdict } from '@/types';
import { VERDICT_MAP } from '@/types';

const VERDICT_FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  { label: '✅ True', value: 'true' },
  { label: '❌ False', value: 'false' },
  { label: '⚠️ Misleading', value: 'misleading' },
  { label: '🔍 Unverified', value: 'unverified' },
  { label: '⏳ Too Recent', value: 'too_recent' },
  { label: '🎭 Satire', value: 'satire' },
];

export default function DashboardPage() {
  const [checks, setChecks] = useState<Check[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchChecks();
  }, [activeFilter]);

  async function fetchChecks() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '50', offset: '0' });
      if (activeFilter !== 'all') {
        params.set('verdict', activeFilter);
      }
      const res = await fetch(`/api/history?${params.toString()}`);
      const data = await res.json();
      setChecks(data.checks || []);
    } catch {
      setChecks([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredChecks = searchQuery
    ? checks.filter((c) =>
        c.raw_input.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.summary?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : checks;

  // Stats
  const stats = {
    total: checks.length,
    true: checks.filter((c) => c.verdict === 'true').length,
    false: checks.filter((c) => c.verdict === 'false').length,
    misleading: checks.filter((c) => c.verdict === 'misleading').length,
  };

  return (
    <div className="min-h-screen px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <History className="h-6 w-6 text-cyan-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Verification History</h1>
          </div>
          <p className="text-gray-500 ml-14">
            Browse all past fact-checks and their verdicts
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
        >
          {[
            { label: 'Total Checks', value: stats.total, icon: BarChart3, color: 'text-cyan-400' },
            { label: 'Verified True', value: stats.true, icon: () => <span>✅</span>, color: 'text-emerald-400' },
            { label: 'Debunked', value: stats.false, icon: () => <span>❌</span>, color: 'text-red-400' },
            { label: 'Misleading', value: stats.misleading, icon: () => <span>⚠️</span>, color: 'text-amber-400' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="p-4 rounded-xl bg-white/5 border border-white/5"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-xs text-gray-500">{stat.label}</span>
                </div>
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
              </div>
            );
          })}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 space-y-4"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="dashboard-search"
              placeholder="Search claims..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl"
            />
          </div>

          {/* Filter chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-gray-500 flex-shrink-0" />
            {VERDICT_FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-300 ${
                  activeFilter === filter.value
                    ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/10 hover:text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl bg-white/5" />
              ))}
            </div>
          ) : filteredChecks.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-white mb-2">No checks found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? 'No results match your search. Try different keywords.'
                  : 'Start verifying claims to see your history here.'}
              </p>
              <Link href="/">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl">
                  Verify a Claim
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredChecks.map((check, index) => {
                const display = VERDICT_MAP[check.verdict as Verdict] || VERDICT_MAP.unverified;

                return (
                  <motion.div
                    key={check.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Link
                      href={`/result/${check.id}`}
                      className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all duration-300"
                    >
                      {/* Verdict icon */}
                      <span className="text-2xl flex-shrink-0">{display.icon}</span>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-200 truncate mb-1">
                          {check.raw_input.substring(0, 150)}
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${display.bgColor} ${display.color} border ${display.borderColor}`}>
                            {display.label}
                          </span>
                          <span className="text-xs text-gray-500">
                            {check.confidence_score}% confidence
                          </span>
                          <span className="text-xs text-gray-600">
                            {new Date(check.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <span className="text-xs text-gray-600 hidden sm:inline">
                            {check.sources?.length || 0} sources
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors flex-shrink-0" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
