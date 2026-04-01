import { getDb } from '@/lib/db';
import { deleteResource } from '@/lib/queries';

export const runtime = 'edge';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return new Response(JSON.stringify({ error: 'Invalid resource ID' }), { status: 400 });
    }

    await deleteResource(numericId);
    return new Response(JSON.stringify({ success: true, message: 'Resource deleted' }), { status: 200 });
  } catch (error) {
    console.error('DELETE /api/resources error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete resource' }), { status: 500 });
  }
}
