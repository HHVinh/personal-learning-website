interface FooterProps {
  copyrightText?: string;
  showBuiltWith?: boolean;
  children?: React.ReactNode;
}

export default function Footer({
  copyrightText = `© ${new Date().getFullYear()} Personal Learning Resources`,
  showBuiltWith = true,
  children
}: FooterProps) {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-300">{copyrightText}</p>
        {showBuiltWith && (
          <p className="text-gray-400 text-sm mt-2">
            Built with Next.js & Cloudflare D1.
          </p>
        )}
        {children}
      </div>
    </footer>
  );
}

export type { FooterProps };
