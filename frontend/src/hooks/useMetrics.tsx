import { useMemo } from 'react';

export interface PublicationMetric {
  id: string;
  recorded_at: string;
  likes: number;
  comments_count: number;
  shares: number;
  clicks?: number;
  reach?: number;
  publication?: { title?: string | null; content?: string | null };
  performance_level?: string;
}

export interface GlobalMetricsAggregate {
  totalReach: number;
  avgEngagementRate: number;
  totalPublications: number;
  goodPerformers: number;
  mediumPerformers: number;
  improvePerformers: number;
}

export function useMetrics(_opts?: { limit?: number }) {
  const metrics = useMemo<PublicationMetric[]>(() => [], []);
  const globalMetrics = useMemo<GlobalMetricsAggregate>(
    () => ({
      totalReach: 0,
      avgEngagementRate: 0,
      totalPublications: 0,
      goodPerformers: 0,
      mediumPerformers: 0,
      improvePerformers: 0,
    }),
    [],
  );

  return {
    metrics,
    globalMetrics,
    loading: false,
    isLoading: false,
    error: null,
    refetch: async () => {},
  };
}
