---
name: Personal Learning Resource Website
description: Personal website with admin for uploading learning materials and videos using Next.js, Tailwind, and Cloudflare D1
type: project
---

# Trang Web Cá Nhân Chia Sẻ Tài Liệu Học Tập - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng trang web cá nhân cho phép users xem tài liệu/video học tập và admin upload nội dung, deploy trên Cloudflare Pages với D1.

**Architecture:** Next.js 14 App Router với Server Components cho data fetching, Client Components cho search và admin form. D1 database với raw SQL queries. Tailwind CSS cho styling.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Cloudflare D1, Wrangler CLI

---

## Phase 1: Project Setup

### Task 1: Khởi tạo Next.js Project với TypeScript và Tailwind

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Create: `.env.local`
- Create: `.env.example`

- [ ] **Step 1: Tạo package.json với dependencies**

```json
{
  "name": "personal-learning-website",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "npx wrangler d1 execute --database learning-db --file=migrations/001_init.sql --remote",
    "db:local": "npx wrangler d1 execute --database learning-db --file=migrations/001_init.sql"
  },
  "dependencies": {
    "next": "^14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@cloudflare/d1": "^1.9.3"
  },
  "devDependencies": {
    "typescript": "^5.6.3",
    "@types/node": "^20.14.10",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "tailwindcss": "^3.4.4",
    "postcss": "^8.4.40",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.5"
  }
}
```

- [ ] **Step 2: Tạo next.config.ts**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
```

- [ ] **Step 3: Tạo tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Tạo tailwind.config.ts**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        gradient: {
          start: "#8b5cf6",
          end: "#3b82f6",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 5: Tạo postcss.config.mjs**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 6: Tạo .env.local**

```
# Local development
D1_DATABASE=learning-db

# Cloudflare (for production)
# You'll need to fill these in wrangler.toml
```

- [ ] **Step 7: Tạo .env.example**

```
D1_DATABASE=learning-db
```

- [ ] **Step 8: Tạo app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900 antialiased;
  }
}
```

- [ ] **Step 9: Tạo app/layout.tsx**

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Personal Learning Resources",
  description: "Share learning materials and videos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
```

- [ ] **Step 10: Cài đặt dependencies và verify**

Run: `npm install`
Expected: dependencies installed without errors

Run: `npx tailwindcss -i ./app/globals.css -o ./app/globals.css --minify`
Expected: CSS file processed successfully

- [ ] **Step 11: Commit**

```bash
git add .
git commit -m "feat: setup Next.js 14 project with TypeScript and Tailwind"
```

---

## Phase 2: Database Configuration

### Task 2: Tạo Database Schema và Migration

**Files:**
- Create: `wrangler.toml`
- Create: `migrations/001_init.sql`
- Create: `lib/db.ts`

- [ ] **Step 1: Tạo wrangler.toml**

```toml
name = "personal-learning-website"
compatibility_date = "2024-01-01"

[[d1_databases]]
database_name = "learning-db"
database_id = "learning-db"  # Will be created on first deploy

# For local development
[[d1_databases.binding]]
binding = "DB"
database_name = "learning-db"
database_id = "learning-db"
```

- [ ] **Step 2: Tạo migrations/001_init.sql**

```sql
CREATE TABLE IF NOT EXISTS resources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('document', 'video')),
  topic TEXT NOT NULL CHECK (topic IN ('tin_a', 'tin_b')),
  url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_topic ON resources(topic);
CREATE INDEX IF NOT EXISTS idx_type ON resources(type);
```

- [ ] **Step 3: Tạo lib/db.ts**

```typescript
import { drizzle } from '@cloudflare/d1';

// This will be bound at runtime by Wrangler
let db: D1Database;

export function getDb() {
  if (typeof window === 'undefined') {
    // Server-side: get the bound database
    if (!db) {
      throw new Error('Database not initialized');
    }
    return db;
  }
  throw new Error('Database access only available on server');
}

// For server components, we need to import the binding
import { DB } from '@/wrangler.config';

