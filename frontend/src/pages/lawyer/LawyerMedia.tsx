// ============================================================
// src/pages/lawyer/LawyerMedia.tsx
// Lawyer: media library page.
// AppLayout is provided by <Protected> in App.tsx.
// ============================================================
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageIcon } from 'lucide-react';

export default function LawyerMedia() {
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-5 pb-8">
      <h1 className="text-2xl font-bold">Bibliothèque média</h1>
      <Card className="bg-card border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Vos médias</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Votre bibliothèque de médias sera disponible ici prochainement.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
