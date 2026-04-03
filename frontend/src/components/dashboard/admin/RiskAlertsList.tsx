import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  AlertTriangle, Clock, XCircle, TrendingDown, UserMinus, AlertOctagon, FlaskConical, ShieldAlert, Info,
} from "lucide-react";

interface Alert {
  type: string;
  label: string;
  count: number;
  severity: "critical" | "moderate" | "info";
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  blocked: Clock,
  sla_breach: AlertTriangle,
  repeated_refusal: XCircle,
  payment_delay: AlertOctagon,
  declining_activity: TrendingDown,
  cm_inactive: UserMinus,
  high_churn_risk: ShieldAlert,
  test_expiring: FlaskConical,
  cm_overloaded: AlertTriangle,
};

const SEVERITY_CONFIG = {
  critical: { badge: "destructive" as const, bg: "bg-destructive/5 border-destructive/20", dot: "bg-destructive" },
  moderate: { badge: "default" as const, bg: "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800", dot: "bg-amber-500" },
  info: { badge: "secondary" as const, bg: "bg-muted/50 border-border", dot: "bg-muted-foreground" },
};

export function RiskAlertsList({ alerts, loading }: { alerts: Alert[]; loading?: boolean }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <CardTitle className="text-base font-semibold flex items-center gap-1.5 cursor-default">
                  Risque & Alertes
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </CardTitle>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[280px]">
                <p>Alertes actives classées par sévérité. Les alertes critiques nécessitent une action immédiate.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {!loading && alerts.length > 0 && (
            <Badge variant={alerts.some(a => a.severity === "critical") ? "destructive" : "secondary"} className="text-[10px]">
              {alerts.length} alerte{alerts.length > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 gap-2 text-muted-foreground">
            <AlertTriangle className="h-7 w-7" />
            <p className="text-sm">Aucune alerte active</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {alerts.map((alert, i) => {
              const Icon = ICON_MAP[alert.type] || AlertTriangle;
              const cfg = SEVERITY_CONFIG[alert.severity];
              return (
                <li key={i} className={cn("flex items-center gap-3 rounded-lg border px-3 py-2.5", cfg.bg)}>
                  <span className={cn("h-2 w-2 rounded-full shrink-0", cfg.dot)} />
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="text-sm flex-1">{alert.label}</span>
                  <Badge variant={cfg.badge} className="text-[10px] shrink-0">
                    {alert.count}
                  </Badge>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
