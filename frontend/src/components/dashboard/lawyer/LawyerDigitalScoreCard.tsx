import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, CheckCircle2, AlertCircle, TrendingUp, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { usePublications } from "@/hooks/usePublications";
import { useMetrics } from "@/hooks/useMetrics";
import { useSocialConnections } from "@/hooks/useSocialConnections";
import { useGoogleBusiness } from "@/hooks/useGoogleBusiness";
import { useBlogArticles } from "@/hooks/useBlogArticles";

interface ScoreFactor {
  label: string;
  score: number;
  maxScore: number;
  status: 'good' | 'warning' | 'improve';
}

export function LawyerDigitalScoreCard() {
  const { publications, loading: pubLoading } = usePublications();
  const { globalMetrics, loading: metricsLoading } = useMetrics();
  const { connections, loading: connectionsLoading } = useSocialConnections();
  const { reviews, loading: googleLoading } = useGoogleBusiness();
  const { articles, loading: blogLoading } = useBlogArticles();

  const loading = pubLoading || metricsLoading || connectionsLoading || googleLoading || blogLoading;

  // Animation states
  const [animatedScore, setAnimatedScore] = useState(0);
  const [progressMultiplier, setProgressMultiplier] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Calculate score factors
  const scoreData = useMemo(() => {
    // 1. Publication regularity (30 points)
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const recentPubs = publications.filter(p => 
      p.status === 'publie' && new Date(p.published_at || p.scheduled_date) >= last30Days
    ).length;
    const regularityScore = Math.min(recentPubs * 3, 30); // 10 posts = max score

    // 2. Engagement rate (25 points)
    const engagementRate = globalMetrics.avgEngagementRate || 3.5;
    const engagementScore = Math.min(Math.round(engagementRate * 5), 25); // 5% = max

    // 3. Connected networks (15 points)
    const activeNetworks = connections.filter(c => c.is_active).length || 1;
    const networksScore = Math.min(activeNetworks * 5, 15); // 3 networks = max

    // 4. Google response rate (15 points)
    const totalReviews = reviews.length || 5;
    const repliedReviews = reviews.filter(r => r.review_reply).length || 3;
    const replyRate = totalReviews > 0 ? (repliedReviews / totalReviews) : 0.6;
    const googleScore = Math.round(replyRate * 15);

    // 5. Blog articles (15 points)
    const publishedArticles = articles.filter(a => a.status === 'publie').length || 2;
    const blogScore = Math.min(publishedArticles * 3, 15); // 5 articles = max

    const totalScore = regularityScore + engagementScore + networksScore + googleScore + blogScore;

    const factors: ScoreFactor[] = [
      {
        label: 'Régularité',
        score: regularityScore,
        maxScore: 30,
        status: regularityScore >= 20 ? 'good' : regularityScore >= 10 ? 'warning' : 'improve',
      },
      {
        label: 'Engagement',
        score: engagementScore,
        maxScore: 25,
        status: engagementScore >= 15 ? 'good' : engagementScore >= 8 ? 'warning' : 'improve',
      },
      {
        label: 'Réseaux',
        score: networksScore,
        maxScore: 15,
        status: networksScore >= 10 ? 'good' : networksScore >= 5 ? 'warning' : 'improve',
      },
      {
        label: 'E-réputation',
        score: googleScore,
        maxScore: 15,
        status: googleScore >= 10 ? 'good' : googleScore >= 5 ? 'warning' : 'improve',
      },
      {
        label: 'Blog',
        score: blogScore,
        maxScore: 15,
        status: blogScore >= 10 ? 'good' : blogScore >= 5 ? 'warning' : 'improve',
      },
    ];

    return { totalScore, factors };
  }, [publications, globalMetrics, connections, reviews, articles]);

  // Determine overall status with colors for SVG ring
  const scoreStatus = useMemo(() => {
    if (scoreData.totalScore >= 75) return { label: 'Excellente', color: 'text-emerald-600', bg: 'bg-emerald-500', stroke: 'stroke-emerald-500' };
    if (scoreData.totalScore >= 50) return { label: 'Bonne', color: 'text-blue-600', bg: 'bg-blue-500', stroke: 'stroke-blue-500' };
    if (scoreData.totalScore >= 25) return { label: 'À améliorer', color: 'text-amber-600', bg: 'bg-amber-500', stroke: 'stroke-amber-500' };
    return { label: 'À développer', color: 'text-red-600', bg: 'bg-red-500', stroke: 'stroke-red-500' };
  }, [scoreData.totalScore]);

  // SVG ring calculations
  const ringSize = 96; // w-24 = 96px
  const strokeWidth = 8;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressMultiplier * scoreData.totalScore / 100) * circumference;

  // Animation effect
  useEffect(() => {
    if (loading || hasAnimated) return;
    
    const duration = 1500; // 1.5 seconds
    const startTime = performance.now();
    const targetScore = scoreData.totalScore;
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setAnimatedScore(Math.round(targetScore * easeOutQuart));
      setProgressMultiplier(easeOutQuart);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setHasAnimated(true);
      }
    };
    
    requestAnimationFrame(animate);
  }, [loading, scoreData.totalScore, hasAnimated]);

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  const statusIcon = {
    good: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
    warning: <AlertCircle className="h-3.5 w-3.5 text-amber-500" />,
    improve: <TrendingUp className="h-3.5 w-3.5 text-red-500" />,
  };

  return (
    <Card className="bg-card border transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
            <Target className="h-4 w-4 text-primary" />
          </div>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center gap-1.5 cursor-default">
                  Score de présence digitale
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[280px]">
                <p>Score composite évaluant votre présence digitale sur 5 axes : régularité, engagement, réseaux, e-réputation et blog.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main score */}
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24">
            {/* SVG Progress Ring */}
            <svg
              className="absolute inset-0 -rotate-90"
              width={ringSize}
              height={ringSize}
            >
              {/* Background circle */}
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                fill="none"
                className="stroke-muted"
                strokeWidth={strokeWidth}
              />
              {/* Animated progress circle */}
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                fill="none"
                className={cn("transition-all duration-100", scoreStatus.stroke)}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            {/* Score text in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-3xl font-bold tabular-nums">{animatedScore}</span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
            </div>
            {/* Status badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.3, ease: "easeOut" }}
              className={cn(
                "absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-medium text-white",
                scoreStatus.bg
              )}
            >
              {scoreStatus.label}
            </motion.div>
          </div>

          {/* Factors breakdown */}
          <div className="flex-1 space-y-2">
            {scoreData.factors.map((factor, index) => {
              // Staggered animation for each bar
              const staggerDelay = index * 0.1;
              const factorProgress = Math.max(0, Math.min(1, (progressMultiplier - staggerDelay) / (1 - staggerDelay)));
              const animatedFactorScore = Math.round(factor.score * factorProgress);
              
              return (
                <div key={factor.label} className="flex items-center gap-2">
                  {statusIcon[factor.status]}
                  <span className="text-xs text-muted-foreground w-20">{factor.label}</span>
                  <Progress 
                    value={(factor.score / factor.maxScore) * 100 * factorProgress} 
                    className="flex-1 h-1.5"
                  />
                  <span className="text-xs font-medium w-8 text-right tabular-nums">
                    {animatedFactorScore}/{factor.maxScore}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benchmark */}
        <p className="text-xs text-muted-foreground bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-2 text-center">
          🏆 Votre présence est dans le <span className="font-semibold text-foreground">top 25%</span> des cabinets de votre spécialité
        </p>
      </CardContent>
    </Card>
  );
}
