import ResourceList from './components/ResourceList';
import { getResourcesByTopic } from '@/lib/queries';
import { Resource, Topic } from '@/types';

export default async function TinBPage() {
  const topicValue: Topic = 'tin_b';

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
