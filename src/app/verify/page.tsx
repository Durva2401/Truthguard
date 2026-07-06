'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import FallingSymbolsBackground from '@/components/ui/falling-symbols-background';
import InputForm from '@/components/InputForm';
import LoadingOverlay from '@/components/LoadingOverlay';
import type { VerifyResponse } from '@/types';

export default function VerifyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleResult = (result: VerifyResponse) => {
    sessionStorage.setItem(`result-${result.id}`, JSON.stringify(result));
    router.push(`/result/${result.id}`);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Falling symbols background */}
      <div className="absolute inset-0">
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

      {/* Foreground — verification portal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 md:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-5xl"
        >
          {/* Large glass card holding the form */}
          <div className="rounded-3xl bg-black/55 backdrop-blur-xl border-4 border-white/25 shadow-2xl p-8 md:p-16 min-h-[78vh] flex flex-col justify-center">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-5 drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
                Verification Portal
              </h1>
              <p className="text-gray-200 text-lg md:text-2xl font-medium drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]">
                Paste a claim, URL, or screenshot — we&apos;ll check it against real sources.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <LoadingOverlay isLoading={isLoading} currentStep={currentStep} />
              ) : (
                <InputForm
                  onResult={handleResult}
                  onLoading={setIsLoading}
                  onStep={setCurrentStep}
                  onError={setError}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 bg-red-500/15 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
