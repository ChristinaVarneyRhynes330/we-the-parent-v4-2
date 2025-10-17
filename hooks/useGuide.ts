import { useQuery } from '@tanstack/react-query';

// --- TYPE DEFINITIONS ---
export interface GuideTopic {
  id: number;
  title: string;
  content: string;
  relatedLinks: Array<{
    title: string;
    url: string;
  }>;
}

// --- API HELPER FUNCTIONS ---
const API_BASE_URL = '/api/pro-se-guide';

const fetchGuideTopics = async (): Promise<GuideTopic[]> => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) throw new Error('Failed to fetch guide topics');
  const data = await response.json();
  return data.topics;
};

// --- THE CUSTOM HOOK ---
export function useGuide() {
  const { 
    data: topics, 
    isLoading, 
    error 
  } = useQuery<GuideTopic[]>({
    queryKey: ['guideTopics'],
    queryFn: fetchGuideTopics,
  });

  return {
    topics: topics ?? [],
    isLoading,
    error: error as Error | null,
  };
}
