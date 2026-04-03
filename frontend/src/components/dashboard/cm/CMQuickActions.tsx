import { Link } from "react-router-dom";
import { 
  Plus, 
  CalendarDays, 
  Sparkles, 
  MessageSquare,
  AlertTriangle,
  Library
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLawFirmContextSafe } from "@/contexts/LawFirmContext";

export function CMQuickActions() {
  const { selectedFirm } = useLawFirmContextSafe();

  return (
    <Card className="bg-white/50 dark:bg-card/50 backdrop-blur-sm border-white/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Actions rapides</CardTitle>
        {selectedFirm && (
          <p className="text-xs text-muted-foreground">
            Pour {selectedFirm.name}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        <Button asChild className="w-full justify-start" size="sm">
          <Link to="/editor">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle publication
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="w-full justify-start" size="sm">
          <Link to="/calendar">
            <CalendarDays className="mr-2 h-4 w-4" />
            Calendrier éditorial
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="w-full justify-start" size="sm">
          <Link to="/validation">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Publications à corriger
          </Link>
        </Button>
        
        <Button asChild variant="ghost" className="w-full justify-start" size="sm">
          <Link to="/cm/content">
            <Library className="mr-2 h-4 w-4" />
            Bibliothèque de contenus
          </Link>
        </Button>
        
        <Button asChild variant="ghost" className="w-full justify-start" size="sm">
          <Link to="/assistant">
            <MessageSquare className="mr-2 h-4 w-4" />
            Messagerie avocat
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
