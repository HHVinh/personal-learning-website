'use client';

import { useState, useEffect } from 'react';
import { Resource } from '@/types';

interface ResourceListProps {
  initialResources: Resource[];
  topic: 'tin_a' | 'tin_b';
  error?: string | null;
}

// Constants for maintainability
const YOUTUBE_VIDEO_ID_REGEX = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
const GOOGLE_DRIVE_FILE_D_REGEX = /\/file\/d\/([^\/]+)/;

export default function ResourceList({ initialResources, topic, error }: ResourceListProps) {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Client-side filtering with Vietnamese locale support
    const filtered = initialResources.filter((resource) =>
      resource.title.toLocaleLowerCase('vi').includes(searchTerm.toLocaleLowerCase('vi'))
    );
    setResources(filtered);
  }, [searchTerm, initialResources]);

  const renderYouTubeEmbed = (url: string, title: string) => {
    // Extract video ID from various YouTube URL formats
    const videoIdMatch = url.match(YOUTUBE_VIDEO_ID_REGEX);
    if (!videoIdMatch) return null;

    const videoId = videoIdMatch[1];
    return (
      <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={`Video: ${title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          loading="lazy"
        />
      </div>
    );
  };

  const renderDocumentLink = (url: string, title: string) => {
    // For Google Drive, convert share link to direct download if needed
    let directDownloadUrl = url;

    // Pattern: /file/d/FILE_ID/view -> /uc?id=FILE_ID
    const fileDMatch = url.match(GOOGLE_DRIVE_FILE_D_REGEX);
    if (fileDMatch) {
      directDownloadUrl = `https://drive.google.com/uc?id=${fileDMatch[1]}&export=download`;
    }
    // Pattern: /open?id=FILE_ID
    else if (url.includes('/open?id=')) {
      directDownloadUrl = url.replace('/open?id=', '/uc?id=') + '&export=download';
    }

    return (
      <a
        href={directDownloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 group"
      >
        <div className="flex items-start">
          <div className="text-4xl mr-4">📄</div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <p className="text-blue-500 text-sm mt-1">Download Document →</p>
          </div>
        </div>
      </a>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 capitalize">
        {topic.replace('_', ' ')}
      </h1>

      {/* Search Input */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Tìm kiếm tài liệu..."
          aria-label="Tìm kiếm tài liệu"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center py-12 text-red-600">
          <p className="text-xl">❌ Lỗi: {error}</p>
          <p className="text-sm mt-2">Vui lòng thử lại sau</p>
        </div>
      )}

      {/* Resources Grid */}
      {!error && (
        <div className="space-y-6">
          {resources.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl">Không tìm thấy tài liệu nào</p>
              <p className="text-sm mt-2">Thêm tài liệu thông qua trang admin</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {resources.map((resource) => (
                <div key={resource.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  {resource.type === 'video' ? (
                    renderYouTubeEmbed(resource.url, resource.title)
                  ) : (
                    renderDocumentLink(resource.url, resource.title)
                  )}
                  {resource.description && (
                    <div className="p-4 bg-gray-50">
                      <p className="text-gray-600">{resource.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
