import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlatformBadge } from "@/components/ui/platform-badge";
import { Publication, PublicationStatus } from "@/hooks/usePublications";
import { AutoValidationCountdown, AutoValidationInfo } from "@/components/validation/AutoValidationCountdown";
import { 
  Clock, 
  X, 
  Sparkles, 
  User,
  Edit,
  CheckCircle,
  BarChart3,
  Calendar as CalendarIcon,
  Building2,
  Trash2,
  CalendarClock,
  Target
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface PublicationDetailPanelProps {
  publication: Publication;
  onClose: () => void;
  onEdit: () => void;
  onValidate?: () => void;
  onDelete?: () => void;
  onReschedule?: () => void;
  autoValidationInfo?: AutoValidationInfo | null;
  firmName?: string;
}

const STATUS_CONFIG: Record<PublicationStatus, { label: string; variant: "draft" | "pending" | "scheduled" | "published" | "refused" }> = {
  brouillon: { 
    label: "Brouillon", 
    variant: "draft"
  },
  a_valider: { 
    label: "À valider", 
    variant: "pending"
  },
  programme: { 
    label: "Programmé", 
    variant: "scheduled"
  },
  publie: { 
    label: "Publié", 
    variant: "published"
  },
  refuse: { 
    label: "Refusé", 
    variant: "refused"
  },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  routine: { label: "Routine", color: "bg-muted-foreground" },
  important: { label: "Important", color: "bg-amber-500" },
  strategique: { label: "Stratégique", color: "bg-violet-500" },
};

export function PublicationDetailPanel({ 
  publication, 
  onClose,
  onEdit,
  onValidate,
  onDelete,
  onReschedule,
  autoValidationInfo,
  firmName
}: PublicationDetailPanelProps) {
  const navigate = useNavigate();
  const statusConfig = STATUS_CONFIG[publication.status];
  const scheduledDate = new Date(publication.scheduled_date);

  const handleViewMetrics = () => {
    navigate(`/metrics?publication=${publication.id}`);
  };

  return (
    <Card className="border-l-4 border-l-primary animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {firmName && (
                <Badge variant="outline" className="text-xs bg-accent/10">
                  <Building2 className="h-3 w-3 mr-1" />
                  {firmName}
                </Badge>
              )}
              {publication.platform && (
                <PlatformBadge platform={publication.platform} />
              )}
              {publication.source === "socialpulse" ? (
                <Badge variant="outline" className="text-xs border-primary/50 text-primary bg-primary/5">
                  <Sparkles className="h-3 w-3 mr-1" />
                  SocialPulse
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  <User className="h-3 w-3 mr-1" />
                  Créé par vous
                </Badge>
              )}
              <Badge variant={statusConfig.variant}>
                {statusConfig.label}
              </Badge>
              {(() => {
                const priority = (publication as any).priority || "routine";
                const pc = PRIORITY_CONFIG[priority];
                return (
                  <Badge variant="outline" className="text-xs">
                    <div className={`w-2 h-2 rounded-full mr-1 ${pc.color}`} />
                    {pc.label}
                  </Badge>
                );
              })()}
            </div>
            <CardTitle className="text-base">Publication programmée</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="flex-shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image */}
        {publication.image_url && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={publication.image_url}
              alt=""
              className="w-full h-48 object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {publication.content}
          </p>
        </div>

        {/* Schedule info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="h-4 w-4" />
            <span>{format(scheduledDate, "d MMMM yyyy", { locale: fr })}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{publication.scheduled_time.slice(0, 5)}</span>
          </div>
        </div>

        {/* Auto Validation Countdown */}
        {publication.status === "a_valider" && autoValidationInfo && publication.source === "socialpulse" && (
          <AutoValidationCountdown 
            info={autoValidationInfo}
            variant="banner"
          />
        )}

        {/* Performance estimée */}
        <div className="bg-muted/30 rounded-md p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Target className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Performance estimée</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {publication.platform === "linkedin" ? "Portée estimée : 500-2000 impressions" :
             publication.platform === "instagram" ? "Engagement estimé : 3-8%" :
             publication.platform === "facebook" ? "Portée estimée : 300-1500 impressions" :
             publication.platform === "blog" ? "SEO : trafic organique sous 2-4 semaines" :
             "Données insuffisantes pour estimer"}
          </p>
        </div>

        {/* Actions */}
        <div className="pt-2 border-t space-y-2">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onEdit} className="flex-1">
              <Edit className="h-4 w-4 mr-1.5" />
              Modifier
            </Button>
            {publication.status === "a_valider" && onValidate && (
              <Button onClick={onValidate} className="flex-1">
                <CheckCircle className="h-4 w-4 mr-1.5" />
                Valider
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {onReschedule && (
              <Button variant="secondary" onClick={onReschedule} className="flex-1">
                <CalendarClock className="h-4 w-4 mr-1.5" />
                Reprogrammer
              </Button>
            )}
            {onDelete && (
              <Button variant="destructive" onClick={onDelete} className="flex-1">
                <Trash2 className="h-4 w-4 mr-1.5" />
                Supprimer
              </Button>
            )}
          </div>
          {publication.status === "programme" && (
            <Button variant="secondary" onClick={handleViewMetrics} className="w-full">
              <BarChart3 className="h-4 w-4 mr-1.5" />
              Voir les métriques
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
