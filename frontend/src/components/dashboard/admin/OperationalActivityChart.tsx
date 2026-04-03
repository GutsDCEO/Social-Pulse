import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

interface OperationalActivityChartProps {
  publications30d: number;
  refusalRate: number;
  avgValidationTimeHours: number;
  loading?: boolean;
}

export function OperationalActivityChart({
  publications30d, refusalRate, avgValidationTimeHours, loading,
}: OperationalActivityChartProps) {
  const refused = Math.round((publications30d * refusalRate) / 100);
  const validated = publications30d - refused;

  const data = [
    { label: "Publiés", value: validated, fill: "hsl(var(--primary))" },
    { label: "Refusés", value: refused, fill: "hsl(var(--destructive))" },
    { label: "Délai moy. (h)", value: avgValidationTimeHours, fill: "hsl(var(--muted-foreground))" },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <TooltipProvider delayDuration={200}>
          <UITooltip>
            <TooltipTrigger asChild>
              <CardTitle className="text-base font-semibold flex items-center gap-1.5 cursor-default">
                Activité opérationnelle (30j)
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </CardTitle>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[280px]">
              <p>Répartition de l'activité éditoriale sur 30 jours : publications validées, refusées et délai moyen de validation.</p>
            </TooltipContent>
          </UITooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-44 w-full rounded" />
        ) : (
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
                <XAxis
                  dataKey="label"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={36}>
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
