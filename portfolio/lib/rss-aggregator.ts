import Parser from 'rss-parser';
import type { RSSFeedItem, TrendCategory } from '@/types/trend';

const parser = new Parser({
  customFields: {
    item: ['content:encoded', 'content'],
  },
});

// Curated RSS feeds for AI trends
export const RSS_FEEDS = {
  agents: [
    { url: 'https://www.anthropic.com/rss', name: 'Anthropic' },
    { url: 'https://openai.com/blog/rss.xml', name: 'OpenAI' },
    { url: 'https://blog.langchain.dev/rss/', name: 'LangChain' },
    { url: 'https://www.crewai.com/blog/rss.xml', name: 'CrewAI' },
  ],
  business: [
    { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', name: 'TechCrunch AI' },
    { url: 'https://venturebeat.com/category/ai/feed/', name: 'VentureBeat AI' },
    { url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', name: 'The Verge AI' },
  ],
  tools: [
    { url: 'https://huggingface.co/blog/feed.xml', name: 'Hugging Face' },
    { url: 'https://github.blog/category/ai-and-ml/feed/', name: 'GitHub AI/ML' },
    { url: 'https://aws.amazon.com/blogs/machine-learning/feed/', name: 'AWS ML Blog' },
    { url: 'https://blog.google/technology/ai/rss/', name: 'Google AI' },
  ],
  research: [
    { url: 'https://deepmind.google/blog/rss.xml', name: 'DeepMind' },
    { url: 'https://ai.meta.com/blog/rss/', name: 'Meta AI' },
  ],
} as const;

// Keywords to filter relevant articles
const CATEGORY_KEYWORDS = {
  agents: [
    'agent', 'agentic', 'autonomous', 'multi-agent', 'workflow', 'automation',
    'langchain', 'autogen', 'crewai', 'function calling', 'tool use',
  ],
  business: [
    'enterprise', 'adoption', 'strategy', 'business', 'organization', 'market',
    'investment', 'funding', 'acquisition', 'partnership', 'revenue', 'ROI',
    'deployment', 'implementation',
  ],
  tools: [
    'framework', 'library', 'tool', 'platform', 'infrastructure', 'API',
    'SDK', 'release', 'update', 'integration', 'development', 'developer',
    'open source', 'repository',
  ],
  research: [
    'paper', 'research', 'model', 'algorithm', 'breakthrough', 'study',
    'experiment', 'benchmark', 'performance', 'architecture', 'training',
  ],
};

// Fetch and parse a single RSS feed
async function fetchFeed(url: string, sourceName: string): Promise<RSSFeedItem[]> {
  try {
    const feed = await parser.parseURL(url);

    return feed.items.map((item) => ({
      title: item.title || 'Untitled',
      link: item.link || '',
      pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
      description: item.contentSnippet || item.content || item.description || '',
      content: (item as any)['content:encoded'] || item.content || item.contentSnippet || '',
      categories: item.categories || [],
      source: sourceName,
    }));
  } catch (error) {
    console.error(`Error fetching feed from ${sourceName}:`, error);
    return [];
  }
}

// Check if article is relevant to a category
function isRelevantToCategory(article: RSSFeedItem, category: TrendCategory): boolean {
  const text = `${article.title} ${article.description}`.toLowerCase();
  const keywords = CATEGORY_KEYWORDS[category];

  // Check if any keyword appears in the text
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

// Fetch feeds for a specific category
export async function fetchFeedsForCategory(
  category: TrendCategory,
  daysBack = 1
): Promise<RSSFeedItem[]> {
  const feeds = RSS_FEEDS[category];
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  // Fetch all feeds in parallel
  const allArticlesPromises = feeds.map((feed) => fetchFeed(feed.url, feed.name));
  const allArticlesArrays = await Promise.all(allArticlesPromises);

  // Flatten and filter
  const allArticles = allArticlesArrays.flat();

  // Filter by date and relevance
  const relevantArticles = allArticles.filter((article) => {
    const isRecent = article.pubDate >= cutoffDate;
    const isRelevant = isRelevantToCategory(article, category);
    return isRecent && isRelevant;
  });

  // Deduplicate by URL
  const uniqueArticles = Array.from(
    new Map(relevantArticles.map((article) => [article.link, article])).values()
  );

  // Sort by date (newest first)
  uniqueArticles.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return uniqueArticles;
}

// Fetch feeds for all categories
export async function fetchAllFeeds(daysBack = 1): Promise<{
  agents: RSSFeedItem[];
  business: RSSFeedItem[];
  tools: RSSFeedItem[];
  research: RSSFeedItem[];
}> {
  const [agents, business, tools, research] = await Promise.all([
    fetchFeedsForCategory('agents', daysBack),
    fetchFeedsForCategory('business', daysBack),
    fetchFeedsForCategory('tools', daysBack),
    fetchFeedsForCategory('research', daysBack),
  ]);

  return { agents, business, tools, research };
}

// Get article excerpt (first N characters)
export function getArticleExcerpt(content: string, maxLength = 500): string {
  const cleaned = content.replace(/<[^>]*>/g, '').trim(); // Remove HTML tags
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.slice(0, maxLength).trim() + '...';
}
