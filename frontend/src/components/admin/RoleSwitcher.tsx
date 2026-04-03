// src/components/admin/RoleSwitcher.tsx
// Social-Pulse: Role switching is an admin-only debug tool.
// Supabase RoleSimulationContext removed — MVP stub shows current role label.
// Full simulation (for Super Admin impersonation) is a Phase 2 feature.
import { Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useSimpleRole } from '@/hooks/useSimpleRole';

export function RoleSwitcher() {
  const { effectiveRole } = useSimpleRole();
  if (!effectiveRole) return null;

  return (
    <Badge variant="outline" className="gap-1.5 h-8 px-3 text-xs border-dashed hidden sm:flex items-center">
      <Shield className="h-3.5 w-3.5 text-primary" />
      {effectiveRole === 'admin' ? 'Administrateur'
        : effectiveRole === 'community_manager' ? 'Community Manager'
        : 'Avocat'}
    </Badge>
  );
}
