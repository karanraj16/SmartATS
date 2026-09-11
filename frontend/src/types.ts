export interface AiResult {
  filename: string;
  match_percentage: number;
  matched_keywords: string[];
  missing_keywords: string[];
  important_jd_keywords: string[];
  short_summary: string;
  ats_readability: {
    score: number;
    feedback: string;
  };
  cover_letter: string;
}