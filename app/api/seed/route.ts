import { getDb } from '@/lib/db';
import { seed } from '@/scripts/seed';

export const runtime = 'edge';

export async function GET(request: Request) {
  // Block in production environment
  if (process.env.NODE_ENV === 'production') {
    return new Response('❌ Seeding is not allowed in production environment', { status: 403 });
  }

  // Optional: Add simple API key protection
  const authHeader = request.headers.get('Authorization');
  const expectedKey = process.env.SEED_API_KEY;
  if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
    return new Response('❌ Unauthorized - invalid or missing API key', { status: 401 });
  }

  try {
    const db = getDb();
    await seed(db);
    return new Response('✅ Database seeded with sample data', { status: 200 });
  } catch (error) {
    console.error('Seed error:', error);
    return new Response(`❌ Seed failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}
