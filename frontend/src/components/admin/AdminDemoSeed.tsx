import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database } from 'lucide-react';

interface AdminDemoSeedProps {
  onComplete?: () => void;
}

/** Placeholder admin seed — pas de données distantes en mode API REST. */
export function AdminDemoSeed({ onComplete }: AdminDemoSeedProps) {
  return (
    <Card className="border-dashed">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base">Jeu de données démo</CardTitle>
        </div>
        <CardDescription>
          Le chargement de données de démonstration via l&apos;API sera ajouté ultérieurement.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button type="button" variant="outline" size="sm" onClick={() => onComplete?.()}>
          Fermer
        </Button>
      </CardContent>
    </Card>
  );
}