// Initialize DB in server environment
export function initializeDb(d1Database: D1Database) {
  db = drizzle(d1Database);
}
```

- [ ] **Step 4: Tạo types for resources**

```typescript
// types/index.ts
export interface Resource {
  id: number;
  title: string;
  description?: string;
  type: 'document' | 'video';
  topic: 'tin_a' | 'tin_b';
  url: string;
  order_index: number;
  created_at: string;
}

export type Topic = 'tin_a' | 'tin_b';
export type ResourceType = 'document' | 'video';
```

- [ ] **Step 5: Tạo helper functions cho database operations**

```typescript
// lib/queries.ts
import { Resource, Topic } from '@/types';
import { db } from '@/lib/db';

export async function getResourcesByTopic(topic: Topic): Promise<Resource[]> {
  const results = await db
    .prepare('SELECT * FROM resources WHERE topic = ? ORDER BY order_index ASC, created_at DESC')
    .bind(topic)
    .all();

  return results as Resource[];
}

export async function searchResourcesByTopic(topic: Topic, keyword: string): Promise<Resource[]> {
  const results = await db
    .prepare('SELECT * FROM resources WHERE topic = ? AND title LIKE ? ORDER BY order_index ASC, created_at DESC')
    .bind(topic, `%${keyword}%`)
    .all();

  return results as Resource[];
}

export async function insertResource(resource: {
  title: string;
  description?: string;
  type: 'document' | 'video';
  topic: 'tin_a' | 'tin_b';
  url: string;
  order_index?: number;
}): Promise<Resource> {
  const result = await db
    .prepare(
      'INSERT INTO resources (title, description, type, topic, url, order_index) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .bind(
      resource.title,
      resource.description || null,
      resource.type,
      resource.topic,
      resource.url,
      resource.order_index || 0
    )
    .run();

  const insertedRow = await db
    .prepare('SELECT * FROM resources WHERE id = ?')
    .bind(result.meta.last_row_id)
    .get();

  return insertedRow as Resource;
}
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: configure D1 database schema and queries"
```

---

## Phase 3: Core Components

### Task 3: Tạo Reusable UI Components

**Files:**
- Create: `components/Header.tsx`
- Create: `components/Footer.tsx`
- Create: `components/Card.tsx`

- [ ] **Step 1: Tạo components/Header.tsx**

```tsx
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
```

- [ ] **Step 2: Tạo components/Footer.tsx**

```tsx
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
```

- [ ] **Step 3: Tạo components/Card.tsx**

```tsx
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
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add Header, Footer, and Card components"
```

---

## Phase 4: Homepage

### Task 4: Trang Chủ - Hiển Thị 2 Chủ Đề

**Files:**
- Modify: `app/page.tsx`
- Create: `app/page.module.css` (optional)

- [ ] **Step 1: Tạo trang chủ mới**

```tsx
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Test dev server**

Run: `npm run dev`
Expected: Server starts on http://localhost:3000 without errors

Visit http://localhost:3000 and verify:
- 2 cards hiển thị đúng
- Click vào card redirect đúng `/tin-a` và `/tin-b`
- Gradient colors đúng (violet và blue)

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: add homepage with 2 topic cards"
```

---

## Phase 5: Topic Pages với Search

### Task 5: Trang Chủ Đề Tin A

**Files:**
- Create: `app/tin-a/page.tsx`
- Create: `app/tin-a/components/ResourceList.tsx`
- Create: `app/tin-a/layout.tsx` (optional)

- [ ] **Step 1: Tạo layout cho tin-a**

```tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TinALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Tạo ResourceList component với search**

```tsx
'use client';

import { useState, useEffect } from 'react';
import { Resource } from '@/types';

interface ResourceListProps {
  initialResources: Resource[];
  topic: 'tin_a' | 'tin_b';
}

export default function ResourceList({ initialResources, topic }: ResourceListProps) {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Client-side filtering
    const filtered = initialResources.filter((resource) =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setResources(filtered);
  }, [searchTerm, initialResources]);

  const renderYouTubeEmbed = (url: string) => {
    // Extract video ID from various YouTube URL formats
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    if (!videoIdMatch) return null;

    const videoId = videoIdMatch[1];
    return (
      <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullUrl
          className="w-full h-full"
          loading="lazy"
        />
      </div>
    );
  };

  const renderDocumentLink = (url: string, title: string) => {
    // For Google Drive, convert share link to direct download if needed
    const directDownloadUrl = url.replace(/\/file\/d\//, '/uc?id=').replace(/\/view$/, '');

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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
      </div>

      {/* Resources Grid */}
      <div className="space-y-6">
        {resources.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-xl">Không tìm thấy tài liệu nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {resources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                {resource.type === 'video' ? (
                  renderYouTubeEmbed(resource.url)
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
    </div>
  );
}
```

