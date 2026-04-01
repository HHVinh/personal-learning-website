import { getDb } from '@/lib/db';
import { getAllResources, insertResource } from '@/lib/queries';

export const runtime = 'edge';

export async function GET() {
  try {
    const resources = getAllResources();
    return new Response(JSON.stringify(resources), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('GET /api/resources error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch resources' }), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, type, topic, url, order_index } = body;

    if (!title || !type || !topic || !url) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const resource = await insertResource({
      title,
      description,
      type,
      topic,
      url,
      order_index: order_index || 0,
    });

    return new Response(JSON.stringify(resource), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('POST /api/resources error:', error);
    return new Response(JSON.stringify({ error: 'Failed to add resource' }), { status: 500 });
  }
}
