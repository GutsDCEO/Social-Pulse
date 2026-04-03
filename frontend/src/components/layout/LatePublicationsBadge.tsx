import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePublications } from "@/hooks/usePublications";
import { useUserRole } from "@/hooks/useUserRole";
import { useMemo } from "react";
import { parseISO, isBefore } from "date-fns";

export function LatePublicationsBadge() {
  const { isCommunityManager } = useUserRole();
  const { publications, loading } = usePublications({ showAllFirms: isCommunityManager });

  const lateCount = useMemo(() => {
    if (loading) return 0;
    const now = new Date();

    return publications.filter((pub) => {
      if (pub.status !== "programme") return false;
      
      const scheduledDateTime = parseISO(pub.scheduled_date);
      const [hours, minutes] = (pub.scheduled_time || "09:00").split(":").map(Number);
      scheduledDateTime.setHours(hours, minutes, 0, 0);
      
      return isBefore(scheduledDateTime, now);
    }).length;
  }, [publications, loading]);

  if (lateCount === 0) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="relative h-9 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Link to="/validation">
            <AlertTriangle className="h-4 w-4" />
            <Badge 
              variant="destructive" 
              className="h-5 min-w-5 px-1.5 text-xs font-semibold"
            >
              {lateCount > 99 ? "99+" : lateCount}
            </Badge>
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={8}>
        <p>{lateCount} publication{lateCount > 1 ? "s" : ""} en retard</p>
      </TooltipContent>
    </Tooltip>
  );
}
