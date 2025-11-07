'use client';

import { useEffect, useState } from 'react';
import { TrendSummary, TrendCategory, TrendStatus } from '@/types/trend';

export default function AdminTrendsPage() {
  const [trends, setTrends] = useState<TrendSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TrendStatus | 'all'>('pending_review');
  const [generating, setGenerating] = useState(false);
  const [selectedTrend, setSelectedTrend] = useState<TrendSummary | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTrend, setEditedTrend] = useState<TrendSummary | null>(null);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('admin_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setShowApiKeyPrompt(false);
    }
  }, []);

  // Save API key to localStorage
  const handleSaveApiKey = (key: string) => {
    localStorage.setItem('admin_api_key', key);
    setApiKey(key);
    setShowApiKeyPrompt(false);
  };

  // Get authorization headers
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  });

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
    if (!confirm('Generate today\'s AI news summary? This will fetch the top 5 TechCrunch AI articles and create a daily summary.')) {
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('/api/trends/generate', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          daysBack: 1,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Success! Generated daily AI news summary`);
        fetchTrends();
      } else {
        if (response.status === 401) {
          alert('Unauthorized: Please check your API key');
          setShowApiKeyPrompt(true);
        } else {
          alert(`Error: ${data.error || data.message}`);
        }
      }
    } catch (error) {
      console.error('Error generating trend:', error);
      alert('Failed to generate summary');
    } finally {
      setGenerating(false);
    }
  };

  // Update trend status
  const handleUpdateStatus = async (trendId: string, newStatus: TrendStatus) => {
    try {
      const response = await fetch(`/api/trends/${trendId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert(`Trend ${newStatus === 'published' ? 'published' : 'updated'}!`);
        fetchTrends();
        setSelectedTrend(null);
      } else {
        const data = await response.json();
        if (response.status === 401) {
          alert('Unauthorized: Please check your API key');
          setShowApiKeyPrompt(true);
        } else {
          alert(`Failed to update trend: ${data.error || response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Error updating trend:', error);
      alert('Failed to update trend');
    }
  };

  // Save edited trend
  const handleSaveEdit = async () => {
    if (!editedTrend || !editedTrend._id) return;

    try {
      const response = await fetch(`/api/trends/${editedTrend._id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: editedTrend.title,
          summary: editedTrend.summary,
          keyPoints: editedTrend.keyPoints,
          tags: editedTrend.tags,
        }),
      });

      if (response.ok) {
        alert('Trend updated successfully!');
        fetchTrends();
        setIsEditMode(false);
        setSelectedTrend(editedTrend);
      } else {
        const data = await response.json();
        if (response.status === 401) {
          alert('Unauthorized: Please check your API key');
          setShowApiKeyPrompt(true);
        } else {
          alert(`Failed to update trend: ${data.error || response.statusText}`);
        }
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
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        alert('Trend deleted!');
        fetchTrends();
        setSelectedTrend(null);
      } else {
        const data = await response.json();
        if (response.status === 401) {
          alert('Unauthorized: Please check your API key');
          setShowApiKeyPrompt(true);
        } else {
          alert(`Failed to delete trend: ${data.error || response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Error deleting trend:', error);
      alert('Failed to delete trend');
    }
  };

  // Enter edit mode
  const handleEnterEditMode = () => {
    setEditedTrend(selectedTrend);
    setIsEditMode(true);
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedTrend(null);
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
      {/* API Key Prompt Modal */}
      {showApiKeyPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Authentication</h2>
            <p className="text-gray-600 mb-4">
              Please enter your ADMIN_API_KEY to access the admin panel.
            </p>
            <input
              type="password"
              placeholder="Enter API Key"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const input = e.target as HTMLInputElement;
                  handleSaveApiKey(input.value);
                }
              }}
            />
            <button
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                handleSaveApiKey(input.value);
              }}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save API Key
            </button>
            <p className="text-sm text-gray-500 mt-4">
              This key will be stored in your browser's localStorage for future visits.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Trends Admin</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowApiKeyPrompt(true)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              title="Update API Key"
            >
              🔑 API Key
            </button>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {generating ? 'Generating...' : '🤖 Generate Daily Summary'}
            </button>
          </div>
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
                {isEditMode && editedTrend ? (
                  <input
                    type="text"
                    value={editedTrend.title}
                    onChange={(e) => setEditedTrend({ ...editedTrend, title: e.target.value })}
                    className="text-2xl font-bold text-gray-900 flex-1 border-b-2 border-blue-500 focus:outline-none"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-gray-900 flex-1">
                    {selectedTrend.title}
                  </h2>
                )}
                <button
                  onClick={() => {
                    setSelectedTrend(null);
                    setIsEditMode(false);
                    setEditedTrend(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl ml-4"
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
                {isEditMode && editedTrend ? (
                  <textarea
                    value={editedTrend.summary}
                    onChange={(e) => setEditedTrend({ ...editedTrend, summary: e.target.value })}
                    rows={8}
                    className="w-full text-gray-700 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedTrend.summary}</p>
                )}
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Key Points</h3>
                {isEditMode && editedTrend ? (
                  <div className="space-y-2">
                    {editedTrend.keyPoints.map((point, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type="text"
                          value={point}
                          onChange={(e) => {
                            const newPoints = [...editedTrend.keyPoints];
                            newPoints[i] = e.target.value;
                            setEditedTrend({ ...editedTrend, keyPoints: newPoints });
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => {
                            const newPoints = editedTrend.keyPoints.filter((_, idx) => idx !== i);
                            setEditedTrend({ ...editedTrend, keyPoints: newPoints });
                          }}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setEditedTrend({
                          ...editedTrend,
                          keyPoints: [...editedTrend.keyPoints, ''],
                        });
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      + Add Key Point
                    </button>
                  </div>
                ) : (
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {selectedTrend.keyPoints.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                )}
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
                  {isEditMode && editedTrend ? (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {editedTrend.tags?.map((tag, i) => (
                          <div key={i} className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                            <input
                              type="text"
                              value={tag}
                              onChange={(e) => {
                                const newTags = [...(editedTrend.tags || [])];
                                newTags[i] = e.target.value;
                                setEditedTrend({ ...editedTrend, tags: newTags });
                              }}
                              className="bg-transparent border-none focus:outline-none w-24"
                            />
                            <button
                              onClick={() => {
                                const newTags = (editedTrend.tags || []).filter((_, idx) => idx !== i);
                                setEditedTrend({ ...editedTrend, tags: newTags });
                              }}
                              className="text-red-600 hover:text-red-800 font-bold"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          setEditedTrend({
                            ...editedTrend,
                            tags: [...(editedTrend.tags || []), ''],
                          });
                        }}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
                      >
                        + Add Tag
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedTrend.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t">
                {isEditMode ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      💾 Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleEnterEditMode}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      ✏️ Edit
                    </button>
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
                  </>
                )}
                <button
                  onClick={() => {
                    setSelectedTrend(null);
                    setIsEditMode(false);
                    setEditedTrend(null);
                  }}
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
