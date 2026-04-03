import { FileText, CheckCircle2, Calendar, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Publication } from "@/hooks/usePublications";
import { FirmStats } from "@/hooks/useCMWorkspace";

interface CMPerformanceBlockProps {
  publications: Publication[];
  firmStats: FirmStats[];
}

interface MetricItemProps {
  icon: React.ElementType;
  value: string;
  label: string;
  iconColor: string;
  iconBg: string;
}

function MetricItem({ icon: Icon, value, label, iconColor, iconBg }: MetricItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn("p-2 rounded-lg", iconBg)}>
        <Icon className={cn("h-4 w-4", iconColor)} />
      </div>
      <div>
        <p className="text-lg font-bold leading-none">{value}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export function CMPerformanceBlock({ publications, firmStats }: CMPerformanceBlockProps) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const producedThisMonth = publications.filter(
    p => new Date(p.created_at) >= startOfMonth
  ).length;

  const submitted = publications.filter(
    p => p.status === 'a_valider' || p.status === 'programme' || p.status === 'publie' || p.status === 'refuse'
  ).length;
  const validated = publications.filter(
    p => p.status === 'programme' || p.status === 'publie'
  ).length;
  const validationRate = submitted > 0 ? Math.round((validated / submitted) * 100) : 0;

  const stableFirms = firmStats.filter(f => f.status === 'ok').length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Performance CM</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <MetricItem
            icon={FileText}
            value={String(producedThisMonth)}
            label="Produites ce mois"
            iconColor="text-primary"
            iconBg="bg-primary/10"
          />
          <MetricItem
            icon={CheckCircle2}
            value={`${validationRate}%`}
            label="Taux validation"
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50 dark:bg-emerald-950/30"
          />
          <MetricItem
            icon={Calendar}
            value="0"
            label="RDV réalisés"
            iconColor="text-amber-600"
            iconBg="bg-amber-50 dark:bg-amber-950/30"
          />
          <MetricItem
            icon={Shield}
            value={String(stableFirms)}
            label="Cabinets stabilisés"
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50 dark:bg-emerald-950/30"
          />
        </div>
      </CardContent>
    </Card>
  );
}
