'use client';

import Link from 'next/link';

export interface CardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: 'violet' | 'blue' | 'emerald';
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
}

const gradients = {
  violet: 'from-violet-500 to-purple-600',
  blue: 'from-blue-500 to-cyan-600',
  emerald: 'from-emerald-500 to-teal-600',
} as const;

const sizeClasses = {
  sm: 'p-4 text-base',
  md: 'p-8 text-lg',
  lg: 'p-12 text-xl'
} as const;

export default function Card({
  title,
  description,
  href,
  icon,
  color,
  size = 'md',
  ariaLabel
}: CardProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel || `View ${title} resources`}
      className={`block bg-gradient-to-br ${gradients[color]} rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl ${sizeClasses[size]}`}
    >
      <div className="text-white">
        <div className="text-6xl mb-4">{icon}</div>
        <h2 className="text-3xl font-bold mb-3">{title}</h2>
        <p className="text-white/90">{description}</p>
        <div className="mt-4 inline-flex items-center text-white font-semibold">
          View Resources →
        </div>
      </div>
    </Link>
  );
}
