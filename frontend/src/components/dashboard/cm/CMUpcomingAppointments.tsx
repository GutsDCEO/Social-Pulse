import { Link } from "react-router-dom";
import { Video, Phone, CalendarDays, ChevronRight, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, isToday, isTomorrow, differenceInHours, differenceInMinutes } from "date-fns";
import { fr } from "date-fns/locale";

interface Appointment {
  id: string;
  type: "visio" | "phone";
  date: Date;
  duration: number;
  lawyerName: string;
  firmName: string;
  subject: string;
}

// Mock data - sera remplacé par des données de la base
const MOCK_UPCOMING_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    type: "visio",
    date: new Date(Date.now() + 2 * 60 * 60 * 1000),
    duration: 30,
    lawyerName: "Me Sophie Martin",
    firmName: "Cabinet Martin & Associés",
    subject: "Revue stratégie éditoriale Q1"
  },
  {
    id: "2",
    type: "phone",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000),
    duration: 20,
    lawyerName: "Me Jean Dupont",
    firmName: "Dupont Avocats",
    subject: "Point mensuel publications"
  },
  {
    id: "3",
    type: "visio",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 10.5 * 60 * 60 * 1000),
    duration: 45,
    lawyerName: "Me Claire Bernard",
    firmName: "Bernard & Partners",
    subject: "Nouvelle campagne LinkedIn"
  }
];

function getRelativeTime(date: Date): { text: string; isUrgent: boolean } {
  const now = new Date();
  const hoursUntil = differenceInHours(date, now);
  const minutesUntil = differenceInMinutes(date, now);

  if (minutesUntil < 60) {
    return { text: `Dans ${minutesUntil} min`, isUrgent: true };
  }
  if (hoursUntil < 3) {
    return { text: `Dans ${hoursUntil}h`, isUrgent: true };
  }
  if (isToday(date)) {
    return { text: `Aujourd'hui ${format(date, "HH:mm")}`, isUrgent: false };
  }
  if (isTomorrow(date)) {
    return { text: `Demain ${format(date, "HH:mm")}`, isUrgent: false };
  }
  return { 
    text: format(date, "EEE d MMM HH:mm", { locale: fr }), 
    isUrgent: false 
  };
}

export function CMUpcomingAppointments() {
  const appointments = MOCK_UPCOMING_APPOINTMENTS.slice(0, 3);
  const nextAppointment = appointments[0];
  const hasImminent = nextAppointment && differenceInHours(nextAppointment.date, new Date()) < 3;
  
  return (
    <Card className={cn(
      "bg-white/50 dark:bg-card/50 backdrop-blur-sm border-white/20 overflow-hidden transition-all",
      hasImminent && "border-l-4 border-l-amber-500 shadow-md"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold">Prochains RDV</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {appointments.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Imminent appointment banner */}
        {hasImminent && nextAppointment && (() => {
          const { text: timeText } = getRelativeTime(nextAppointment.date);
          const Icon = nextAppointment.type === "visio" ? Video : Phone;
          return (
            <div className="mb-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-amber-800 dark:text-amber-300">{timeText}</p>
                  <p className="text-sm font-medium truncate">{nextAppointment.lawyerName}</p>
                  <p className="text-xs text-muted-foreground truncate">{nextAppointment.firmName}</p>
                </div>
                <Button size="sm" variant="default" className="shrink-0 gap-1.5 bg-amber-600 hover:bg-amber-700 text-white">
                  <Icon className="h-3.5 w-3.5" />
                  {nextAppointment.type === "visio" ? "Rejoindre" : "Appeler"}
                </Button>
              </div>
            </div>
          );
        })()}

        {appointments.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Aucun rendez-vous prévu
          </p>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-3 top-3 bottom-3 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />
            
            <div className="space-y-3">
              {appointments.map((apt) => {
                const { text: timeText, isUrgent } = getRelativeTime(apt.date);
                const Icon = apt.type === "visio" ? Video : Phone;
                
                return (
                  <div 
                    key={apt.id}
                    className="relative pl-8 group"
                  >
                    {/* Timeline node */}
                    <div 
                      className={cn(
                        "absolute left-1.5 top-1 w-3 h-3 rounded-full border-2 transition-colors",
                        isUrgent 
                          ? "bg-destructive border-destructive animate-pulse" 
                          : "bg-background border-primary/50 group-hover:border-primary"
                      )}
                    />
                    
                    <div className="space-y-0.5">
                      {/* Time + duration */}
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-sm font-semibold",
                          isUrgent ? "text-destructive" : "text-foreground"
                        )}>
                          {timeText}
                        </span>
                        <Badge variant="outline" className="text-[10px] h-4 px-1.5 font-normal">
                          {apt.duration} min
                        </Badge>
                        {isUrgent && (
                          <Badge variant="destructive" className="text-[10px] h-4 px-1">
                            Imminent
                          </Badge>
                        )}
                      </div>
                      
                      {/* Lawyer + type */}
                      <div className="flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm font-medium truncate">
                          {apt.lawyerName}
                        </span>
                      </div>

                      {/* Firm name */}
                      <p className="text-xs text-muted-foreground truncate">
                        {apt.firmName}
                      </p>
                      
                      {/* Subject */}
                      <p className="text-xs text-muted-foreground/70 line-clamp-1">
                        {apt.subject}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Footer */}
        <Link 
          to="/assistant" 
          className="flex items-center justify-between pt-3 mt-3 border-t text-xs text-muted-foreground hover:text-foreground transition-colors group"
        >
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Voir tous les RDV
          </span>
          <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </CardContent>
    </Card>
  );
}
