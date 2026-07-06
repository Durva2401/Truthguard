'use client';

import { motion } from 'framer-motion';
import type { Verdict } from '@/types';
import { VERDICT_MAP } from '@/types';
import ConfidenceMeter from './ConfidenceMeter';
import { AlertTriangle } from 'lucide-react';

interface VerdictCardProps {
  verdict: Verdict;
  confidence: number;
  summary: string;
}

export default function VerdictCard({ verdict, confidence, summary }: VerdictCardProps) {
  const display = VERDICT_MAP[verdict];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring', damping: 18 }}
      className="w-full"
    >
      <div className={`relative overflow-hidden rounded-2xl border-2 ${display.borderColor}`}>
        {/* Opaque base so the animated page background doesn't show through */}
        <div className="absolute inset-0 bg-[#0d1018]/95" />
        {/* Gradient tint */}
        <div className={`absolute inset-0 bg-gradient-to-br ${display.gradientFrom} ${display.gradientTo}`} />

        {/* Animated glow orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.3, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className={`absolute -top-24 -right-24 w-72 h-72 ${display.bgColor} rounded-full blur-3xl opacity-40`}
          />
          <motion.div
            animate={{ x: [0, -25, 0], y: [0, 20, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className={`absolute -bottom-16 -left-16 w-52 h-52 ${display.bgColor} rounded-full blur-3xl opacity-25`}
          />
        </div>

        <div className="relative p-6 md:p-8">
          {/* Main Verdict Badge — big and centred */}
          <div className="flex flex-col items-center mb-8">
            {/* Icon circle */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.15, type: 'spring', damping: 12, stiffness: 120 }}
              className={`w-20 h-20 rounded-full ${display.bgColor} border-2 ${display.borderColor} flex items-center justify-center mb-4 shadow-2xl`}
            >
              <span className="text-4xl">{display.icon}</span>
            </motion.div>

            {/* Verdict label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <h2 className={`text-4xl md:text-5xl font-black tracking-widest ${display.color} mb-2`}>
                {display.label}
              </h2>
              <p className={`text-base font-medium ${display.color} opacity-80`}>
                {display.description}
              </p>
            </motion.div>
          </div>

          {/* Divider */}
          <div className={`h-px w-full ${display.bgColor} mb-6 opacity-50`} />

          {/* Confidence Meter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <ConfidenceMeter score={confidence} verdict={verdict} />
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/[0.08] backdrop-blur-md rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 inline-block" />
              Analysis Summary
            </h3>
            <p className="text-white leading-relaxed text-base">
              {summary}
            </p>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-300"
          >
            <AlertTriangle className="h-3 w-3 flex-shrink-0" />
            <span>AI-assisted analysis. Always verify important information yourself.</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
