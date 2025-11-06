import Anthropic from '@anthropic-ai/sdk';
import type { RSSFeedItem, SummarizationOutput, TrendCategory } from '@/types/trend';

// Initialize Anthropic client (or OpenAI as fallback)
const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

// Category descriptions for better AI context
const CATEGORY_DESCRIPTIONS = {
  agents: 'AI agents, autonomous systems, multi-agent frameworks, agentic workflows, and automation tools',
  business: 'Enterprise AI adoption, organizational strategy shifts, market trends, investments, and business impact',
  tools: 'Developer tools, frameworks, platforms, infrastructure, SDKs, and new releases',
  research: 'AI research papers, model breakthroughs, academic studies, and technical innovations',
};

// Generate summary using Claude API
async function summarizeWithClaude(
  category: TrendCategory,
  articles: RSSFeedItem[]
): Promise<SummarizationOutput> {
  if (!anthropic) {
    throw new Error('Anthropic API key not configured');
  }

  const categoryDesc = CATEGORY_DESCRIPTIONS[category];

  // Prepare articles text
  const articlesText = articles
    .map((article, index) => {
      return `
Article ${index + 1}:
Title: ${article.title}
Source: ${article.source}
Date: ${article.pubDate.toLocaleDateString()}
Content: ${article.description.slice(0, 500)}...
URL: ${article.link}
`;
    })
    .join('\n---\n');

  const prompt = `You are an AI trends analyst. Analyze the following articles about ${categoryDesc} and create a comprehensive daily summary.

${articlesText}

Generate a JSON response with the following structure:
{
  "title": "A compelling title for this trend summary (60-80 characters)",
  "summary": "A comprehensive summary (250-350 words) that synthesizes the key trends, developments, and implications from these articles. Write in an engaging, informative style.",
  "keyPoints": ["3-5 bullet points highlighting the most important takeaways"],
  "tags": ["5-8 relevant tags like specific company names, technologies, or concepts mentioned"]
}

Focus on:
1. What are the major developments or trends?
2. Why are they significant?
3. What's the potential impact on the industry?
4. Are there any common themes across articles?

Be concise, insightful, and professional. Avoid marketing language.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022', // Cost-efficient model
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Extract JSON from response (Claude sometimes wraps it in markdown)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from AI response');
    }

    const result = JSON.parse(jsonMatch[0]);

    return {
      title: result.title,
      summary: result.summary,
      keyPoints: result.keyPoints,
      tags: result.tags,
    };
  } catch (error) {
    console.error('Error generating summary with Claude:', error);
    throw error;
  }
}

// Fallback: Generate summary using OpenAI
async function summarizeWithOpenAI(
  category: TrendCategory,
  articles: RSSFeedItem[]
): Promise<SummarizationOutput> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const categoryDesc = CATEGORY_DESCRIPTIONS[category];

  const articlesText = articles
    .map((article, index) => {
      return `
Article ${index + 1}:
Title: ${article.title}
Source: ${article.source}
Date: ${article.pubDate.toLocaleDateString()}
Content: ${article.description.slice(0, 500)}...
URL: ${article.link}
`;
    })
    .join('\n---\n');

  const prompt = `You are an AI trends analyst. Analyze the following articles about ${categoryDesc} and create a comprehensive daily summary.

${articlesText}

Generate a JSON response with the following structure:
{
  "title": "A compelling title for this trend summary (60-80 characters)",
  "summary": "A comprehensive summary (250-350 words) that synthesizes the key trends, developments, and implications from these articles. Write in an engaging, informative style.",
  "keyPoints": ["3-5 bullet points highlighting the most important takeaways"],
  "tags": ["5-8 relevant tags like specific company names, technologies, or concepts mentioned"]
}

Focus on:
1. What are the major developments or trends?
2. Why are they significant?
3. What's the potential impact on the industry?
4. Are there any common themes across articles?

Be concise, insightful, and professional. Avoid marketing language.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Cost-efficient model
        messages: [
          {
            role: 'system',
            content: 'You are an AI trends analyst. Always respond with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return {
      title: result.title,
      summary: result.summary,
      keyPoints: result.keyPoints,
      tags: result.tags,
    };
  } catch (error) {
    console.error('Error generating summary with OpenAI:', error);
    throw error;
  }
}

// Main function: try Claude first, fallback to OpenAI
export async function generateTrendSummary(
  category: TrendCategory,
  articles: RSSFeedItem[]
): Promise<SummarizationOutput> {
  if (articles.length === 0) {
    throw new Error('No articles provided for summarization');
  }

  // Limit to most recent 10 articles to avoid token limits
  const limitedArticles = articles.slice(0, 10);

  try {
    if (anthropic) {
      return await summarizeWithClaude(category, limitedArticles);
    } else if (process.env.OPENAI_API_KEY) {
      return await summarizeWithOpenAI(category, limitedArticles);
    } else {
      throw new Error('No AI API key configured (ANTHROPIC_API_KEY or OPENAI_API_KEY)');
    }
  } catch (error) {
    // If primary fails, try fallback
    if (anthropic) {
      console.warn('Claude failed, trying OpenAI fallback');
      return await summarizeWithOpenAI(category, limitedArticles);
    }
    throw error;
  }
}

// Batch generate summaries for multiple categories
export async function generateAllSummaries(articlesByCategory: {
  agents?: RSSFeedItem[];
  business?: RSSFeedItem[];
  tools?: RSSFeedItem[];
  research?: RSSFeedItem[];
}): Promise<{
  category: TrendCategory;
  summary: SummarizationOutput;
  articles: RSSFeedItem[];
}[]> {
  const results: {
    category: TrendCategory;
    summary: SummarizationOutput;
    articles: RSSFeedItem[];
  }[] = [];

  for (const [category, articles] of Object.entries(articlesByCategory)) {
    if (articles && articles.length > 0) {
      try {
        const summary = await generateTrendSummary(category as TrendCategory, articles);
        results.push({
          category: category as TrendCategory,
          summary,
          articles: articles.slice(0, 10), // Store only the articles used
        });
      } catch (error) {
        console.error(`Failed to generate summary for ${category}:`, error);
      }
    }
  }

  return results;
}
