export type TrendCategory = 'agents' | 'business' | 'tools' | 'research';

export type TrendStatus = 'draft' | 'pending_review' | 'published' | 'archived';

export interface TrendSource {
  title: string;
  url: string;
  publishedAt: Date;
  feedSource?: string; // e.g., "TechCrunch", "Anthropic Blog"
}

export interface TrendSummary {
  _id?: string; // MongoDB ObjectId
  date: Date; // The date this trend summary represents
  category: TrendCategory;
  title: string; // AI-generated or manually edited
  summary: string; // Main summary text (200-400 words)
  keyPoints: string[]; // 3-5 bullet points
  sources: TrendSource[]; // Original articles used for summary
  status: TrendStatus;
  tags?: string[]; // Optional tags like "LangChain", "Enterprise AI"
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    reviewedBy?: string; // Admin who approved
    publishedAt?: Date;
    archivedAt?: Date;
  };
}

// For API responses with pagination
export interface TrendsResponse {
  trends: TrendSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// For the RSS aggregator
export interface RSSFeedItem {
  title: string;
  link: string;
  pubDate: Date;
  description?: string;
  content?: string;
  categories?: string[];
  source: string;
}

// For AI summarization input
export interface SummarizationInput {
  category: TrendCategory;
  articles: RSSFeedItem[];
  date: Date;
}

// For AI summarization output
export interface SummarizationOutput {
  title: string;
  summary: string;
  keyPoints: string[];
  tags: string[];
}
