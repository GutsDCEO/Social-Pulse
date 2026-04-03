import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  XCircle,
  Clock,
  ChevronRight,
  Building2,
  Edit,
  Target,
  CalendarX,
  PauseCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Publication } from "@/hooks/usePublications";
import { FirmStats } from "@/hooks/useCMWorkspace";
import { differenceInDays, differenceInHours, parseISO, subDays } from "date-fns";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────

type AlertCategory = "late" | "blocked" | "refuse" | "inactive";

interface FirmAlert {
  firmId: string;
  firmName: string;
  late: number;
  blocked: number;
  refuse: number;
  inactive: boolean;
  totalScore: number;
  causes: string[];
  severity: "critical" | "warning" | "info";
}

interface CMCriticalAlertsProps {
  publications: Publication[];
  firmNamesMap: Map<string, string>;
  onEditPublication: (id: string) => void;
  firmStats?: FirmStats[];
}

// ── Category config ────────────────────────────────────

const CATEGORIES: {
  id: AlertCategory;
  label: string;
  icon: React.ElementType;
  colorBar: string;
  colorText: string;
}[] = [
  { id: "late", label: "Publications en retard", icon: CalendarX, colorBar: "bg-destructive", colorText: "text-destructive" },
  { id: "blocked", label: "Validations bloquées", icon: Clock, colorBar: "bg-amber-500", colorText: "text-amber-600" },
  { id: "refuse", label: "Refus client", icon: XCircle, colorBar: "bg-destructive", colorText: "text-destructive" },
  { id: "inactive", label: "Inactivité cabinet", icon: PauseCircle, colorBar: "bg-blue-500", colorText: "text-blue-600" },
];

// ── Helpers ────────────────────────────────────────────

function buildFirmAlerts(
  publications: Publication[],
  firmNamesMap: Map<string, string>,
  firmStats?: FirmStats[]
): { categoryCounts: Record<AlertCategory, number>; firms: FirmAlert[] } {
  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30);

  // Per-firm accumulators
  const map = new Map<string, Omit<FirmAlert, "totalScore" | "causes" | "severity">>();

  const ensure = (firmId: string) => {
    if (!map.has(firmId)) {
      map.set(firmId, {
        firmId,
        firmName: firmNamesMap.get(firmId) || "Cabinet inconnu",
        late: 0,
        blocked: 0,
        refuse: 0,
        inactive: false,
      });
    }
    return map.get(firmId)!;
  };

  publications.forEach((pub) => {
    const fid = pub.law_firm_id || "";
    if (!fid) return;

    if (pub.status === "programme" && parseISO(pub.scheduled_date) < now) {
      ensure(fid).late++;
    }
    if (pub.status === "a_valider" && differenceInHours(now, parseISO(pub.created_at)) > 48) {
      ensure(fid).blocked++;
    }
    if (pub.status === "refuse") {
      ensure(fid).refuse++;
    }
  });

  // Inactive detection via firmStats
  if (firmStats) {
    firmStats.forEach((fs) => {
      if (fs.total === 0 || fs.status === "blocked") {
        // also check if no recent publication
        const hasRecent = publications.some(
          (p) => p.law_firm_id === fs.firm.id && parseISO(p.created_at) > thirtyDaysAgo
        );
        if (!hasRecent) {
          ensure(fs.firm.id).inactive = true;
        }
      }
    });
  }

  // Build scored list
  const firms: FirmAlert[] = Array.from(map.values())
    .map((f) => {
      const totalScore = f.late * 3 + f.refuse * 2 + f.blocked * 1 + (f.inactive ? 1 : 0);
      const causes: string[] = [];
      if (f.late > 0) causes.push(`${f.late} en retard`);
      if (f.refuse > 0) causes.push(`${f.refuse} refus`);
      if (f.blocked > 0) causes.push(`${f.blocked} bloquée${f.blocked > 1 ? "s" : ""}`);
      if (f.inactive) causes.push("Inactif 30j");

      const severity: FirmAlert["severity"] =
        f.late > 0 || f.refuse > 1 ? "critical" : f.blocked > 0 || f.refuse > 0 ? "warning" : "info";

      return { ...f, totalScore, causes, severity };
    })
    .filter((f) => f.totalScore > 0)
    .sort((a, b) => b.totalScore - a.totalScore);

  // Aggregate category counts
  const categoryCounts: Record<AlertCategory, number> = { late: 0, blocked: 0, refuse: 0, inactive: 0 };
  firms.forEach((f) => {
    categoryCounts.late += f.late;
    categoryCounts.blocked += f.blocked;
    categoryCounts.refuse += f.refuse;
    if (f.inactive) categoryCounts.inactive++;
  });

  return { categoryCounts, firms };
}

// ── Sub-components ─────────────────────────────────────