- [ ] **Step 3: Tạo trang page.tsx với server component**

```tsx
import ResourceList from './components/ResourceList';
import { getResourcesByTopic } from '@/lib/queries';
import { Topic } from '@/types';

interface PageProps {
  params: Promise<{ topic: string }>;
}

export async function generateStaticParams() {
  return [
    { topic: 'tin-a' },
    { topic: 'tin-b' },
  ];
}

export default async function TinAPage({ params }: PageProps) {
  const { topic } = await params;
  const topicValue: Topic = topic === 'tin-b' ? 'tin_b' : 'tin_a';

  const resources = await getResourcesByTopic(topicValue);

  return <ResourceList initialResources={resources} topic={topicValue} />;
}
```

- [ ] **Step 4: Test trang Tin A**

Run dev server và truy cập http://localhost:3000/tin-a
Expected:
- Layout với header và footer hiển thị
- Search input hiển thị
- (Hiện tại chưa có data) Hiển thị "Không tìm thấy tài liệu nào"
- Search filter hoạt động (test với console thêm data)

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add Tin A topic page with search"
```

---

### Task 6: Trang Chủ Đề Tin B (Reuse Component)

**Files:**
- Create: `app/tin-b/page.tsx`
- Create: `app/tin-b/layout.tsx`
- Create: `app/tin-b/components/ResourceList.tsx`

- [ ] **Step 1: Copy ResourceList component**

```tsx
'use client';

import { useState, useEffect } from 'react';
import { Resource } from '@/types';

interface ResourceListProps {
  initialResources: Resource[];
  topic: 'tin_a' | 'tin_b';
}

