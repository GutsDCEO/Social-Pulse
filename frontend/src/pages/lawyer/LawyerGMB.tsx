// ============================================================
// src/pages/lawyer/LawyerGMB.tsx
// Lawyer: Google My Business / e-reputation page.
// AppLayout is provided by <Protected> in App.tsx.
// ============================================================
import { SuspenseGoogleBusinessCard } from '@/components/dashboard/lazy/LazyDashboardComponents';

export default function LawyerGMB() {
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-5 pb-8">
      <h1 className="text-2xl font-bold">Google My Business – E-réputation</h1>
      <SuspenseGoogleBusinessCard />
    </div>
  );
}
