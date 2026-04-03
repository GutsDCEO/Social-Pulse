import { 
  Building2, 
  Clock, 
  Send, 
  XCircle, 
  CalendarCheck, 
  AlertTriangle,
  Calendar,
  BarChart3,
  ShieldAlert
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  icon: React.ElementType;
  value: number;
  label: string;
  color: 'neutral' | 'warning' | 'danger' | 'success' | 'info';
  onClick: () => void;
  active?: boolean;
}

const COLOR_STYLES = {
  neutral: {
    bg: "bg-muted",
    icon: "text-muted-foreground",
    ring: "ring-border",
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    icon: "text-amber-600",
    ring: "ring-amber-500",
  },
  danger: {
    bg: "bg-destructive/10",
    icon: "text-destructive",
    ring: "ring-destructive",
  },
  success: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    icon: "text-emerald-600",
    ring: "ring-emerald-500",
  },
  info: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    icon: "text-blue-600",
    ring: "ring-blue-500",
  },
};

function KPICard({ icon: Icon, value, label, color, onClick, active }: KPICardProps) {
  const styles = COLOR_STYLES[color];
  
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]",
        active && `ring-2 ${styles.ring}`
      )}
      onClick={onClick}
    >
      <CardContent className="p-3 flex items-center gap-2.5">
        <div className={cn("p-2 rounded-lg", styles.bg)}>
          <Icon className={cn("h-4 w-4", styles.icon)} />
        </div>
        <div>
          <p className="text-xl font-bold leading-none">{value}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export type KPIFilter = 
  | 'firms' 
  | 'pending' 
  | 'awaiting_lawyer' 
  | 'refused' 
  | 'scheduled' 
  | 'late'
  | 'at_risk';

interface CMKPICardsProps {
  totalFirms: number;
  totalPending: number;
  totalAwaitingLawyer: number;
  totalRefused: number;
  totalScheduled: number;
  totalLate: number;
  totalAtRisk?: number;
  totalImminentAppointments?: number;
  totalPublications30d?: number;
  totalVolume?: number;
  activeFilter: KPIFilter | null;
  onFilterChange: (filter: KPIFilter | null) => void;
}

interface LevelSectionProps {
  label: string;
  colorClass: string;
  bgClass: string;
  children: React.ReactNode;
}

function LevelSection({ label, colorClass, bgClass, children }: LevelSectionProps) {
  return (
    <div className={cn("rounded-xl p-3 space-y-2", bgClass)}>
      <p className={cn("text-[10px] font-semibold uppercase tracking-wider", colorClass)}>
        {label}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {children}
      </div>
    </div>
  );
}

export function CMKPICards({
  totalFirms,
  totalPending,
  totalAwaitingLawyer,
  totalRefused,
  totalScheduled,
  totalLate,
  totalAtRisk = 0,
  totalImminentAppointments = 0,
  totalPublications30d = 0,
  totalVolume = 0,
  activeFilter,
  onFilterChange,
}: CMKPICardsProps) {
  const handleClick = (filter: KPIFilter) => {
    onFilterChange(activeFilter === filter ? null : filter);
  };

  return (
    <div className="space-y-3">
      {/* Niveau Rouge - Priorité immédiate */}
      <LevelSection 
        label="Priorité immédiate" 
        colorClass="text-destructive" 
        bgClass="bg-destructive/[0.04]"
      >
        <KPICard
          icon={AlertTriangle}
          value={totalLate}
          label="En retard"
          color={totalLate > 0 ? "danger" : "neutral"}
          onClick={() => handleClick('late')}
          active={activeFilter === 'late'}
        />
        <KPICard
          icon={Calendar}
          value={totalImminentAppointments}
          label="RDV imminents"
          color={totalImminentAppointments > 0 ? "danger" : "neutral"}
          onClick={() => handleClick('scheduled')}
          active={activeFilter === 'scheduled'}
        />
        <KPICard
          icon={ShieldAlert}
          value={totalAtRisk}
          label="Cabinets à risque"
          color={totalAtRisk > 0 ? "danger" : "neutral"}
          onClick={() => handleClick('at_risk')}
          active={activeFilter === 'at_risk'}
        />
      </LevelSection>

      {/* Niveau Jaune - À traiter aujourd'hui */}
      <LevelSection 
        label="À traiter aujourd'hui" 
        colorClass="text-amber-600" 
        bgClass="bg-amber-500/[0.04]"
      >
        <KPICard
          icon={Clock}
          value={totalPending}
          label="À valider"
          color={totalPending > 0 ? "warning" : "neutral"}
          onClick={() => handleClick('pending')}
          active={activeFilter === 'pending'}
        />
        <KPICard
          icon={Send}
          value={totalAwaitingLawyer}
          label="Attente avocat"
          color={totalAwaitingLawyer > 0 ? "info" : "neutral"}
          onClick={() => handleClick('awaiting_lawyer')}
          active={activeFilter === 'awaiting_lawyer'}
        />
        <KPICard
          icon={XCircle}
          value={totalRefused}
          label="Refusées"
          color={totalRefused > 0 ? "danger" : "neutral"}
          onClick={() => handleClick('refused')}
          active={activeFilter === 'refused'}
        />
      </LevelSection>

      {/* Niveau Bleu - Vue d'ensemble */}
      <LevelSection 
        label="Vue d'ensemble" 
        colorClass="text-blue-600" 
        bgClass="bg-blue-500/[0.04]"
      >
        <KPICard
          icon={Building2}
          value={totalFirms}
          label="Cabinets gérés"
          color="neutral"
          onClick={() => handleClick('firms')}
          active={activeFilter === 'firms'}
        />
        <KPICard
          icon={CalendarCheck}
          value={totalPublications30d}
          label="Publications 30j"
          color={totalPublications30d > 0 ? "success" : "neutral"}
          onClick={() => handleClick('scheduled')}
          active={false}
        />
        <KPICard
          icon={BarChart3}
          value={totalVolume}
          label="Volume global"
          color="info"
          onClick={() => handleClick('firms')}
          active={false}
        />
      </LevelSection>
    </div>
  );
}
