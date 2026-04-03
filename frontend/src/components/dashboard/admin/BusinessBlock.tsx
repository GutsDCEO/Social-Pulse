import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Clock, FlaskConical, UserCheck,
  Users, Calendar, CalendarCheck,
} from "lucide-react";

interface BusinessBlockProps {
  stats: {
    revenue: { mrr: number; mrrVariation: number; overdue: number; projection: number };
    acquisition: { leadsMonth: number; demosScheduled: number; converted: number; conversionRate: number; testAccounts: number };
    clientHealth: { paymentDelays: number };
    demosCompleted: number;
  };
  loading?: boolean;
}

interface KPILine {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  alert?: boolean;
  positive?: boolean;
  tooltip: string;
}

function KPIList({ items }: { items: KPILine[] }) {
  return (
    <TooltipProvider delayDuration={200}>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <Tooltip key={item.label}>
            <TooltipTrigger asChild>
              <li className="flex items-center gap-2.5 cursor-default">
                <div className={cn(
                  "rounded-md p-1.5 shrink-0",
                  item.alert ? "bg-destructive/10 text-destructive"
                    : item.positive ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-muted text-muted-foreground"
                )}>
                  <item.icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm text-muted-foreground flex-1 truncate">{item.label}</span>
                <span className={cn(
                  "text-sm font-semibold tabular-nums",
                  item.alert && "text-destructive",
                  item.positive && "text-emerald-600"
                )}>
                  {item.value}
                </span>
              </li>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[260px]">
              <p>{item.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </ul>
    </TooltipProvider>
  );
}

export function BusinessBlock({ stats, loading }: BusinessBlockProps) {
  const s = stats;

  const financierItems: KPILine[] = [
    { label: "Retards paiement", value: `${s.clientHealth.paymentDelays} · ${s.revenue.overdue.toLocaleString("fr-FR")} €`, icon: Clock, alert: s.clientHealth.paymentDelays > 0, tooltip: "Nombre de factures en retard et montant total. À surveiller pour la trésorerie." },
    { label: "Comptes en test", value: s.acquisition.testAccounts, icon: FlaskConical, tooltip: "Comptes en période d'essai. Indicateur du pipeline de conversion à court terme." },
    { label: "Convertis ce mois", value: s.acquisition.converted, icon: UserCheck, positive: s.acquisition.converted > 0, tooltip: "Nombre de comptes passés de test à abonnement payant ce mois." },
  ];

  const commercialItems: KPILine[] = [
    { label: "Leads du mois", value: s.acquisition.leadsMonth, icon: Users, tooltip: "Nouveaux prospects qualifiés entrés dans le pipeline commercial." },
    { label: "Démos planifiées", value: s.acquisition.demosScheduled, icon: Calendar, tooltip: "Démonstrations produit programmées. Indicateur d'intérêt commercial." },
    { label: "Démos réalisées", value: s.demosCompleted, icon: CalendarCheck, positive: s.demosCompleted > 0, tooltip: "Démonstrations effectuées. Un ratio élevé vs planifiées indique un bon taux de présence." },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Financier</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <LoadingSkeleton /> : <KPIList items={financierItems} />}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Commercial</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <LoadingSkeleton /> : <KPIList items={commercialItems} />}
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}
    </div>
  );
}
