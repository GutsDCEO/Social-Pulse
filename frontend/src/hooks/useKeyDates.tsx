import { useCallback, useMemo } from 'react';
import { startOfDay } from 'date-fns';
import { MOCK_KEY_DATES } from '@/data/mockKeyDates';

/** UI shape (snake_case) aligned with calendar panels + dashboard block. */
export interface KeyDate {
  id: string;
  month_day: string;
  title: string;
  category: string;
  description: string;
  is_recurring: boolean;
  importance?: string;
  speaking_opportunities?: string[];
  recommended_platforms?: Array<'linkedin' | 'instagram' | 'facebook' | 'twitter'>;
  /** Next occurrence (current or next year) for list views */
  date: Date | null;
}

function mapMockToKeyDate(row: (typeof MOCK_KEY_DATES)[number]): KeyDate {
  const [mm, dd] = row.date.split('-').map(Number);
  const now = new Date();
  const today = startOfDay(now);
  let y = now.getFullYear();
  let occurrence = new Date(y, mm - 1, dd);
  if (occurrence < today) occurrence = new Date(y + 1, mm - 1, dd);

  return {
    id: row.id,
    month_day: row.date,
    title: row.title,
    category: row.category,
    description: row.description,
    is_recurring: row.isRecurring,
    importance: row.importance,
    speaking_opportunities: row.speakingOpportunities,
    recommended_platforms: row.recommendedPlatforms,
    date: occurrence,
  };
}

export function useKeyDates() {
  const keyDates = useMemo(() => MOCK_KEY_DATES.map(mapMockToKeyDate), []);
  const loading = false;

  const getUpcomingKeyDates = useCallback(
    (n: number) => {
      const today = startOfDay(new Date());
      return keyDates
        .filter((k) => k.date && k.date >= today)
        .sort((a, b) => (a.date!.getTime() - b.date!.getTime()))
        .slice(0, n);
    },
    [keyDates],
  );

  return { keyDates, loading, getUpcomingKeyDates, refetch: async () => {} };
}
