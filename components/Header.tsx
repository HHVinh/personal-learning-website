import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-violet-600 to-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            📚 Learning Resources
          </Link>
          <nav className="flex space-x-4">
            <Link
              href="/"
              className="text-white hover:text-gray-200 transition-colors px-3 py-2 rounded-md"
            >
              Home
            </Link>
            <Link
              href="/admin"
              className="text-white hover:text-gray-200 transition-colors px-3 py-2 rounded-md bg-white/20"
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
