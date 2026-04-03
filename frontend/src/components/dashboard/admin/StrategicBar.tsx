import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  DollarSign, TrendingUp, Building2, Target, UserMinus, Wallet,
} from "lucide-react";

interface StrategicBarProps {
  stats: {
    revenue: { mrr: number; mrrVariation: number; collections: number };
    activeFirms: number;
    acquisition: { conversionRate: number };
    churnRate: number;
  };
  loading?: boolean;
}

interface MicroKPI {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: "positive" | "negative" | "neutral";
  tooltip: string;
}

export function StrategicBar({ stats, loading }: StrategicBarProps) {
  const s = stats;

  const kpis: MicroKPI[] = [
    {
      label: "MRR actuel",
      value: `${s.revenue.mrr.toLocaleString("fr-FR")} €`,
      icon: DollarSign,
      trend: "neutral",
      tooltip: "Revenu mensuel récurrent généré par les abonnements actifs. Reflète la santé financière globale de la plateforme.",
    },
    {
      label: "Variation M-1",
      value: `${s.revenue.mrrVariation > 0 ? "+" : ""}${s.revenue.mrrVariation}%`,
      icon: TrendingUp,
      trend: s.revenue.mrrVariation > 0 ? "positive" : s.revenue.mrrVariation < 0 ? "negative" : "neutral",
      tooltip: "Croissance du MRR vs mois précédent. Un taux positif indique une bonne dynamique d'acquisition et rétention.",
    },
    {
      label: "Cabinets actifs",
      value: String(s.activeFirms),
      icon: Building2,
      trend: "positive",
      tooltip: "Nombre de cabinets avec au moins une activité dans les 30 derniers jours.",
    },
    {
      label: "Taux conversion",
      value: `${s.acquisition.conversionRate}%`,
      icon: Target,
      trend: s.acquisition.conversionRate >= 10 ? "positive" : "neutral",
      tooltip: "Ratio leads convertis en clients. Un taux supérieur à 10% est excellent en SaaS B2B.",
    },
    {
      label: "Taux churn",
      value: `${s.churnRate}%`,
      icon: UserMinus,
      trend: s.churnRate > 5 ? "negative" : s.churnRate > 0 ? "neutral" : "positive",
      tooltip: "Taux de perte client mensuel. Au-delà de 5%, la rétention doit être priorisée.",
    },
    {
      label: "Encaissements",
      value: `${s.revenue.collections.toLocaleString("fr-FR")} €`,
      icon: Wallet,
      trend: "neutral",
      tooltip: "Total des paiements reçus sur la période. Indicateur de trésorerie opérationnelle.",
    },
  ];

  return (
    <TooltipProvider delayDuration={200}>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {kpis.map((kpi) => (
          <Tooltip key={kpi.label}>
            <TooltipTrigger asChild>
              <Card className="p-3 flex items-center gap-2.5 cursor-default">
                {loading ? (
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                ) : (
                  <>
                    <div
                      className={cn(
                        "rounded-md p-1.5 shrink-0",
                        kpi.trend === "positive" && "bg-emerald-500/10 text-emerald-600",
                        kpi.trend === "negative" && "bg-destructive/10 text-destructive",
                        kpi.trend === "neutral" && "bg-muted text-muted-foreground"
                      )}
                    >
                      <kpi.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-muted-foreground truncate">{kpi.label}</p>
                      <p className={cn(
                        "text-sm font-bold leading-tight",
                        kpi.trend === "positive" && "text-emerald-600",
                        kpi.trend === "negative" && "text-destructive"
                      )}>
                        {kpi.value}
                      </p>
                    </div>
                  </>
                )}
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[260px]">
              <p>{kpi.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
