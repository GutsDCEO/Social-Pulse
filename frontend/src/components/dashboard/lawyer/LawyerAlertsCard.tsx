import { Link } from "react-router-dom";
import { Bell, AlertTriangle, ChevronRight, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface LawyerAlertsCardProps {
  limit?: number;
}

export function LawyerAlertsCard({ limit = 3 }: LawyerAlertsCardProps) {
  const { notifications, unreadCount, loading, markAsRead } = useNotifications();
  
  // Get the most recent unread notifications
  const recentAlerts = notifications
    .filter(n => !n.is_read)
    .slice(0, limit);

  // Don't show the card if there are no unread notifications
  if (!loading && recentAlerts.length === 0) {
    return null;
  }

  const getAlertIcon = (type: string) => {
    if (type.includes('critical') || type.includes('late') || type.includes('refused')) {
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    }
    return <Bell className="h-4 w-4 text-amber-500" />;
  };

  const getAlertStyle = (type: string) => {
    if (type.includes('critical') || type.includes('late') || type.includes('refused')) {
      return "border-l-destructive bg-destructive/5";
    }
    return "border-l-amber-500 bg-amber-50 dark:bg-amber-900/10";
  };

  const handleAlertClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
  };

  return (
    <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/10">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/20">
              <Bell className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="font-medium text-sm">Alertes</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
            <Link to="/validation">
              Tout voir
              <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>

        {/* Alerts list */}
        <div className="space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-4 text-muted-foreground text-sm">
              Chargement...
            </div>
          ) : (
            recentAlerts.map((alert) => (
              <Link
                key={alert.id}
                to={alert.action_url || "/validation"}
                onClick={() => handleAlertClick(alert)}
                className={`block p-3 rounded-lg border-l-4 transition-all hover:shadow-sm ${getAlertStyle(alert.type)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-1">
                      {alert.title}
                    </p>
                    {alert.message && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {alert.message}
                      </p>
                    )}
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(alert.created_at), { 
                        addSuffix: true, 
                        locale: fr 
                      })}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
