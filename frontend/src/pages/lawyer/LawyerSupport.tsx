// ============================================================
// src/pages/lawyer/LawyerSupport.tsx
// Lawyer: CM support & contact page.
// AppLayout is provided by <Protected> in App.tsx.
// ============================================================
import { useMemo } from 'react';
import { LawyerSupportCard } from '@/components/dashboard/lawyer';
import { useUserSession } from '@/hooks/useUserSession';

export default function LawyerSupport() {
  const { firms } = useUserSession();

  const subscriptionPlan = useMemo(() => {
    if (!firms || firms.length === 0) return 'essentiel';
    const firmData = firms[0]?.law_firms;
    return (firmData as { subscription_plan?: string | null })?.subscription_plan ?? 'essentiel';
  }, [firms]);

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-5 pb-8">
      <h1 className="text-2xl font-bold">Support Community Manager</h1>
      <LawyerSupportCard subscriptionPlan={subscriptionPlan} />
    </div>
  );
}
