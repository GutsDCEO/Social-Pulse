// ============================================================
// src/pages/lawyer/LawyerValidation.tsx
// Lawyer: full-page validation queue view.
// AppLayout is provided by <Protected> in App.tsx.
// ============================================================
import { LawyerValidationBlock } from '@/components/dashboard/lawyer';
import { usePublications } from '@/hooks/usePublications';
import { useAutoValidation } from '@/hooks/useAutoValidation';

export default function LawyerValidation() {
  const { publications, loading } = usePublications({ limit: 50 });
  const { getAutoValidationInfo } = useAutoValidation();

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-5 pb-8">
      <h1 className="text-2xl font-bold">Validation des publications</h1>
      <LawyerValidationBlock
        publications={publications}
        loading={loading}
        getAutoValidationInfo={getAutoValidationInfo}
      />
    </div>
  );
}
