'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Link, Type, Search, Loader2, Upload } from 'lucide-react';
import type { InputType, VerifyResponse } from '@/types';

interface InputFormProps {
  onResult: (result: VerifyResponse) => void;
  onLoading: (loading: boolean) => void;
  onStep: (step: string) => void;
  onError: (error: string | null) => void;
}

export default function InputForm({ onResult, onLoading, onStep, onError }: InputFormProps) {
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('text');

  const handleSubmit = async (input: string, type: InputType) => {
    if (!input.trim()) return;

    setIsLoading(true);
    onLoading(true);
    onError(null);

    try {
      // Animate through steps
      onStep('Extracting claims...');
      await new Promise((r) => setTimeout(r, 800));

      onStep('Searching sources...');

      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, type }),
      });

      onStep('Analyzing evidence...');
      await new Promise((r) => setTimeout(r, 500));

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Verification failed');
      }

      const result: VerifyResponse = await response.json();
      onStep('Generating verdict...');
      await new Promise((r) => setTimeout(r, 400));

      onResult(result);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
      onLoading(false);
      onStep('');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    onLoading(true);
    onError(null);
    onStep('Reading screenshot...');

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        onStep('Extracting text from image...');

        // Call OCR endpoint to extract text from screenshot
        const ocrResponse = await fetch('/api/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 }),
        });

        if (!ocrResponse.ok) {
          throw new Error('Failed to extract text from image');
        }

        const { text } = await ocrResponse.json();

        if (!text || text.trim().length < 10) {
          throw new Error('Could not read any text from the screenshot. Try a clearer image.');
        }

        onStep('Verifying extracted text...');
        await handleSubmit(text, 'text');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to process image');
      setIsLoading(false);
      onLoading(false);
      onStep('');
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="relative">
        {/* Glassmorphism card */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl blur-xl" />
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 rounded-xl p-1.5 h-14 text-base">
              <TabsTrigger
                value="text"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-white text-gray-200 rounded-lg transition-all duration-300 gap-2"
              >
                <Type className="h-4 w-4" />
                <span className="hidden sm:inline">Paste Text</span>
                <span className="sm:hidden">Text</span>
              </TabsTrigger>
              <TabsTrigger
                value="url"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white text-gray-200 rounded-lg transition-all duration-300 gap-2"
              >
                <Link className="h-4 w-4" />
                <span className="hidden sm:inline">Paste URL</span>
                <span className="sm:hidden">URL</span>
              </TabsTrigger>
              <TabsTrigger
                value="screenshot"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:text-white text-gray-200 rounded-lg transition-all duration-300 gap-2"
              >
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Screenshot</span>
                <span className="sm:hidden">Image</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-6 space-y-4">
              <div className="space-y-3">
                <label className="text-base text-white font-semibold">
                  Paste a claim, WhatsApp forward, or any text
                </label>
                <Textarea
                  id="text-input"
                  placeholder="e.g., 'Scientists discover that drinking coffee doubles your lifespan'"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-[200px] text-lg p-4 bg-white/5 border-white/20 text-white placeholder:text-gray-300 focus:border-cyan-500/50 focus:ring-cyan-500/20 resize-none rounded-xl"
                  disabled={isLoading}
                />
              </div>
              <Button
                id="check-text-btn"
                onClick={() => handleSubmit(textInput, 'text')}
                disabled={isLoading || !textInput.trim()}
                className="w-full h-14 text-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Check Now
                  </span>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="url" className="mt-6 space-y-4">
              <div className="space-y-3">
                <label className="text-base text-white font-semibold">
                  Paste a news article or social media URL
                </label>
                <Input
                  id="url-input"
                  type="url"
                  placeholder="https://example.com/article..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="h-14 text-lg px-4 bg-white/5 border-white/20 text-white placeholder:text-gray-300 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-xl"
                  disabled={isLoading}
                />
              </div>
              <Button
                id="check-url-btn"
                onClick={() => handleSubmit(urlInput, 'url')}
                disabled={isLoading || !urlInput.trim()}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Check Now
                  </span>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="screenshot" className="mt-6 space-y-4">
              <div className="space-y-3">
                <label className="text-base text-white font-semibold">
                  Upload a screenshot of the claim
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="screenshot-input"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="screenshot-input"
                    className="flex flex-col items-center justify-center w-full h-52 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-purple-500/50 transition-all duration-300 bg-white/5"
                  >
                    <Upload className="h-12 w-12 text-gray-200 mb-3" />
                    <span className="text-base text-white font-medium">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-sm text-gray-200 mt-1">
                      PNG, JPG, WebP up to 10MB
                    </span>
                  </label>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
}
