import ResourceList from './components/ResourceList';
import { getResourcesByTopic } from '@/lib/queries';
import { Topic } from '@/types';

export default async function TinBPage() {
  const topicValue: Topic = 'tin_b';

  const resources = await getResourcesByTopic(topicValue);

  return <ResourceList initialResources={resources} topic={topicValue} />;
}
