// src/pages/Metrics.tsx — Performance metrics placeholder
import { BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Metrics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Performances</h1>
      </div>
      <Card><CardContent className="py-16 text-center text-muted-foreground">
        Les métriques de publication seront disponibles après connexion aux réseaux sociaux.
      </CardContent></Card>
    </div>
  );
}
