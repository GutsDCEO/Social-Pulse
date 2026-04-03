// ============================================================
// Stub — Lovable Supabase user_roles / auth flows removed.
// Admin user lifecycle: use pages/admin/AdminUsers.tsx (REST).
// ============================================================

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export function UserManagement() {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="h-4 w-4" />
          Gestion des utilisateurs
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Cette vue prototype (Supabase) n’est pas branchée sur l’API Social-Pulse. Utilisez la page{' '}
        <span className="font-medium text-foreground">Administration → Utilisateurs</span> pour créer des comptes et
        assigner les rôles cabinet via REST.
      </CardContent>
    </Card>
  );
}
