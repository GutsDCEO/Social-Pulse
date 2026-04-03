import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

interface PipelineConversionChartProps {
  acquisition: {
    leadsMonth: number;
    demosScheduled: number;
    testAccounts: number;
    converted: number;
  };
  demosCompleted: number;
  loading?: boolean;
}

const STAGE_COLORS = [
  "hsl(var(--primary))",
  "hsl(215, 70%, 55%)",
  "hsl(280, 55%, 55%)",
  "hsl(142, 60%, 45%)",
];

export function PipelineConversionChart({ acquisition, demosCompleted, loading }: PipelineConversionChartProps) {
  const data = [
    { stage: "Leads", count: acquisition.leadsMonth, fill: STAGE_COLORS[0] },
    { stage: "Démos", count: acquisition.demosScheduled + demosCompleted, fill: STAGE_COLORS[1] },
    { stage: "Tests", count: acquisition.testAccounts, fill: STAGE_COLORS[2] },
    { stage: "Convertis", count: acquisition.converted, fill: STAGE_COLORS[3] },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <TooltipProvider delayDuration={200}>
          <UITooltip>
            <TooltipTrigger asChild>
              <CardTitle className="text-base font-semibold flex items-center gap-1.5 cursor-default">
                Pipeline conversion
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </CardTitle>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[280px]">
              <p>Entonnoir de conversion du pipeline commercial. Visualise la progression des leads jusqu'à la conversion.</p>
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
              <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
                <XAxis
                  type="number"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="stage"
                  width={70}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
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
                  formatter={((v: number) => [v, "Comptes"]) as never}
                  cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
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
