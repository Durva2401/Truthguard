// ========================
// TruthGuard Shared Types
// ========================

export type InputType = 'url' | 'text' | 'social';

export type Verdict = 'true' | 'false' | 'misleading' | 'unverified' | 'satire' | 'too_recent';

export interface Source {
  title: string;
  url: string;
  publisher: string;
  credibility_score: number;
  supports_claim: boolean;
  snippet?: string;
}

export interface ExtractedClaim {
  claim: string;
  importance: 'high' | 'medium' | 'low';
}

export interface ClaudeVerificationResponse {
  verdict: Verdict;
  confidence: number;
  reasoning: string;
  supporting_sources: Source[];
  contradicting_sources: Source[];
  summary: string;
}

export interface Check {
  id: string;
  user_id: string | null;
  input_type: InputType;
  raw_input: string;
  extracted_claims: ExtractedClaim[];
  verdict: Verdict;
  confidence_score: number;
  sources: Source[];
  summary: string;
  created_at: string;
}

export interface CachedClaim {
  claim_hash: string;
  verdict: Verdict;
  confidence_score: number;
  sources: Source[];
  expires_at: string;
}

export interface VerifyRequest {
  input: string;
  type: InputType;
}

export interface VerifyResponse {
  id: string;
  verdict: Verdict;
  confidence_score: number;
  summary: string;
  sources: Source[];
  extracted_claims: ExtractedClaim[];
  created_at: string;
}

export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  published_date?: string;
}

export interface TavilySearchResponse {
  results: TavilySearchResult[];
  query: string;
}

export interface FactCheckClaimReview {
  publisher: {
    name: string;
    site: string;
  };
  url: string;
  title: string;
  textualRating: string;
  languageCode: string;
}

export interface FactCheckResult {
  text: string;
  claimant?: string;
  claimReview: FactCheckClaimReview[];
}

export interface VerdictDisplay {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
}

export const VERDICT_MAP: Record<Verdict, VerdictDisplay> = {
  true: {
    label: 'TRUE',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    icon: '✅',
    description: 'This claim checks out',
    gradientFrom: 'from-emerald-500/20',
    gradientTo: 'to-emerald-600/5',
  },
  false: {
    label: 'FALSE',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    icon: '❌',
    description: 'This claim has been debunked',
    gradientFrom: 'from-red-500/20',
    gradientTo: 'to-red-600/5',
  },
  misleading: {
    label: 'MISLEADING',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    icon: '⚠️',
    description: 'True facts, false framing',
    gradientFrom: 'from-amber-500/20',
    gradientTo: 'to-amber-600/5',
  },
  unverified: {
    label: 'UNVERIFIED',
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/10',
    borderColor: 'border-gray-500/30',
    icon: '🔍',
    description: 'No evidence found either way',
    gradientFrom: 'from-gray-500/20',
    gradientTo: 'to-gray-600/5',
  },
  too_recent: {
    label: 'TOO RECENT',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    icon: '⏳',
    description: 'Breaking news — too early to verify',
    gradientFrom: 'from-blue-500/20',
    gradientTo: 'to-blue-600/5',
  },
  satire: {
    label: 'SATIRE',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    icon: '🎭',
    description: 'This appears to be satire',
    gradientFrom: 'from-purple-500/20',
    gradientTo: 'to-purple-600/5',
  },
};
