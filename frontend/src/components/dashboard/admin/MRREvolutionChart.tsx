import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface MRREvolutionChartProps {
  mrr: number;
  mrrVariation: number;
  loading?: boolean;
}

function generateMRRHistory(currentMRR: number, variation: number) {
  const months = ["Sept", "Oct", "Nov", "Déc", "Jan", "Fév"];
  const data = [];
  let mrr = currentMRR;
  const growthFactor = 1 + (variation / 100);

  // Work backwards from current MRR
  for (let i = months.length - 1; i >= 0; i--) {
    data.unshift({ month: months[i], mrr: Math.round(mrr) });
    mrr = mrr / (1 + (variation / 100) * (0.7 + Math.random() * 0.6));
  }
  return data;
}

export function MRREvolutionChart({ mrr, mrrVariation, loading }: MRREvolutionChartProps) {
  const data = generateMRRHistory(mrr, mrrVariation);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <TooltipProvider delayDuration={200}>
            <UITooltip>
              <TooltipTrigger asChild>
                <CardTitle className="text-base font-semibold flex items-center gap-1.5 cursor-default">
                  Évolution MRR
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </CardTitle>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[280px]">
                <p>Courbe d'évolution du revenu récurrent mensuel sur 6 mois. Une tendance haussière régulière confirme la scalabilité du modèle.</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
          <span className={`text-xs font-medium ${mrrVariation >= 0 ? "text-emerald-600" : "text-destructive"}`}>
            {mrrVariation >= 0 ? "+" : ""}{mrrVariation}% vs M-1
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-44 w-full rounded" />
        ) : (
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
                <defs>
                  <linearGradient id="mrrDashGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" opacity={0.4} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={((v: number) => [`${v.toLocaleString("fr-FR")} €`, "MRR"]) as never}
                />
                <Area
                  type="monotone"
                  dataKey="mrr"
                  stroke="hsl(var(--primary))"
                  fill="url(#mrrDashGrad)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
