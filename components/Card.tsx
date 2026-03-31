import Link from 'next/link';

interface CardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: 'violet' | 'blue';
}

export default function Card({ title, description, href, icon, color }: CardProps) {
  const gradients = {
    violet: 'from-violet-500 to-purple-600',
    blue: 'from-blue-500 to-cyan-600',
  };

  return (
    <Link href={href}>
      <div className={`bg-gradient-to-br ${gradients[color]} rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl cursor-pointer`}>
        <div className="p-8 text-white">
          <div className="text-6xl mb-4">{icon}</div>
          <h2 className="text-3xl font-bold mb-3">{title}</h2>
          <p className="text-white/90 text-lg">{description}</p>
          <div className="mt-4 inline-flex items-center text-white font-semibold">
            View Resources →
          </div>
        </div>
      </div>
    </Link>
  );
}
