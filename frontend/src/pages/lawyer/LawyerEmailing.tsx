// ============================================================
// src/pages/lawyer/LawyerEmailing.tsx
// Lawyer: emailing campaigns page.
// AppLayout is provided by <Protected> in App.tsx.
// ============================================================
import { LawyerEmailingCard } from '@/components/dashboard/lawyer';

export default function LawyerEmailing() {
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-5 pb-8">
      <h1 className="text-2xl font-bold">Campagnes e-mailing</h1>
      <LawyerEmailingCard />
    </div>
  );
}
