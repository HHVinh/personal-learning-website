import Card from '@/components/Card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Learning Resources
          </h1>
          <p className="text-xl text-gray-600">
            Chọn chủ đề để xem tài liệu và video học tập
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card
            title="Tin A"
            description="Tài liệu và video cho chủ đề Tin A"
            href="/tin-a"
            icon="📘"
            color="violet"
          />
          <Card
            title="Tin B"
            description="Tài liệu và video cho chủ đề Tin B"
            href="/tin-b"
            icon="📗"
            color="blue"
          />
          <Card
            title="Admin"
            description="Quản lý tài liệu và video"
            href="/admin"
            icon="⚙️"
            color="emerald"
          />
        </div>
      </div>
    </div>
  );
}
