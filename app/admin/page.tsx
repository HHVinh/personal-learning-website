'use client';

import { useState, useEffect } from 'react';
import { Resource, Topic } from '@/types';

interface AdminPageProps {
  params: Promise<{ topic?: string }>;
}

export default function AdminPage({ params }: AdminPageProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'document' as 'document' | 'video',
    topic: 'tin_a' as Topic,
    url: '',
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources');
      if (!response.ok) throw new Error('Failed to fetch resources');
      const data = await response.json();
      setResources(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to add resource');
      setFormData({ title: '', description: '', type: 'document', topic: 'tin_a', url: '' });
      fetchResources();
      alert('Thêm tài liệu thành công!');
    } catch (err) {
      alert('Lỗi: ' + (err instanceof Error ? err.message : 'Failed to add resource'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa tài liệu này?')) return;
    try {
      const response = await fetch(`/api/resources/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete resource');
      fetchResources();
    } catch (err) {
      alert('Lỗi: ' + (err instanceof Error ? err.message : 'Failed to delete resource'));
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Resource Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Thêm tài liệu mới</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Loại</label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'document' | 'video' })}
                  >
                    <option value="document">Tài liệu</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Chủ đề</label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value as Topic })}
                  >
                    <option value="tin_a">Tin A</option>
                    <option value="tin_b">Tin B</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">URL</label>
                <input
                  type="url"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
              >
                Thêm tài liệu
              </button>
            </form>
          </div>

          {/* Resource List */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Danh sách tài liệu ({resources.length})</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {resources.length === 0 ? (
                <p className="text-gray-500">Chưa có tài liệu nào</p>
              ) : (
                resources.map((resource) => (
                  <div key={resource.id} className="border rounded p-3 flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium">{resource.title}</h3>
                      <p className="text-sm text-gray-600">{resource.description}</p>
                      <div className="flex gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded text-xs ${resource.type === 'document' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {resource.type === 'document' ? '📄 Document' : '🎥 Video'}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${resource.topic === 'tin_a' ? 'bg-violet-100 text-violet-800' : 'bg-blue-100 text-blue-800'}`}>
                          {resource.topic === 'tin_a' ? 'Tin A' : 'Tin B'}
                        </span>
                      </div>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        {resource.url}
                      </a>
                    </div>
                    <button
                      onClick={() => handleDelete(resource.id!)}
                      className="ml-4 text-red-600 hover:text-red-800 text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
