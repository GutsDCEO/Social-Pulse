// src/pages/admin/AdminSettings.tsx — Admin settings
import { Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Paramètres système</h1>
      </div>
      <Card><CardContent className="py-16 text-center text-muted-foreground">
        Les paramètres de configuration de la plateforme seront disponibles prochainement.
      </CardContent></Card>
    </div>
  );
}
