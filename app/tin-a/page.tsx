import ResourceList from './components/ResourceList';
import { getResourcesByTopic } from '@/lib/queries';
import { Resource, Topic } from '@/types';

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

  let resources: Resource[] = [];
  let error: string | null = null;
  try {
    resources = await getResourcesByTopic(topicValue);
  } catch (err) {
    console.error('Failed to fetch resources:', err);
    error = err instanceof Error ? err.message : 'Failed to load resources';
    resources = [];
  }

  return <ResourceList initialResources={resources} topic={topicValue} error={error} />;
}
