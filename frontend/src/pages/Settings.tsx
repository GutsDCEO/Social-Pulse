// src/pages/Settings.tsx — User settings
import { Settings as SettingsIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Paramètres</h1>
      </div>
      <Card><CardContent className="py-16 text-center text-muted-foreground">
        Les paramètres de compte seront disponibles prochainement.
      </CardContent></Card>
    </div>
  );
}
