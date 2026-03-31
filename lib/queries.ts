import { Resource, Topic } from '@/types';
import { getDb } from './db';

export async function getResourcesByTopic(topic: Topic): Promise<Resource[]> {
  const db = getDb();
  const result = await db
    .prepare('SELECT * FROM resources WHERE topic = ? ORDER BY order_index ASC, created_at DESC')
    .bind(topic)
    .all();

  return (result.results ?? []) as unknown as Resource[];
}

export async function searchResourcesByTopic(topic: Topic, keyword: string): Promise<Resource[]> {
  const db = getDb();
  const result = await db
    .prepare('SELECT * FROM resources WHERE topic = ? AND title LIKE ? ORDER BY order_index ASC, created_at DESC')
    .bind(topic, `%${keyword}%`)
    .all();

  return (result.results ?? []) as unknown as Resource[];
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
    .bind(result.lastRowId)
    .first();

  return insertedRow as Resource;
}
