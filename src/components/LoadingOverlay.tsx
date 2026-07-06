'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Brain, CheckCircle, Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isLoading: boolean;
  currentStep: string;
}

const steps = [
  { key: 'Extracting claims...', icon: FileText, label: 'Extracting Claims' },
  { key: 'Searching sources...', icon: Search, label: 'Searching Sources' },
  { key: 'Analyzing evidence...', icon: Brain, label: 'Analyzing Evidence' },
  { key: 'Generating verdict...', icon: CheckCircle, label: 'Generating Verdict' },
];

export default function LoadingOverlay({ isLoading, currentStep }: LoadingOverlayProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 rounded-2xl blur-xl" />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              {/* Animated brain icon */}
              <div className="flex justify-center mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="relative"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                    <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
                  </div>
                  {/* Orbital ring */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-[-8px] border border-dashed border-cyan-500/20 rounded-full"
                  />
                </motion.div>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === currentIndex;
                  const isCompleted = index < currentIndex;

                  return (
                    <motion.div
                      key={step.key}
                      initial={{ opacity: 0.3 }}
                      animate={{
                        opacity: isActive ? 1 : isCompleted ? 0.7 : 0.3,
                      }}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-500 ${
                        isActive
                          ? 'bg-white/10 border border-white/10'
                          : isCompleted
                          ? 'bg-white/5'
                          : ''
                      }`}
                    >
                      <div className={`flex-shrink-0 ${
                        isActive ? 'text-cyan-400' : isCompleted ? 'text-emerald-400' : 'text-gray-600'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : isActive ? (
                          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                            <Icon className="h-5 w-5" />
                          </motion.div>
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      <span className={`text-sm font-medium ${
                        isActive ? 'text-white' : isCompleted ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {step.label}
                      </span>
                      {isActive && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 3 }}
                          className="ml-auto h-0.5 bg-gradient-to-r from-cyan-500 to-transparent rounded-full max-w-[60px]"
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-center text-xs text-gray-500 mt-4"
              >
                This may take 10-30 seconds depending on the claim
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
