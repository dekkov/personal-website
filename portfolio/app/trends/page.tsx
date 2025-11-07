'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendSummary, TrendCategory } from '@/types/trend';

export default function TrendsPage() {
  const [trends, setTrends] = useState<TrendSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<TrendCategory | 'all'>('all');

  const fetchTrends = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        status: 'published',
      });

      if (categoryFilter !== 'all') {
        params.set('category', categoryFilter);
      }

      const response = await fetch(`/api/trends?${params}`);
      const data = await response.json();

      // Check if response is successful
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to load trends');
      }

      // Validate data structure
      if (!data.trends || !data.pagination) {
        throw new Error('Invalid response format from server');
      }

      setTrends(data.trends);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching trends:', error);
      setError(error instanceof Error ? error.message : 'Failed to load trends');
      setTrends([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, [page, categoryFilter]);

  const getCategoryColor = (category: TrendCategory) => {
    const colors = {
      agents: 'bg-blue-100 text-blue-800 border-blue-200',
      business: 'bg-green-100 text-green-800 border-green-200',
      tools: 'bg-purple-100 text-purple-800 border-purple-200',
      research: 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[category];
  };

  const categoryLabels: Record<TrendCategory | 'all', string> = {
    all: 'All Trends',
    agents: 'AI Agents',
    business: 'Business',
    tools: 'Tools',
    research: 'Research',
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Trends
          </h1>
          <p className="text-xl text-gray-600">
            Daily summaries of the latest developments in AI agents, business strategy, and tools
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Category Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          {(['all', 'agents', 'business', 'tools', 'research'] as const).map((category) => (
            <button
              key={category}
              onClick={() => {
                setCategoryFilter(category);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                categoryFilter === category
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>

        {/* Trends List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-red-800 font-semibold mb-2">Unable to load trends</p>
              <p className="text-red-600 text-sm">{error}</p>
              <button
                onClick={() => fetchTrends()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : trends.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No trends found. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {trends.map((trend) => (
              <article
                key={trend._id}
                className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
              >
                {/* Category Badge & Date */}
                <div className="flex justify-between items-center mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(
                      trend.category
                    )}`}
                  >
                    {categoryLabels[trend.category]}
                  </span>
                  <time className="text-sm text-gray-500">
                    {new Date(trend.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {trend.title}
                </h2>

                {/* Summary */}
                <p className="text-gray-700 leading-relaxed mb-4">
                  {trend.summary}
                </p>

                {/* Key Points */}
                {trend.keyPoints && trend.keyPoints.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      Key Takeaways:
                    </h3>
                    <ul className="space-y-1">
                      {trend.keyPoints.map((point, i) => (
                        <li key={i} className="text-gray-700 flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tags */}
                {trend.tags && trend.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {trend.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Sources */}
                {trend.sources && trend.sources.length > 0 && (
                  <details className="group">
                    <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900 font-medium">
                      View {trend.sources.length} source{trend.sources.length !== 1 ? 's' : ''}
                    </summary>
                    <ul className="mt-3 space-y-2 pl-4">
                      {trend.sources.map((source, i) => (
                        <li key={i} className="text-sm">
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {source.title}
                          </a>
                          {source.feedSource && (
                            <span className="text-gray-500 ml-2">
                              — {source.feedSource}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <span className="text-gray-600">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