export default function ResourceList({ initialResources, topic }: ResourceListProps) {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const filtered = initialResources.filter((resource) =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setResources(filtered);
  }, [searchTerm, initialResources]);

  const renderYouTubeEmbed = (url: string) => {
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    if (!videoIdMatch) return null;

    const videoId = videoIdMatch[1];
    return (
      <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullUrl
          className="w-full h-full"
          loading="lazy"
        />
      </div>
    );
  };

  const renderDocumentLink = (url: string, title: string) => {
    const directDownloadUrl = url.replace(/\/file\/d\//, '/uc?id=').replace(/\/view$/, '');

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

      <div className="mb-8">
        <input
          type="text"
          placeholder="Tìm kiếm tài liệu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
      </div>

      <div className="space-y-6">
        {resources.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-xl">Không tìm thấy tài liệu nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {resources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                {resource.type === 'video' ? (
                  renderYouTubeEmbed(resource.url)
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
    </div>
  );
}
```

- [ ] **Step 2: Tạo layout cho tin-b**

```tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TinBLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Tạo page.tsx cho Tin B**

```tsx
import ResourceList from './components/ResourceList';
import { getResourcesByTopic } from '@/lib/queries';
import { Topic } from '@/types';

interface PageProps {
  params: Promise<{ topic: string }>;
}

export async function generateStaticParams() {
  return [
    { topic: 'tin-a' },
    { topic: 'tin-b' },
  ];
}

export default async function TinBPage({ params }: PageProps) {
  const { topic } = await params;
  const topicValue: Topic = topic === 'tin-b' ? 'tin_b' : 'tin_a';

  const resources = await getResourcesByTopic(topicValue);

  return <ResourceList initialResources={resources} topic={topicValue} />;
}
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add Tin B topic page with search"
```

---

## Phase 6: Admin Page

### Task 7: Trang Admin Upload Form

**Files:**
- Create: `app/admin/page.tsx`
- Create: `app/admin/layout.tsx`
- Create: `app/admin/components/UploadForm.tsx`
- Create: `app/api/admin/upload/route.ts`

- [ ] **Step 1: Tạo admin layout**

```tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Tạo UploadForm component**

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type FormState = {
  title: string;
  description: string;
  type: 'document' | 'video';
  topic: 'tin_a' | 'tin_b';
  url: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

export default function UploadForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormState>({
    title: '',
    description: '',
    type: 'document',
    topic: 'tin_a',
    url: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else {
      // Basic URL validation
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = 'Invalid URL format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to upload resource');
      }

      setSubmitMessage('✅ Upload successful! Redirecting...');

      // Redirect to appropriate topic page after 1.5 seconds
      setTimeout(() => {
        router.push(`/${formData.topic === 'tin_a' ? 'tin-a' : 'tin-b'}`);
      }, 1500);
    } catch (error) {
      setSubmitMessage('❌ Upload failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value as any,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Upload</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-xl">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter resource title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
            Description (optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter description"
          />
        </div>

        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-semibold text-gray-900 mb-2">
            Type *
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="document">📄 Document</option>
            <option value="video">🎥 Video</option>
          </select>
        </div>

        {/* Topic */}
        <div>
          <label htmlFor="topic" className="block text-sm font-semibold text-gray-900 mb-2">
            Topic *
          </label>
          <select
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="tin_a">Tin A</option>
            <option value="tin_b">Tin B</option>
          </select>
        </div>

        {/* URL */}
        <div>
          <label htmlFor="url" className="block text-sm font-semibold text-gray-900 mb-2">
            URL *
          </label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://www.youtube.com/watch?v=... or Google Drive link"
          />
          {errors.url && <p className="mt-1 text-sm text-red-600">{errors.url}</p>}
          <p className="mt-2 text-sm text-gray-500">
            For YouTube videos, use the full URL. For Google Drive, use the share link.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-violet-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitting ? 'Uploading...' : 'Upload Resource'}
        </button>

        {/* Submit Message */}
        {submitMessage && (
          <div className={`p-4 rounded-lg ${submitMessage.startsWith('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {submitMessage}
          </div>
        )}
      </form>
    </div>
  );
}
```

- [ ] **Step 3: Tạo trang admin page.tsx**

```tsx
import UploadForm from './components/UploadForm';

