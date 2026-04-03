import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ClipboardList, Filter, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuditEntry {
  id: string;
  action: string;
  created_at: string;
  user_id: string;
  entity_type?: string;
}

interface AdminActivityLogProps {
  entries: AuditEntry[];
  loading?: boolean;
}

const actionLabels: Record<string, string> = {
  approve: "Validation",
  reject: "Refus",
  submit: "Soumission",
  create: "Création",
  edit: "Modification",
  publish: "Publication",
  schedule: "Planification",
};

const ANOMALY_ACTIONS = ["reject", "escalate", "refused"];

export function AdminActivityLog({ entries, loading }: AdminActivityLogProps) {
  const { toast } = useToast();
  const [filter, setFilter] = useState<"all" | "anomalies">("all");

  const filteredEntries = filter === "anomalies"
    ? entries.filter(e => ANOMALY_ACTIONS.includes(e.action))
    : entries;

  return (
    <Card className={cn(entries.length === 0 && !loading && "opacity-70")}>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <CardTitle className="text-base font-semibold flex items-center gap-1.5 cursor-default">
                Journal d'activité
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </CardTitle>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[280px]">
              <p>Historique des actions récentes sur la plateforme. Filtrez par anomalies pour identifier les points de friction.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex border rounded-md overflow-hidden text-xs">
          {(["all", "anomalies"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-2.5 py-1 transition-colors",
                filter === f ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              )}
            >
              {f === "all" ? "Tout" : "Anomalies"}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 gap-2 text-muted-foreground">
            <ClipboardList className="h-7 w-7" />
            <p className="text-sm">
              {filter === "anomalies"
                ? "Aucune anomalie détectée"
                : "Aucune action enregistrée pour le moment"}
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filteredEntries.map((entry) => (
              <li key={entry.id} className="flex items-start justify-between gap-2 text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={cn(
                    "h-1.5 w-1.5 rounded-full shrink-0 mt-1.5",
                    ANOMALY_ACTIONS.includes(entry.action) ? "bg-destructive" : "bg-primary"
                  )} />
                  <span className="truncate">
                    {actionLabels[entry.action] || entry.action}
                    {entry.entity_type ? ` · ${entry.entity_type}` : ""}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true, locale: fr })}
                </span>
              </li>
            ))}
          </ul>
        )}
        {entries.length > 0 && (
          <button
            onClick={() => toast({ title: "Journal complet", description: "Cette fonctionnalité sera disponible prochainement." })}
            className="inline-block mt-4 text-xs text-primary hover:underline"
          >
            Voir tout →
          </button>
        )}
      </CardContent>
    </Card>
  );
}
