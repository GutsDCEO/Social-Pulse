import { Shield, Lock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LawyerDashboardHeaderProps {
  userName?: string;
}

export function LawyerDashboardHeader({ userName }: LawyerDashboardHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Greeting */}
      <div>
        <h1 className="text-xl font-bold tracking-tight">
          Bonjour, Maître {userName || ''}
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Votre espace de pilotage éditorial
        </p>
      </div>

      {/* Status Banner */}
      <div className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
        "py-4 px-5 rounded-xl",
        "bg-gradient-to-r from-emerald-50/80 to-teal-50/50",
        "border border-emerald-200/60",
        "dark:from-emerald-950/30 dark:to-teal-950/20",
        "dark:border-emerald-800/40"
      )}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-base font-medium text-foreground">
            Votre communication est active et maîtrisée.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge 
            variant="outline" 
            className="bg-emerald-100/80 border-emerald-300 text-emerald-700 dark:bg-emerald-900/50 dark:border-emerald-700 dark:text-emerald-300"
          >
            <Shield className="h-3 w-3 mr-1" />
            Conforme RIN
          </Badge>
          <Badge 
            variant="outline" 
            className="bg-blue-100/80 border-blue-300 text-blue-700 dark:bg-blue-900/50 dark:border-blue-700 dark:text-blue-300"
          >
            <Lock className="h-3 w-3 mr-1" />
            Aucune publication automatique
          </Badge>
        </div>
      </div>
    </div>
  );
}
