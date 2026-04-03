import { useState } from "react";
import { BarChart3, Eye, Heart, MessageCircle, Share2, TrendingUp, TrendingDown, Percent, FileText, MousePointerClick, CheckCircle2, AlertCircle, XCircle, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LawyerQuickStatsCardProps {
  totalReach: number;
  previousMonthReach?: number;
  totalInteractions: number;
  likes: number;
  comments: number;
  shares: number;
  loading?: boolean;
  // New props
  engagementRate?: number;
  totalPublications?: number;
  clicks?: number;
  goodPerformers?: number;
  mediumPerformers?: number;
  improvePerformers?: number;
}

type KpiType = "visibility" | "engagement" | "rate" | "publications" | null;

interface Interpretation {
  status: "green" | "yellow" | "red";
  label: string;
  text: string;
}

export function LawyerQuickStatsCard({
  totalReach,
  previousMonthReach = 9000,
  totalInteractions,
  likes,
  comments,
  shares,
  loading,
  engagementRate = 4.2,
  totalPublications = 47,
  clicks = 89,
  goodPerformers = 28,
  mediumPerformers = 14,
  improvePerformers = 5,
}: LawyerQuickStatsCardProps) {
  const [hoveredKpi, setHoveredKpi] = useState<KpiType>(null);

  // Format number to k/M
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toLocaleString();
  };

  // Calculate growth percentage
  const reachGrowth = previousMonthReach > 0 
    ? Math.round(((totalReach - previousMonthReach) / previousMonthReach) * 100)
    : 0;
  const isPositiveGrowth = reachGrowth > 0;

  // Determine global status based on engagement rate
  const getGlobalStatus = (): "green" | "yellow" | "red" => {
    if (engagementRate >= 3.5) return "green";
    if (engagementRate >= 2) return "yellow";
    return "red";
  };

  // Interpretations for each KPI
  const interpretations: Record<string, Interpretation> = {
    default: {
      status: getGlobalStatus(),
      label: getGlobalStatus() === "green" 
        ? "Communication maîtrisée" 
        : getGlobalStatus() === "yellow" 
          ? "Communication à optimiser"
          : "Attention requise",
      text: getGlobalStatus() === "green"
        ? "Votre communication est régulière et génère un intérêt significatif auprès de votre audience professionnelle."
        : getGlobalStatus() === "yellow"
          ? "Votre communication progresse mais peut encore être optimisée pour renforcer votre visibilité."
          : "Votre présence en ligne nécessite plus d'attention pour développer votre notoriété."
    },
    visibility: {
      status: isPositiveGrowth ? "green" : reachGrowth === 0 ? "yellow" : "red",
      label: isPositiveGrowth ? "Visibilité en hausse" : reachGrowth === 0 ? "Visibilité stable" : "Visibilité en baisse",
      text: isPositiveGrowth 
        ? `Votre portée est en progression de ${reachGrowth}%. Cette audience élargie renforce votre crédibilité professionnelle.`
        : reachGrowth === 0
          ? "Votre visibilité reste stable. Envisagez de varier les formats pour élargir votre audience."
          : `Votre portée a diminué de ${Math.abs(reachGrowth)}%. Analysons les contenus qui performent le mieux.`
    },
    engagement: {
      status: totalInteractions > 500 ? "green" : totalInteractions > 200 ? "yellow" : "red",
      label: totalInteractions > 500 ? "Intérêt excellent" : totalInteractions > 200 ? "Intérêt correct" : "Intérêt à développer",
      text: totalInteractions > 500
        ? "L'intérêt suscité est remarquable. Vos prises de parole génèrent des réactions significatives de votre audience."
        : totalInteractions > 200
          ? "Vos publications génèrent un intérêt satisfaisant. Les appels à l'action peuvent amplifier l'engagement."
          : "L'engagement peut être renforcé avec des sujets plus proches des préoccupations de votre audience."
    },
    rate: {
      status: engagementRate >= 3.5 ? "green" : engagementRate >= 2 ? "yellow" : "red",
      label: engagementRate >= 3.5 ? "Taux remarquable" : engagementRate >= 2 ? "Taux dans la moyenne" : "Taux à améliorer",
      text: engagementRate >= 3.5
        ? `Un taux de ${engagementRate.toFixed(1)}% est excellent pour le secteur juridique. La moyenne se situe entre 2% et 3%.`
        : engagementRate >= 2
          ? `Votre taux de ${engagementRate.toFixed(1)}% est dans la moyenne. Des visuels plus percutants peuvent l'améliorer.`
          : `Un taux de ${engagementRate.toFixed(1)}% indique un potentiel d'amélioration. Privilégiez les sujets d'actualité juridique.`
    },
    publications: {
      status: totalPublications >= 40 ? "green" : totalPublications >= 20 ? "yellow" : "red",
      label: totalPublications >= 40 ? "Rythme soutenu" : totalPublications >= 20 ? "Rythme régulier" : "Rythme à intensifier",
      text: totalPublications >= 40
        ? `${totalPublications} publications ce mois maintiennent une présence professionnelle constante et renforcent votre expertise.`
        : totalPublications >= 20
          ? `${totalPublications} publications assurent une régularité appréciable. 2-3 posts supplémentaires par semaine seraient bénéfiques.`
          : `${totalPublications} publications ce mois. Une cadence plus soutenue renforcerait votre visibilité.`
    }
  };

  const activeInterp = interpretations[hoveredKpi || "default"];

  const statusConfig = {
    green: {
      bg: "bg-emerald-50/60 dark:bg-emerald-950/30",
      border: "border-emerald-200/60 dark:border-emerald-800/40",
      icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />,
      text: "text-emerald-700 dark:text-emerald-300"
    },
    yellow: {
      bg: "bg-amber-50/60 dark:bg-amber-950/30",
      border: "border-amber-200/60 dark:border-amber-800/40",
      icon: <AlertCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />,
      text: "text-amber-700 dark:text-amber-300"
    },
    red: {
      bg: "bg-orange-50/60 dark:bg-orange-950/30",
      border: "border-orange-200/60 dark:border-orange-800/40",
      icon: <Lightbulb className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />,
      text: "text-orange-700 dark:text-orange-300"
    }
  };

  const currentStatus = statusConfig[activeInterp.status];

  if (loading) {
    return (
      <Card className="h-full bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/20 dark:to-blue-950/20 border-indigo-100/50 dark:border-indigo-800/30">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Skeleton className="h-14 rounded-lg" />
            <Skeleton className="h-14 rounded-lg" />
            <Skeleton className="h-14 rounded-lg" />
            <Skeleton className="h-14 rounded-lg" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/20 dark:to-blue-950/20 border-indigo-100/50 dark:border-indigo-800/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          Statistiques clés
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Main KPIs - 4 columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Visibility KPI */}
          <div 
            className={cn(
              "bg-white/60 dark:bg-white/5 rounded-lg p-2 border border-indigo-100/50 dark:border-indigo-800/30 cursor-pointer transition-all",
              hoveredKpi === "visibility" && "ring-2 ring-indigo-300 dark:ring-indigo-600"
            )}
            onMouseEnter={() => setHoveredKpi("visibility")}
            onMouseLeave={() => setHoveredKpi(null)}
          >
            <div className="flex items-center gap-1 text-muted-foreground text-[10px] mb-0.5">
              <Eye className="h-3 w-3" />
              Vues
            </div>
            <div className="text-lg font-bold text-foreground tabular-nums">
              {formatNumber(totalReach)}
            </div>
            <div className={`flex items-center gap-0.5 text-[10px] font-medium ${
              isPositiveGrowth 
                ? "text-emerald-600 dark:text-emerald-400" 
                : reachGrowth < 0 
                  ? "text-orange-600 dark:text-orange-400"
                  : "text-muted-foreground"
            }`}>
              {isPositiveGrowth ? <TrendingUp className="h-2.5 w-2.5" /> : reachGrowth < 0 ? <TrendingDown className="h-2.5 w-2.5" /> : null}
              {reachGrowth > 0 ? "+" : ""}{reachGrowth}%
            </div>
          </div>

          {/* Engagement KPI */}
          <div 
            className={cn(
              "bg-white/60 dark:bg-white/5 rounded-lg p-2 border border-indigo-100/50 dark:border-indigo-800/30 cursor-pointer transition-all",
              hoveredKpi === "engagement" && "ring-2 ring-indigo-300 dark:ring-indigo-600"
            )}
            onMouseEnter={() => setHoveredKpi("engagement")}
            onMouseLeave={() => setHoveredKpi(null)}
          >
            <div className="flex items-center gap-1 text-muted-foreground text-[10px] mb-0.5">
              <Heart className="h-3 w-3" />
              Interac.
            </div>
            <div className="text-lg font-bold text-foreground tabular-nums">
              {formatNumber(totalInteractions)}
            </div>
            <div className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-2.5 w-2.5" />
              +12%
            </div>
          </div>

          {/* Engagement Rate KPI */}
          <div 
            className={cn(
              "bg-white/60 dark:bg-white/5 rounded-lg p-2 border border-indigo-100/50 dark:border-indigo-800/30 cursor-pointer transition-all",
              hoveredKpi === "rate" && "ring-2 ring-indigo-300 dark:ring-indigo-600"
            )}
            onMouseEnter={() => setHoveredKpi("rate")}
            onMouseLeave={() => setHoveredKpi(null)}
          >
            <div className="flex items-center gap-1 text-muted-foreground text-[10px] mb-0.5">
              <Percent className="h-3 w-3" />
              Taux eng.
            </div>
            <div className="text-lg font-bold text-foreground tabular-nums">
              {engagementRate.toFixed(1)}%
            </div>
            <div className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-2.5 w-2.5" />
              +0.3pt
            </div>
          </div>

          {/* Publications KPI */}
          <div 
            className={cn(
              "bg-white/60 dark:bg-white/5 rounded-lg p-2 border border-indigo-100/50 dark:border-indigo-800/30 cursor-pointer transition-all",
              hoveredKpi === "publications" && "ring-2 ring-indigo-300 dark:ring-indigo-600"
            )}
            onMouseEnter={() => setHoveredKpi("publications")}
            onMouseLeave={() => setHoveredKpi(null)}
          >
            <div className="flex items-center gap-1 text-muted-foreground text-[10px] mb-0.5">
              <FileText className="h-3 w-3" />
              Posts
            </div>
            <div className="text-lg font-bold text-foreground tabular-nums">
              {totalPublications}
            </div>
            <div className="text-[10px] text-muted-foreground">
              ce mois
            </div>
          </div>
        </div>

        {/* Condensed details - Line 1: Engagement breakdown */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            {comments}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {likes}
          </span>
          <span className="flex items-center gap-1">
            <Share2 className="h-3 w-3" />
            {shares}
          </span>
          <span className="flex items-center gap-1">
            <MousePointerClick className="h-3 w-3" />
            {clicks} clics
          </span>
        </div>

        {/* Condensed details - Line 2: Performance indicators */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            {goodPerformers} perfs
          </span>
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-3 w-3" />
            {mediumPerformers} moyens
          </span>
          <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
            <XCircle className="h-3 w-3" />
            {improvePerformers} à améliorer
          </span>
        </div>

        {/* Dynamic Interpretation Zone */}
        <div className={cn(
          "p-2.5 rounded-lg border transition-all duration-200",
          currentStatus.bg,
          currentStatus.border
        )}>
          <div className={cn("flex items-center gap-1.5 mb-1 font-medium text-[11px]", currentStatus.text)}>
            {currentStatus.icon}
            {activeInterp.label}
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {activeInterp.text}
          </p>
        </div>

        {/* CTA Link */}
        <Link 
          to="/metrics" 
          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          Voir les métriques détaillées
          <TrendingUp className="h-3 w-3" />
        </Link>
      </CardContent>
    </Card>
  );
}