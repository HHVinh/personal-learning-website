import Link from 'next/link';

interface NavLink {
  label: string;
  href: string;
}

interface HeaderProps {
  logo?: React.ReactNode;
  logoHref?: string;
  navigation?: NavLink[];
}

const defaultNavigation: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Admin", href: "/admin" }
];

export default function Header({
  logo = <span className="text-2xl font-bold">📚 Learning Resources</span>,
  logoHref = "/",
  navigation = defaultNavigation
}: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-violet-600 to-blue-600 shadow-lg" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <Link href={logoHref} className="text-white" aria-label="Home">
            {logo}
          </Link>
          <nav className="flex space-x-4" aria-label="Main navigation">
            {navigation.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white hover:text-gray-200 transition-colors px-3 py-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

export type { HeaderProps, NavLink };
