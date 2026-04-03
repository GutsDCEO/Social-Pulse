// src/pages/admin/AdminCompliance.tsx — Audit & compliance
import { ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminCompliance() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Conformité & Audit</h1>
      </div>
      <Card><CardContent className="py-16 text-center text-muted-foreground">
        Le tableau de bord de conformité et l'audit log seront disponibles prochainement.
      </CardContent></Card>
    </div>
  );
}
