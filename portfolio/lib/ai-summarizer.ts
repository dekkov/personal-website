import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { RSSFeedItem, SummarizationOutput } from '@/types/trend';

// Initialize AI clients
const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const gemini = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Generate summary using Gemini (PRIMARY - FREE)
async function summarizeWithGemini(articles: RSSFeedItem[]): Promise<SummarizationOutput> {
  if (!gemini) {
    throw new Error('Gemini API key not configured');
  }

  const model = gemini.getGenerativeModel({ model: 'gemini-2.5-flash' }); // Fast and free

  // Prepare articles text
  const articlesText = articles
    .map((article, index) => {
      return `
Article ${index + 1}:
Title: ${article.title}
Source: ${article.source}
Date: ${article.pubDate.toLocaleDateString()}
Content: ${(article.description || '').slice(0, 500)}...
URL: ${article.link}
`;
    })
    .join('\n---\n');

  const prompt = `You are an AI trends analyst. Analyze the following TOP 5 AI news stories from TechCrunch today and create a compelling daily summary.

${articlesText}

Generate a JSON response with the following structure:
{
  "title": "A compelling title for today's AI news (60-80 characters)",
  "summary": "A comprehensive summary (250-350 words) that synthesizes the key trends, developments, and implications from these articles. Write in an engaging, informative style.",
  "keyPoints": ["3-5 bullet points highlighting the most important takeaways"],
  "tags": ["5-8 relevant tags like specific company names, technologies, or concepts mentioned"]
}

Focus on:
1. What are the major developments or trends today?
2. Why are they significant?
3. What's the potential impact on the AI industry?
4. Are there any common themes across articles?

Be concise, insightful, and professional. Avoid marketing language. Respond ONLY with valid JSON.`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Extract JSON from response (Gemini sometimes wraps it in markdown)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from Gemini response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      title: parsed.title,
      summary: parsed.summary,
      keyPoints: parsed.keyPoints,
      tags: parsed.tags,
    };
  } catch (error) {
    console.error('Error generating summary with Gemini:', error);
    throw error;
  }
}

// Generate summary using Claude API
async function summarizeWithClaude(articles: RSSFeedItem[]): Promise<SummarizationOutput> {
  if (!anthropic) {
    throw new Error('Anthropic API key not configured');
  }

  // Prepare articles text
  const articlesText = articles
    .map((article, index) => {
      return `
Article ${index + 1}:
Title: ${article.title}
Source: ${article.source}
Date: ${article.pubDate.toLocaleDateString()}
Content: ${(article.description || '').slice(0, 500)}...
URL: ${article.link}
`;
    })
    .join('\n---\n');

  const prompt = `You are an AI trends analyst. Analyze the following TOP 5 AI news stories from TechCrunch today and create a compelling daily summary.

${articlesText}

Generate a JSON response with the following structure:
{
  "title": "A compelling title for today's AI news (60-80 characters)",
  "summary": "A comprehensive summary (250-350 words) that synthesizes the key trends, developments, and implications from these articles. Write in an engaging, informative style.",
  "keyPoints": ["3-5 bullet points highlighting the most important takeaways"],
  "tags": ["5-8 relevant tags like specific company names, technologies, or concepts mentioned"]
}

Focus on:
1. What are the major developments or trends today?
2. Why are they significant?
3. What's the potential impact on the AI industry?
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
async function summarizeWithOpenAI(articles: RSSFeedItem[]): Promise<SummarizationOutput> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const articlesText = articles
    .map((article, index) => {
      return `
Article ${index + 1}:
Title: ${article.title}
Source: ${article.source}
Date: ${article.pubDate.toLocaleDateString()}
Content: ${(article.description || '').slice(0, 500)}...
URL: ${article.link}
`;
    })
    .join('\n---\n');

  const prompt = `You are an AI trends analyst. Analyze the following TOP 5 AI news stories from TechCrunch today and create a compelling daily summary.

${articlesText}

Generate a JSON response with the following structure:
{
  "title": "A compelling title for today's AI news (60-80 characters)",
  "summary": "A comprehensive summary (250-350 words) that synthesizes the key trends, developments, and implications from these articles. Write in an engaging, informative style.",
  "keyPoints": ["3-5 bullet points highlighting the most important takeaways"],
  "tags": ["5-8 relevant tags like specific company names, technologies, or concepts mentioned"]
}

Focus on:
1. What are the major developments or trends today?
2. Why are they significant?
3. What's the potential impact on the AI industry?
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

// Main function: try Gemini FIRST (free), then Claude, then OpenAI
export async function generateDailySummary(articles: RSSFeedItem[]): Promise<SummarizationOutput> {
  if (articles.length === 0) {
    throw new Error('No articles provided for summarization');
  }

  // Limit to top 5 articles
  const topArticles = articles.slice(0, 5);

  // Try Gemini first (FREE!)
  if (gemini) {
    try {
      console.log('Trying Gemini (primary)...');
      return await summarizeWithGemini(topArticles);
    } catch (error) {
      console.warn('Gemini failed, trying Claude fallback');
    }
  }

  // Try Claude second
  if (anthropic) {
    try {
      console.log('Trying Claude (fallback)...');
      return await summarizeWithClaude(topArticles);
    } catch (error) {
      console.warn('Claude failed, trying OpenAI fallback');
    }
  }

  // Try OpenAI third
  if (process.env.OPENAI_API_KEY) {
    try {
      console.log('Trying OpenAI (last fallback)...');
      return await summarizeWithOpenAI(topArticles);
    } catch (error) {
      console.warn('OpenAI failed');
      throw error;
    }
  }

  throw new Error('No AI providers available. Please configure GEMINI_API_KEY, ANTHROPIC_API_KEY, or OPENAI_API_KEY.');
}
