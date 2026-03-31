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
