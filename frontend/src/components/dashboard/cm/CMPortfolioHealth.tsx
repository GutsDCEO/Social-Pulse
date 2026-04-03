import { Shield, Eye, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FirmStats } from "@/hooks/useCMWorkspace";

interface CMPortfolioHealthProps {
  firmStats: FirmStats[];
}

interface HealthBarProps {
  icon: React.ElementType;
  label: string;
  count: number;
  total: number;
  barColor: string;
  iconColor: string;
}

function HealthBar({ icon: Icon, label, count, total, barColor, iconColor }: HealthBarProps) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-3.5 w-3.5", iconColor)} />
          <span className="text-muted-foreground">{label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-semibold">{count}</span>
          <span className="text-xs text-muted-foreground">({pct}%)</span>
        </div>
      </div>
      <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all", barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function CMPortfolioHealth({ firmStats }: CMPortfolioHealthProps) {
  const total = firmStats.length;
  const stable = firmStats.filter(f => f.status === 'ok').length;
  const attention = firmStats.filter(f => f.status === 'attention').length;
  const atRisk = firmStats.filter(f => f.status === 'blocked').length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Santé portefeuille</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <HealthBar
          icon={Shield}
          label="Stables"
          count={stable}
          total={total}
          barColor="bg-emerald-500"
          iconColor="text-emerald-600"
        />
        <HealthBar
          icon={Eye}
          label="Sous surveillance"
          count={attention}
          total={total}
          barColor="bg-amber-500"
          iconColor="text-amber-600"
        />
        <HealthBar
          icon={AlertTriangle}
          label="À risque"
          count={atRisk}
          total={total}
          barColor="bg-destructive"
          iconColor="text-destructive"
        />
      </CardContent>
    </Card>
  );
}
