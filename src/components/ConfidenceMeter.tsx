'use client';

import { motion } from 'framer-motion';
import type { Verdict } from '@/types';
import { VERDICT_MAP } from '@/types';

interface ConfidenceMeterProps {
  score: number;
  verdict: Verdict;
}

export default function ConfidenceMeter({ score, verdict }: ConfidenceMeterProps) {
  const display = VERDICT_MAP[verdict];

  // Get the gradient color based on verdict
  const getGradient = () => {
    switch (verdict) {
      case 'true':
        return 'from-emerald-500 to-emerald-400';
      case 'false':
        return 'from-red-500 to-red-400';
      case 'misleading':
        return 'from-amber-500 to-amber-400';
      case 'unverified':
        return 'from-gray-500 to-gray-400';
      case 'too_recent':
        return 'from-blue-500 to-blue-400';
      case 'satire':
        return 'from-purple-500 to-purple-400';
      default:
        return 'from-gray-500 to-gray-400';
    }
  };

  const getGlowColor = () => {
    switch (verdict) {
      case 'true':
        return 'shadow-emerald-500/30';
      case 'false':
        return 'shadow-red-500/30';
      case 'misleading':
        return 'shadow-amber-500/30';
      case 'unverified':
        return 'shadow-gray-500/30';
      case 'too_recent':
        return 'shadow-blue-500/30';
      case 'satire':
        return 'shadow-purple-500/30';
      default:
        return 'shadow-gray-500/30';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-400">Confidence Score</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`text-2xl font-bold ${display.color}`}
        >
          {score}%
        </motion.span>
      </div>

      <div className="relative h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getGradient()} rounded-full shadow-lg ${getGlowColor()}`}
        >
          {/* Shimmer effect */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, delay: 2 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
        </motion.div>
      </div>

      {/* Confidence level label */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>
    </div>
  );
}
