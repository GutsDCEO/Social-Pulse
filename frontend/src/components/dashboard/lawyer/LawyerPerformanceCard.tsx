import { Link } from "react-router-dom";
import { TrendingUp, Eye, Heart, MessageCircle, Share2, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PublicationMetric } from "@/hooks/useMetrics";
import { useMemo } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { format, subDays } from "date-fns";
import { fr } from "date-fns/locale";

interface LawyerPerformanceCardProps {
  metrics: PublicationMetric[];
  loading?: boolean;
}

export function LawyerPerformanceCard({ metrics, loading }: LawyerPerformanceCardProps) {
  // Generate chart data for the last 14 days
  const chartData = useMemo(() => {
    const now = new Date();
    const data = [];
    
    for (let i = 13; i >= 0; i--) {
      const date = subDays(now, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Find metrics for this day
      const dayMetrics = metrics.filter(m => 
        m.recorded_at.startsWith(dateStr)
      );
      
      // Calculate totals for the day
      const engagements = dayMetrics.reduce((sum, m) => 
        sum + m.likes + m.comments_count + m.shares, 0
      );
      
      // Demo fallback for empty data
      const demoEngagements = Math.floor(Math.random() * 50) + 20 + (13 - i) * 3;
      
      data.push({
        date: format(date, 'dd/MM', { locale: fr }),
        engagements: dayMetrics.length > 0 ? engagements : demoEngagements,
      });
    }
    
    return data;
  }, [metrics]);

  // Get top 3 performing publications
  const topPublications = useMemo(() => {
    if (metrics.length === 0) {
      // Demo data
      return [
        { id: '1', title: 'Licenciement abusif : vos droits', reach: 1240, performance: 'good' as const },
        { id: '2', title: 'Garde alternée : les critères', reach: 890, performance: 'good' as const },
        { id: '3', title: 'Délais de prescription', reach: 650, performance: 'medium' as const },
      ];
    }
    
    return metrics
      .sort((a, b) => (b.reach ?? 0) - (a.reach ?? 0))
      .slice(0, 3)
      .map(m => ({
        id: m.id,
        title: m.publication?.content?.substring(0, 40) + '...' || 'Publication',
        reach: m.reach ?? 0,
        performance: m.performance_level || 'medium' as const,
      }));
  }, [metrics]);

  const getPerformanceBadge = (level: string | null) => {
    switch (level) {
      case 'good':
        return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px]">Excellent</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[10px]">Bon</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px]">À optimiser</Badge>;
    }
  };

  // Calculate total engagement trend
  const totalEngagements = chartData.reduce((sum, d) => sum + d.engagements, 0);
  const avgEngagements = Math.round(totalEngagements / chartData.length);

  return (
    <Card className="bg-card border transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/20">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <span>Performances récentes</span>
          </CardTitle>
          <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
            <Link to="/metrics">
              Détails
              <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          </>
        ) : (
          <>
            {/* Mini engagement chart */}
            <div className="h-24 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="engagementsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }} 
                    axisLine={false} 
                    tickLine={false}
                    interval={3}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      fontSize: 12, 
                      borderRadius: 8,
                      border: '1px solid hsl(var(--border))',
                      backgroundColor: 'hsl(var(--background))'
                    }}
                    formatter={((value: number) => [`${value} interactions`, 'Engagements']) as never}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="engagements" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fill="url(#engagementsGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Stats summary */}
            <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
              <span>Moyenne journalière</span>
              <span className="font-semibold text-foreground">{avgEngagements} interactions</span>
            </div>

            {/* Top publications */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Meilleures publications</p>
              {topPublications.map((pub, index) => (
                <div 
                  key={pub.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{pub.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      <span>{(pub.reach ?? 0).toLocaleString()}</span>
                    </div>
                  </div>
                  {getPerformanceBadge(pub.performance)}
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
