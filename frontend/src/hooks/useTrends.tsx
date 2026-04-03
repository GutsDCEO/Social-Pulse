import { useCallback, useMemo } from 'react';
import type { TrendTopic } from '@/types/trend';

/** Stub: no backend trends API yet — empty list + stable API for dashboard blocks. */
export function useTrends() {
  const trends = useMemo<TrendTopic[]>(() => [], []);
  const loading = false;
  const getTopTrends = useCallback((n: number) => trends.slice(0, n), [trends]);
  return { trends, loading, getTopTrends };
}
