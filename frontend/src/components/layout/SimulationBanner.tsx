import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRoleSimulationSafe } from "@/contexts/RoleSimulationContext";
import type { SimpleRole } from "@/hooks/useSimpleRole";

const ROLE_LABELS: Record<SimpleRole, string> = {
  admin: "Administrateur",
  community_manager: "Community Manager",
  lawyer: "Avocat",
};

export function SimulationBanner() {
  const { simulatedRole, clearSimulation, isSimulating } = useRoleSimulationSafe();

  if (!isSimulating || !simulatedRole) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-full border border-amber-300 dark:border-amber-700">
      <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
      <span className="text-xs font-medium text-amber-700 dark:text-amber-300 whitespace-nowrap">
        Vue : <span className="font-semibold">{ROLE_LABELS[simulatedRole]}</span>
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 text-amber-600 hover:text-amber-800 hover:bg-amber-200/50 rounded-full p-0"
        onClick={clearSimulation}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
