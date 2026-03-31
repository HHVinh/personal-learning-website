export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-300">
          © {new Date().getFullYear()} Personal Learning Resources. Built with Next.js & Cloudflare D1.
        </p>
      </div>
    </footer>
  );
}