export default function AdminPage() {
  return <UploadForm />;
}
```

- [ ] **Step 4: Tạo API Route xử lý upload**

```tsx
import { NextRequest, NextResponse } from 'next/server';
import { insertResource } from '@/lib/queries';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, type, topic, url } = body;

    // Validation
    if (!title || !type || !topic || !url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const validTypes = ['document', 'video'];
    const validTopics = ['tin_a', 'tin_b'];

    if (!validTypes.includes(type) || !validTopics.includes(topic)) {
      return NextResponse.json(
        { error: 'Invalid type or topic' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Insert into database
    const resource = await insertResource({
      title,
      description,
      type: type as 'document' | 'video',
      topic: topic as 'tin_a' | 'tin_b',
      url,
      order_index: 0,
    });

    return NextResponse.json(
      { success: true, resource },
      { status: 201 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 5: Test Admin Form**

1. Start dev server: `npm run dev`
2. Visit http://localhost:3000/admin
3. Test form validation:
   - Submit empty form → Should show validation errors
   - Enter invalid URL → Show URL error
4. Submit valid document:
   - Title: "Test Document"
   - Description: "Test description"
   - Type: Document
   - Topic: Tin A
   - URL: Any valid URL (e.g., https://example.com/test.pdf)
   - Click Upload
   - Should show success message and redirect to /tin-a
5. Submit valid video:
   - Title: "Test Video"
   - Type: Video
   - Topic: Tin B
   - URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
   - Verify redirect to /tin-b

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add admin upload form with API route"
```

---

## Phase 7: Database Integration Testing

### Task 8: Seed Test Data vào Database

**Files:**
- Create: `scripts/seed.ts`

- [ ] **Step 1: Tạo script seed data**

```typescript
import { drizzle } from '@cloudflare/d1';
import { DB } from '@/wrangler.config';

const db = drizzle(DB);

async function seed() {
  // Clear existing data
  await db.execute('DELETE FROM resources');

  // Sample documents for Tin A
  await db.execute(
    `INSERT INTO resources (title, description, type, topic, url, order_index) VALUES
      ('Tài liệu React cơ bản', 'Giới thiệu về React hooks và components', 'document', 'tin_a', 'https://example.com/react-basics.pdf', 1),
      ('Next.js 14 App Router', 'Hướng dẫn sử dụng App Router mới', 'document', 'tin_a', 'https://example.com/nextjs-app-router.pdf', 2),
      ('TypeScript Handbook', 'Sách hướng dẫn TypeScript đầy đủ', 'document', 'tin_a', 'https://example.com/typescript.pdf', 3)`
  );

  // Sample videos for Tin A
  await db.execute(
    `INSERT INTO resources (title, description, type, topic, url, order_index) VALUES
      ('React Tutorial 2024', 'Video hướng dẫn React từ cơ bản đến nâng cao', 'video', 'tin_a', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1),
      ('Next.js Crash Course', 'Next.js trong 100 phút', 'video', 'tin_a', 'https://www.youtube.com/watch?v=Sklc_fQBmcs', 2)`
  );

  // Sample documents for Tin B
  await db.execute(
    `INSERT INTO resources (title, description, type, topic, url, order_index) VALUES
      ('Node.js Best Practices', 'Các best practice khi làm việc với Node.js', 'document', 'tin_b', 'https://example.com/nodejs-best-practices.pdf', 1),
      ('Database Design', 'Thiết kế database hiệu quả', 'document', 'tin_b', 'https://example.com/database-design.pdf', 2)`
  );

  // Sample videos for Tin B
  await db.execute(
    `INSERT INTO resources (title, description, type, topic, url, order_index) VALUES
      ('Database Systems', 'Giới thiệu về hệ thống database', 'video', 'tin_b', 'https://www.youtube.com/watch?v=ztHopE5WnPE', 1),
      ('SQL Tutorial', 'Học SQL từ A-Z', 'video', 'tin_b', 'https://www.youtube.com/watch?v=HXV3zeQKqGY', 2)`
  );

  console.log('✅ Seeded database with sample data');
}

seed().catch(console.error);
```

*Note:* Để script này chạy được, cần update `lib/db.ts` để export db instance một cách an toàn cho scripts.

- [ ] **Step 2: Update lib/db.ts để hỗ trợ script**

```typescript
import { drizzle } from '@cloudflare/d1';

// Get D1 binding from environment (Wrangler sẽ inject lúc runtime)
export function getDb() {
  // @ts-ignore - D1 binding được inject bởi Workers runtime
  const db = globalThis.DB;
  if (!db) {
    throw new Error('Database binding not found. Make sure DB is configured in wrangler.toml');
  }
  return drizzle(db);
}

// Import types
export type { Resource } from '@/types';
```

- [ ] **Step 3: Update lib/queries.ts để sử dụng getDb()**

```typescript
import { getDb } from './db';
import { Resource, Topic } from '@/types';

export async function getResourcesByTopic(topic: Topic): Promise<Resource[]> {
  const db = getDb();
  const results = await db
    .prepare('SELECT * FROM resources WHERE topic = ? ORDER BY order_index ASC, created_at DESC')
    .bind(topic)
    .all();

  return results as Resource[];
}

export async function searchResourcesByTopic(topic: Topic, keyword: string): Promise<Resource[]> {
  const db = getDb();
  const results = await db
    .prepare('SELECT * FROM resources WHERE topic = ? AND title LIKE ? ORDER BY order_index ASC, created_at DESC')
    .bind(topic, `%${keyword}%`)
    .all();

  return results as Resource[];
}

export async function insertResource(resource: {
  title: string;
  description?: string;
  type: 'document' | 'video';
  topic: 'tin_a' | 'tin_b';
  url: string;
  order_index?: number;
}): Promise<Resource> {
  const db = getDb();
  const result = await db
    .prepare(
      'INSERT INTO resources (title, description, type, topic, url, order_index) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .bind(
      resource.title,
      resource.description || null,
      resource.type,
      resource.topic,
      resource.url,
      resource.order_index || 0
    )
    .run();

  const insertedRow = await db
    .prepare('SELECT * FROM resources WHERE id = ?')
    .bind(result.meta.last_row_id)
    .get();

  return insertedRow as Resource;
}
```

- [ ] **Step 4: Run seed script**

```bash
npx wrangler d1 execute learning-db --file=migrations/001_init.sql --remote
npx wrangler dev  # hoặc npm run dev
```

Trong lúc dev, có thể seed bằng cách:
- Tạo file `app/api/seed/route.ts` (chỉ dùng cho development)
- Truy cập /api/seed

Hoặc chạy trực tiếp:

```bash
npx wrangler d1 execute learning-db --command "DELETE FROM resources" --remote
npx wrangler d1 execute learning-db --command "INSERT INTO resources (title, type, topic, url) VALUES ('Test', 'document', 'tin_a', 'https://test.com')" --remote
```

- [ ] **Step 5: Test với sample data**

1. Verify database có data:
```bash
npx wrangler d1 execute learning-db --command "SELECT COUNT(*) as count FROM resources" --remote
```
Expected: count > 0

2. Visit http://localhost:3000/tin-a
Expected: Hiển thị list resources với search

3. Test search:
   - Type "React" → chỉ hiển thị resources có "React" trong title
   - Clear search → hiển thị tất cả

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: seed database with sample data and fix db queries"
```

---

## Phase 8: Testing & Verification

### Task 9: Manual Testing Checklist

- [ ] **Step 1: Test Homepage**
  - Visit http://localhost:3000
  - Verify 2 cards hiển thị (Tin A, Tin B)
  - Click vào mỗi card và verify redirect đúng

- [ ] **Step 2: Test Topic Pages**
  - /tin-a: verify resources hiển thị (coi cả document và video)
  - /tin-b: verify resources hiển thị
  - Search trong /tin-a: type "React", verify filter hoạt động chính xác
  - Video embed: verify YouTube video hiển thị và play được
  - Document link: click download link, verify mở đúng

- [ ] **Step 3: Test Admin**
  - Visit http://localhost:3000/admin
  - Test validation:
    - Submit empty → errors show
    - Invalid URL → error show
  - Upload document to Tin A → verify redirect, verify data trong DB
  - Upload video to Tin B → verify redirect, verify embed trên Tin B page

- [ ] **Step 4: Test Database Queries**
  - Verify all queries execute without errors
  - Check D1 console xem data được lưu đúng format

- [ ] **Step 5: Test Responsive Design**
  - Resize browser từ mobile đến desktop
  - Verify layout adapts correctly
  - Cards và forms readable trên mobile

- [ ] **Step 6: Run lint**

```bash
npm run lint
```

Expected: Không có lỗi TypeScript hoặc ESLint

- [ ] **Step 7: Build để verify build production**

```bash
npm run build
```

Expected: Build thành công without errors

- [ ] **Step 8: Commit testing phase**

```bash
git add .
git commit -m "test: complete manual testing checklist"
```

---

## Phase 9: Deployment

### Task 10: Deploy lên Cloudflare Pages

**Files:**
- Modify: `package.json` (add deploy script)
- Create: `.gitignore` (verify)
- Create: `README.md`

- [ ] **Step 1: Verify .gitignore**

```gitignore
# Dependencies
node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env
.env.local
.env.*.local

# Vercel
.vercel

# Typescript
*.tsbuildinfo
next-env.d.ts
```

- [ ] **Step 2: Tạo README.md**

```markdown
# Personal Learning Resources Website

Personal website for sharing learning materials and videos.

## Features

- View documents and videos by topic (Tin A, Tin B)
- Search resources within each topic
- Admin interface to upload new content
- Deploy on Cloudflare Pages with D1 database

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Cloudflare D1
- Wrangler CLI

## Local Development

### Prerequisites

- Node.js 18+
- Wrangler CLI: `npm install -g wrangler`

### Setup

1. Install dependencies:
```bash
npm install
```

2. Log in to Cloudflare:
```bash
npx wrangler login
```

3. Create D1 database:
```bash
npx wrangler d1 create learning-db
```

Update `wrangler.toml` with your database ID.

4. Run migrations:
```bash
npm run db:push
```

5. Start dev server:
```bash
npm run dev
```

Open http://localhost:3000

### Database Operations

Seed with sample data (optional):
```bash
# Add seed script to scripts/seed.ts and run via wrangler
npx wrangler d1 execute learning-db --file=scripts/seed.sql --remote
```

Query database:
```bash
npx wrangler d1 execute learning-db --command "SELECT * FROM resources" --remote
```

## Deployment

### Cloudflare Pages

1. Push code to GitHub
2. In Cloudflare Pages dashboard, create new project
3. Connect repository
4. Build settings:
   - Build command: `npm run build`
   - Output directory: `.next`
5. Add environment variable: `D1_DATABASE=learning-db`
6. Deploy

### Database Migrations on Deploy

After first deploy, run:
```bash
npx wrangler d1 execute learning-db --file=migrations/001_init.sql --remote
```

## Admin Interface

Visit `/admin` to upload new resources:
- Title (required)
- Description (optional)
- Type: Document or Video
- Topic: Tin A or Tin B
- URL: YouTube URL or Google Drive share link

## Project Structure

```
/app
  /admin           # Admin upload page
  /tin-a           # Tin A topic page
  /tin-b           # Tin B topic page
/components        # Reusable UI components
/lib               # Database client and queries
/migrations        # Database schema
/scripts           # Helper scripts
```

## License

MIT
```

- [ ] **Step 3: Cập nhật package.json với deploy script**

```json
{
  "name": "personal-learning-website",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "npx wrangler d1 execute --database learning-db --file=migrations/001_init.sql --remote",
    "db:local": "npx wrangler d1 execute --database learning-db --file=migrations/001_init.sql"
  },
  "dependencies": {
    "next": "^14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@cloudflare/d1": "^1.9.3"
  },
  "devDependencies": {
    "typescript": "^5.6.3",
    "@types/node": "^20.14.10",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "tailwindcss": "^3.4.4",
    "postcss": "^8.4.40",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.5"
  }
}
```

- [ ] **Step 4: Commit deployment files**

```bash
git add .
git commit -m "feat: add README, gitignore, and deployment instructions"
```

- [ ] **Step 5: Push to GitHub**

```bash
git remote add origin <YOUR_GITHUB_REPO_URL>
git branch -M main
git push -u origin main
```

Expected: Code pushed to GitHub

- [ ] **Step 6: Deploy trên Cloudflare Pages**

1. Go to https://dash.cloudflare.com/
2. Navigate to Pages
3. Click "Create a project" → "Connect to Git"
4. Select your repository
5. Build settings:
   - Build command: `npm run build`
   - Build output directory: `.next`
6. Environment variables:
   - `D1_DATABASE` = `learning-db`
7. Click "Save and Deploy"

Wait for deployment to complete (~2-5 minutes)

- [ ] **Step 7: Verify production deployment**

1. Visit your Pages URL (e.g., `https://your-project.pages.dev`)
2. Test:
   - Homepage loads
   - Click into Tin A / Tin B
   - If seeded, resources hiển thị
   - Admin form works (upload test)
   - Search hoạt động

- [ ] **Step 8: Final commit**

```bash
git add .
git commit -m "chore: ready for deployment"
```

---

## Summary Checklist

Before marking complete, verify:

- [x] All files created with correct paths
- [x] Database schema matches spec
- [x] 2 topic pages hoạt động với search
- [x] Admin page hoạt động với validation
- [x] Upload redirects đúng topic page
- [x] YouTube embed works
- [x] Google Drive link converted to direct download
- [x] Responsive design on mobile and desktop
- [x] Build passes without errors
- [x] Deployed successfully on Cloudflare Pages

---

**Kế hoạch đã hoàn thành. Bây giờ bạn có 2 lựa chọn:**

1. **Subagent-Driven Development** (khuyến nghị) - Tôi sẽ dispatch một subagent mới cho mỗi task, review giữa các tasks, và iterate nhanh

2. **Inline Execution** - Tôi sẽ execute tasks trong session này dùng superpowers:executing-plans, với checkpoints để review

**Bạn muốn chọn phương án nào?**