function CategoryBar({
  cat,
  count,
  maxCount,
  isActive,
  onClick,
}: {
  cat: (typeof CATEGORIES)[number];
  count: number;
  maxCount: number;
  isActive: boolean;
  onClick: () => void;
}) {
  if (count === 0) return null;
  const Icon = cat.icon;
  const pct = maxCount > 0 ? Math.max(8, (count / maxCount) * 100) : 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left group",
        isActive ? "bg-muted ring-1 ring-primary/20" : "hover:bg-muted/50"
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", cat.colorText)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium truncate">{cat.label}</span>
          <span className={cn("text-xs font-bold tabular-nums", cat.colorText)}>{count}</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted-foreground/10 overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", cat.colorBar)}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </button>
  );
}

const SEVERITY_BORDER: Record<FirmAlert["severity"], string> = {
  critical: "border-l-destructive",
  warning: "border-l-amber-500",
  info: "border-l-blue-500",
};

const SEVERITY_BADGE: Record<FirmAlert["severity"], { label: string; className: string }> = {
  critical: { label: "Critique", className: "bg-destructive text-destructive-foreground" },
  warning: { label: "Attention", className: "bg-amber-500 text-white" },
  info: { label: "Stable", className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
};

function FirmCard({ firm, onEdit }: { firm: FirmAlert; onEdit: (id: string) => void }) {
  const badge = SEVERITY_BADGE[firm.severity];

  return (
    <div
      className={cn(
        "border rounded-lg p-3 border-l-4 bg-card",
        SEVERITY_BORDER[firm.severity]
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-sm font-medium truncate">{firm.firmName}</span>
            <Badge className={cn("text-[10px] px-1.5 py-0 shrink-0", badge.className)}>
              {badge.label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{firm.causes.join(" · ")}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" asChild>
            <Link to={`/validation?firm=${firm.firmId}`}>
              <Target className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────

export function CMCriticalAlerts({ publications, firmNamesMap, onEditPublication, firmStats }: CMCriticalAlertsProps) {
  const [activeCategory, setActiveCategory] = useState<AlertCategory | null>(null);

  const { categoryCounts, firms } = useMemo(
    () => buildFirmAlerts(publications, firmNamesMap, firmStats),
    [publications, firmNamesMap, firmStats]
  );

  const totalAlerts = categoryCounts.late + categoryCounts.blocked + categoryCounts.refuse + categoryCounts.inactive;
  const maxCount = Math.max(categoryCounts.late, categoryCounts.blocked, categoryCounts.refuse, categoryCounts.inactive, 1);

  // Filter firms based on active category
  const visibleFirms = useMemo(() => {
    let list = firms;
    if (activeCategory) {
      list = firms.filter((f) => {
        switch (activeCategory) {
          case "late": return f.late > 0;
          case "blocked": return f.blocked > 0;
          case "refuse": return f.refuse > 0;
          case "inactive": return f.inactive;
        }
      });
    }
    return list.slice(0, 5);
  }, [firms, activeCategory]);

  // Empty state
  if (totalAlerts === 0) {
    return (
      <Card className="bg-card border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            Alertes critiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <div className="text-3xl mb-2">✓</div>
            <p className="text-sm">Aucune alerte critique</p>
            <p className="text-xs mt-1">Tous vos contenus sont en bonne voie</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleCategoryClick = (cat: AlertCategory) => {
    setActiveCategory((prev) => (prev === cat ? null : cat));
  };

  return (
    <Card className="bg-card border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Alertes critiques
          </CardTitle>
          <Badge variant="destructive" className="text-xs">{totalAlerts}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* SECTION 1 — Répartition */}
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <CategoryBar
              key={cat.id}
              cat={cat}
              count={categoryCounts[cat.id]}
              maxCount={maxCount}
              isActive={activeCategory === cat.id}
              onClick={() => handleCategoryClick(cat.id)}
            />
          ))}
        </div>

        {/* SECTION 2 — Cabinets à risque */}
        {visibleFirms.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Cabinets les plus à risque
              {activeCategory && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 px-1.5 ml-2 text-[10px]"
                  onClick={() => setActiveCategory(null)}
                >
                  Réinitialiser
                </Button>
              )}
            </p>
            {visibleFirms.map((firm) => (
              <FirmCard key={firm.firmId} firm={firm} onEdit={onEditPublication} />
            ))}
          </div>
        )}

        {/* SECTION 3 — Voir tout */}
        <Link
          to="/validation"
          className="flex items-center justify-between pt-3 border-t text-xs text-muted-foreground hover:text-foreground transition-colors group"
        >
          <span>
            Voir toutes les alertes
            {firms.length > 5 ? ` (+${firms.length - 5} autres cabinets)` : ""}
          </span>
          <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </CardContent>
    </Card>
  );
}
