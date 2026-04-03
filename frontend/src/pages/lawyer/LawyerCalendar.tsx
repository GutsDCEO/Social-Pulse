// ============================================================
// src/pages/lawyer/LawyerCalendar.tsx
// Lawyer: full-page calendar view.
// AppLayout is provided by <Protected> in App.tsx.
// ============================================================
import { SuspenseCalendarCard } from '@/components/dashboard/lazy/LazyDashboardComponents';
import { usePublications } from '@/hooks/usePublications';

export default function LawyerCalendar() {
  const { publications, loading } = usePublications({ limit: 100 });

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-5 pb-8">
      <h1 className="text-2xl font-bold">Calendrier éditorial</h1>
      <SuspenseCalendarCard publications={publications} loading={loading} />
    </div>
  );
}
