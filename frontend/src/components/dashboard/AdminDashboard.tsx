import { AppLayout } from "@/components/layout/AppLayout";
import { WelcomeModal } from "@/components/onboarding/WelcomeModal";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { StrategicBar } from "./admin/StrategicBar";
import { MRREvolutionChart } from "./admin/MRREvolutionChart";
import { BusinessBlock } from "./admin/BusinessBlock";
import { PipelineConversionChart } from "./admin/PipelineConversionChart";
import { OperationalBlock } from "./admin/OperationalBlock";
import { OperationalActivityChart } from "./admin/OperationalActivityChart";
import { RiskAlertsList } from "./admin/RiskAlertsList";
import { AdminActivityLog } from "./admin/AdminActivityLog";
import { AdminDemoSeed } from "@/components/admin/AdminDemoSeed";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";

export function AdminDashboard() {
  const { showWelcome, completeOnboarding } = useOnboarding();
  const { stats, statsLoading, alerts, alertsLoading, activityLog, logLoading } = useAdminDashboard();
  const queryClient = useQueryClient();
  const handleSeedComplete = () => queryClient.invalidateQueries();

  const s = stats;
  const totalAlerts =
    (s.clientHealth.atRiskChurn || 0) +
    (s.clientHealth.paymentDelays || 0) +
    (s.team.firmsWithoutCM || 0);
  const healthLabel =
    totalAlerts === 0 ? "Sain" : totalAlerts <= 3 ? "Attention" : "Critique";
  const healthVariant =
    totalAlerts === 0
      ? ("secondary" as const)
      : totalAlerts <= 3
      ? ("default" as const)
      : ("destructive" as const);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Cockpit Admin</h1>
            <p className="text-sm text-muted-foreground">Vue stratégique temps réel</p>
          </div>
          <Badge variant={healthVariant} className="text-xs px-3 py-1">
            {healthLabel}
          </Badge>
        </div>

        {/* Zone 1 — Barre Stratégique */}
        <StrategicBar stats={s} loading={statsLoading} />

        {/* Zone 1b — Évolution MRR */}
        <MRREvolutionChart
          mrr={s.revenue.mrr}
          mrrVariation={s.revenue.mrrVariation}
          loading={statsLoading}
        />

        {/* Zone 2 — Bloc Business + Pipeline */}
        <BusinessBlock stats={s} loading={statsLoading} />
        <PipelineConversionChart
          acquisition={s.acquisition}
          demosCompleted={s.demosCompleted}
          loading={statsLoading}
        />

        {/* Zone 3 — Bloc Opérationnel + Activité */}
        <OperationalBlock stats={s} loading={statsLoading} />
        <OperationalActivityChart
          publications30d={s.businessKPIs.publications30d}
          refusalRate={s.businessKPIs.refusalRate}
          avgValidationTimeHours={s.businessKPIs.avgValidationTimeHours}
          loading={statsLoading}
        />

        {/* Zone 4 — Bloc Risque & Alertes */}
        <RiskAlertsList alerts={alerts} loading={alertsLoading} />

        {/* Zone 5 — Journal d'activité */}
        <AdminActivityLog entries={activityLog.slice(0, 5)} loading={logLoading} />

        {/* Seed démo */}
        <AdminDemoSeed onComplete={handleSeedComplete} />

        <WelcomeModal open={showWelcome} onComplete={completeOnboarding} />
      </div>
    </AppLayout>
  );
}

export default AdminDashboard;
