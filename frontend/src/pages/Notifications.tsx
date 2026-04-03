// src/pages/Notifications.tsx — Notifications placeholder
import { Bell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Notifications() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bell className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>
      <Card><CardContent className="py-16 text-center text-muted-foreground">
        Aucune notification pour le moment.
      </CardContent></Card>
    </div>
  );
}
