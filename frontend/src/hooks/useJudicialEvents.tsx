import { useCallback, useMemo } from 'react';
import {
  MOCK_JUDICIAL_EVENTS,
  type EventSensitivity as MockSensitivity,
} from '@/data/mockJudicialEvents';

export type EventSensitivity = MockSensitivity;

export interface JudicialEvent {
  id: string;
  title: string;
  date: string;
  end_date?: string | null;
  thematic: string;
  sensitivity: EventSensitivity | null;
  sensitivity_reason?: string | null;
  description: string;
  speaking_guidance?: string | null;
  linked_trends?: string[];
  source?: string;
}

function mapEvent(e: (typeof MOCK_JUDICIAL_EVENTS)[number]): JudicialEvent {
  return {
    id: e.id,
    title: e.title,
    date: e.date,
    end_date: e.endDate ?? null,
    thematic: e.thematic,
    sensitivity: e.sensitivity,
    sensitivity_reason: e.sensitivityReason,
    description: e.description,
    speaking_guidance: e.speakingGuidance,
    linked_trends: e.linkedTrends,
    source: e.source,
  };
}

export function useJudicialEvents() {
  const events = useMemo(() => MOCK_JUDICIAL_EVENTS.map(mapEvent), []);
  const loading = false;

  const getUpcomingEvents = useCallback(
    (n: number) => {
      const now = new Date().toISOString().slice(0, 10);
      return [...events]
        .filter((e) => e.date >= now)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, n);
    },
    [events],
  );

  return { events, loading, getUpcomingEvents, refetch: async () => {} };
}
