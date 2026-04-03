// src/pages/Trends.tsx — Legal trends placeholder
import { TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Trends() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Actualités juridiques</h1>
      </div>
      <Card><CardContent className="py-16 text-center text-muted-foreground">
        La veille juridique personnalisée sera disponible prochainement.
      </CardContent></Card>
    </div>
  );
}
