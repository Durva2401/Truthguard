'use client';

import { motion } from 'framer-motion';
import { Share2, Copy, Check, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Verdict } from '@/types';
import { VERDICT_MAP } from '@/types';
import { useState } from 'react';

interface ShareCardProps {
  verdict: Verdict;
  confidence: number;
  summary: string;
  checkId: string;
}

export default function ShareCard({ verdict, confidence, summary, checkId }: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const display = VERDICT_MAP[verdict];

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/result/${checkId}`
    : '';

  const shareText = `${display.icon} TruthGuard Verdict: ${display.label} (${confidence}% confidence)\n\n"${summary.substring(0, 120)}..."\n\nVerify it yourself:`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="flex items-center gap-3 justify-center"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white rounded-xl gap-2"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-emerald-400" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy Result
          </>
        )}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleTwitterShare}
        className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white rounded-xl gap-2"
      >
        <MessageCircle className="h-4 w-4" />
        Share on X
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          if (navigator.share) {
            navigator.share({ title: 'TruthGuard Verdict', text: shareText, url: shareUrl });
          }
        }}
        className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white rounded-xl gap-2"
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>
    </motion.div>
  );
}
