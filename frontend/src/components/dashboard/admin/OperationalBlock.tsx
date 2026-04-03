import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  FileCheck, CheckCircle, Wifi,
  UserX, CalendarCheck,
} from "lucide-react";

interface OperationalBlockProps {
  stats: {
    publicationsByStatus: { pending: number; rejected: number };
    businessKPIs: { validationRate: number; refusalRate: number; publications30d: number };
    team: { cmOnline: number; cmOverloaded: number; firmsWithoutCM: number; appointmentsToday: number };
    inactiveProfiles: number;
    clientHealth: { atRiskChurn: number };
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

export function OperationalBlock({ stats, loading }: OperationalBlockProps) {
  const s = stats;

  const productionItems: KPILine[] = [
    { label: "Posts en attente", value: s.publicationsByStatus.pending, icon: FileCheck, alert: s.publicationsByStatus.pending > 5, tooltip: "Publications soumises en attente de validation. Un volume élevé peut indiquer un goulot d'étranglement." },
    { label: "Taux validation", value: `${s.businessKPIs.validationRate}%`, icon: CheckCircle, positive: s.businessKPIs.validationRate >= 80, tooltip: "Pourcentage de publications validées vs soumises. Au-dessus de 80% indique une bonne qualité éditoriale." },
    { label: "CM en ligne", value: s.team.cmOnline, icon: Wifi, positive: s.team.cmOnline > 0, tooltip: "Community Managers actuellement connectés et disponibles." },
  ];

  const cabinetItems: KPILine[] = [
    { label: "Cabinets inactifs (30j)", value: s.inactiveProfiles, icon: UserX, alert: s.inactiveProfiles > 5, tooltip: "Cabinets sans activité depuis 30 jours. Risque de churn à surveiller." },
    { label: "RDV du jour", value: s.team.appointmentsToday, icon: CalendarCheck, tooltip: "Rendez-vous programmés aujourd'hui entre CM et cabinets." },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Production</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <LoadingSkeleton count={5} /> : <KPIList items={productionItems} />}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Activité cabinets</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <LoadingSkeleton count={4} /> : <KPIList items={cabinetItems} />}
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}
    </div>
  );
}
