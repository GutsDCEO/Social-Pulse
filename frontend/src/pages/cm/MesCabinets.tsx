// src/pages/cm/MesCabinets.tsx — CM cabinet list
import { useQuery } from '@tanstack/react-query';
import { getCabinets } from '@/services/cabinetService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Building2, ChevronRight } from 'lucide-react';

const STATUS_BADGE: Record<string, string> = {
  ACTIF: 'bg-sp-success/10 text-sp-success', INACTIF: 'bg-muted text-muted-foreground', EN_TEST: 'bg-sp-warning/10 text-sp-warning',
};

export default function MesCabinets() {
  const { data: cabinets = [], isLoading } = useQuery({ queryKey: ['cabinets'], queryFn: getCabinets });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Building2 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Mes cabinets</h1>
      </div>
      {isLoading ? <Spinner /> : cabinets.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground">Aucun cabinet assigné.</CardContent></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cabinets.map(c => (
            <Card key={c.id} className="hover:shadow-elevated transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{c.name}</CardTitle>
                  <Badge className={`text-xs ${STATUS_BADGE[c.status] ?? ''}`}>{c.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{c.barreau}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{c.city}{c.city && c.pack ? ' · ' : ''}{c.pack}</p>
                <Button asChild size="sm" variant="outline" className="w-full">
                  <Link to={`/dashboard/cabinets/${c.id}`}>
                    Voir le cabinet <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" /></div>;
}
