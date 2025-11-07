import Parser from 'rss-parser';
import type { RSSFeedItem } from '@/types/trend';

const parser = new Parser({
  customFields: {
    item: ['content:encoded', 'content'],
  },
});

// Simplified: Just TechCrunch AI news
export const TECHCRUNCH_AI_FEED = 'https://techcrunch.com/category/artificial-intelligence/feed/';

// Fetch TechCrunch AI feed and return top N articles
export async function fetchTopAINews(limit = 5, daysBack = 1): Promise<RSSFeedItem[]> {
  try {
    const feed = await parser.parseURL(TECHCRUNCH_AI_FEED);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);

    // Parse and filter articles
    const articles: RSSFeedItem[] = feed.items
      .map((item) => ({
        title: item.title || 'Untitled',
        link: item.link || '',
        pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
        description: item.contentSnippet || item.content || item.description || '',
        content: (item as any)['content:encoded'] || item.content || item.contentSnippet || '',
        categories: item.categories || [],
        source: 'TechCrunch AI',
      }))
      .filter((article) => article.pubDate >= cutoffDate);

    // Sort by date (newest first) and return top N
    articles.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
    return articles.slice(0, limit);
  } catch (error) {
    console.error('Error fetching TechCrunch AI feed:', error);
    return [];
  }
}

// Get article excerpt (first N characters)
export function getArticleExcerpt(content: string, maxLength = 500): string {
  const cleaned = content.replace(/<[^>]*>/g, '').trim(); // Remove HTML tags
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.slice(0, maxLength).trim() + '...';
}
