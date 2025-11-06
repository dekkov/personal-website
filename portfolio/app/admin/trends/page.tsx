'use client';

import { useEffect, useState } from 'react';
import { TrendSummary, TrendCategory, TrendStatus } from '@/types/trend';

export default function AdminTrendsPage() {
  const [trends, setTrends] = useState<TrendSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TrendStatus | 'all'>('pending_review');
  const [generating, setGenerating] = useState(false);
  const [selectedTrend, setSelectedTrend] = useState<TrendSummary | null>(null);

  // Fetch trends
  const fetchTrends = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter);
      params.set('limit', '50');

      const response = await fetch(`/api/trends?${params}`);
      const data = await response.json();
      setTrends(data.trends);
    } catch (error) {
      console.error('Error fetching trends:', error);
      alert('Failed to fetch trends');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, [filter]);

  // Generate new trends
  const handleGenerate = async () => {
    if (!confirm('Generate new trend summaries? This will fetch the latest articles and create draft summaries.')) {
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('/api/trends/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          daysBack: 1,
          categories: ['agents', 'business', 'tools'],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Success! Generated ${data.trends?.length || 0} trend summaries`);
        fetchTrends();
      } else {
        alert(`Error: ${data.error || data.message}`);
      }
    } catch (error) {
      console.error('Error generating trends:', error);
      alert('Failed to generate trends');
    } finally {
      setGenerating(false);
    }
  };

  // Update trend status
  const handleUpdateStatus = async (trendId: string, newStatus: TrendStatus) => {
    try {
      const response = await fetch(`/api/trends/${trendId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert(`Trend ${newStatus === 'published' ? 'published' : 'updated'}!`);
        fetchTrends();
        setSelectedTrend(null);
      } else {
        alert('Failed to update trend');
      }
    } catch (error) {
      console.error('Error updating trend:', error);
      alert('Failed to update trend');
    }
  };

  // Delete trend
  const handleDelete = async (trendId: string) => {
    if (!confirm('Are you sure you want to delete this trend?')) return;

    try {
      const response = await fetch(`/api/trends/${trendId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Trend deleted!');
        fetchTrends();
        setSelectedTrend(null);
      } else {
        alert('Failed to delete trend');
      }
    } catch (error) {
      console.error('Error deleting trend:', error);
      alert('Failed to delete trend');
    }
  };

  const getCategoryColor = (category: TrendCategory) => {
    const colors = {
      agents: 'bg-blue-100 text-blue-800',
      business: 'bg-green-100 text-green-800',
      tools: 'bg-purple-100 text-purple-800',
      research: 'bg-orange-100 text-orange-800',
    };
    return colors[category];
  };

  const getStatusColor = (status: TrendStatus) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      pending_review: 'bg-yellow-100 text-yellow-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-red-100 text-red-800',
    };
    return colors[status];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Trends Admin</h1>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {generating ? 'Generating...' : '🤖 Generate New Summaries'}
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          {['all', 'pending_review', 'published', 'draft'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        {/* Trends List */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : trends.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No trends found. Click "Generate New Summaries" to create some!
          </div>
        ) : (
          <div className="grid gap-4">
            {trends.map((trend) => (
              <div
                key={trend._id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedTrend(trend)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 flex-1">
                    {trend.title}
                  </h3>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(trend.category)}`}>
                      {trend.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(trend.status)}`}>
                      {trend.status}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-3 line-clamp-2">{trend.summary}</p>

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{new Date(trend.date).toLocaleDateString()}</span>
                  <span>{trend.sources.length} sources</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trend Detail Modal */}
        {selectedTrend && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex-1">
                  {selectedTrend.title}
                </h2>
                <button
                  onClick={() => setSelectedTrend(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="flex gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedTrend.category)}`}>
                  {selectedTrend.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTrend.status)}`}>
                  {selectedTrend.status}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedTrend.summary}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Key Points</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {selectedTrend.keyPoints.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Sources ({selectedTrend.sources.length})</h3>
                <div className="space-y-2">
                  {selectedTrend.sources.map((source, i) => (
                    <div key={i} className="text-sm">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {source.title}
                      </a>
                      <span className="text-gray-500 ml-2">
                        ({source.feedSource || 'Unknown'})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedTrend.tags && selectedTrend.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrend.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t">
                {selectedTrend.status === 'pending_review' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedTrend._id!, 'published')}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    ✓ Publish
                  </button>
                )}
                {selectedTrend.status === 'published' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedTrend._id!, 'draft')}
                    className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    Unpublish
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedTrend._id!)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedTrend(null)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 ml-auto"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
