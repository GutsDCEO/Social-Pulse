import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Building2, 
  ChevronRight, 
  ChevronLeft,
  Clock, 
  CalendarCheck, 
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowUpDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FirmStats } from "@/hooks/useCMWorkspace";
import { cn } from "@/lib/utils";

const FIRM_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-indigo-500",
  "bg-teal-500",
];

const ITEMS_PER_PAGE = 5;

type SortOption = 'name' | 'status' | 'pending';

interface CMFirmsListProps {
  firmStats: FirmStats[];
  selectedFirmId: string | null;
  onSelectFirm: (firmId: string) => void;
}

const STATUS_CONFIG = {
  ok: {
    icon: CheckCircle2,
    label: 'OK',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    priority: 3,
  },
  attention: {
    icon: AlertTriangle,
    label: 'Attention',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    textColor: 'text-amber-600',
    borderColor: 'border-amber-200 dark:border-amber-800',
    priority: 2,
  },
  blocked: {
    icon: XCircle,
    label: 'Bloqué',
    bgColor: 'bg-destructive/10',
    textColor: 'text-destructive',
    borderColor: 'border-destructive/30',
    priority: 1,
  },
};

export function CMFirmsList({ 
  firmStats, 
  selectedFirmId,
  onSelectFirm 
}: CMFirmsListProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('status');

  // Calculate counts for each status
  const statusCounts = useMemo(() => {
    const counts = { blocked: 0, attention: 0, ok: 0, totalPending: 0 };
    firmStats.forEach(fs => {
      counts[fs.status]++;
      counts.totalPending += fs.pending;
    });
    return counts;
  }, [firmStats]);

  // Sort firms based on selected option
  const sortedFirms = useMemo(() => {
    const sorted = [...firmStats];
    
    switch (sortBy) {
      case 'status':
        // Sort by status priority (blocked first, then attention, then ok)
        sorted.sort((a, b) => {
          const priorityDiff = STATUS_CONFIG[a.status].priority - STATUS_CONFIG[b.status].priority;
          if (priorityDiff !== 0) return priorityDiff;
          // Secondary sort by pending count
          return b.pending - a.pending;
        });
        break;
      case 'pending':
        // Sort by pending count (highest first)
        sorted.sort((a, b) => b.pending - a.pending);
        break;
      case 'name':
        // Sort alphabetically
        sorted.sort((a, b) => a.firm.name.localeCompare(b.firm.name));
        break;
    }
    
    return sorted;
  }, [firmStats, sortBy]);
  
  const totalPages = Math.ceil(sortedFirms.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const paginatedFirms = sortedFirms.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  const goToNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  const goToPrev = () => setCurrentPage(prev => Math.max(prev - 1, 0));

  // Reset to first page when sort changes
  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    setCurrentPage(0);
  };

  return (
    <Card className="bg-card border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Mes cabinets
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="h-7 w-auto min-w-[120px] text-xs gap-1">
                <ArrowUpDown className="h-3 w-3 shrink-0" />
                <span className="truncate">
                  {sortBy === 'status' ? 'Par urgence' : sortBy === 'pending' ? 'En attente' : 'Par nom'}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="status">
                  <div className="flex items-center gap-3">
                    <span>Par urgence</span>
                    {statusCounts.blocked > 0 && (
                      <Badge variant="destructive" className="h-4 px-1.5 text-[10px] ml-auto">
                        {statusCounts.blocked}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
                <SelectItem value="pending">
                  <div className="flex items-center gap-3">
                    <span>Par en attente</span>
                    {statusCounts.totalPending > 0 && (
                      <Badge className="h-4 px-1.5 text-[10px] bg-amber-500 ml-auto">
                        {statusCounts.totalPending}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
                <SelectItem value="name">Par nom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Status legend */}
        <div className="flex flex-wrap items-center gap-3 mt-2 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span>En attente</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Programmé</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
            <span>Brouillon</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {paginatedFirms.map((fs, index) => {
          const globalIndex = startIndex + index;
          const statusConfig = STATUS_CONFIG[fs.status];
          const StatusIcon = statusConfig.icon;
          const colorClass = FIRM_COLORS[globalIndex % FIRM_COLORS.length];
          const isSelected = fs.firm.id === selectedFirmId;
          
          return (
            <div
              key={fs.firm.id}
              className={cn(
                "p-3 rounded-lg border transition-all cursor-pointer hover:shadow-sm",
                isSelected 
                  ? "ring-2 ring-primary border-primary bg-primary/5" 
                  : "hover:border-primary/30"
              )}
              onClick={() => onSelectFirm(fs.firm.id)}
            >
              <div className="flex items-start gap-3">
                {/* Firm avatar */}
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", colorClass)}>
                  {fs.firm.logo_url ? (
                    <img 
                      src={fs.firm.logo_url} 
                      alt={fs.firm.name} 
                      className="w-8 h-8 rounded object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold text-sm">
                      {fs.firm.name.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                
                {/* Firm info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm truncate">{fs.firm.name}</h3>
                    {isSelected && (
                      <Badge variant="default" className="text-[10px] h-4 px-1.5">
                        Actif
                      </Badge>
                    )}
                  </div>
                  
                  {fs.firm.city && (
                    <p className="text-xs text-muted-foreground mb-2">{fs.firm.city}</p>
                  )}
                  
                  {/* Stats row */}
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 text-amber-600">
                      <Clock className="h-3 w-3" />
                      <span>{fs.pending}</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600">
                      <CalendarCheck className="h-3 w-3" />
                      <span>{fs.scheduled}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <FileText className="h-3 w-3" />
                      <span>{fs.drafts}</span>
                    </div>
                    {fs.refused > 0 && (
                      <div className="flex items-center gap-1 text-destructive">
                        <XCircle className="h-3 w-3" />
                        <span>{fs.refused}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Status badge */}
                <div className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-full text-xs",
                  statusConfig.bgColor,
                  statusConfig.textColor
                )}>
                  <StatusIcon className="h-3 w-3" />
                  <span className="hidden sm:inline">{statusConfig.label}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrev}
              disabled={currentPage === 0}
              className="h-7 px-2 text-xs"
            >
              <ChevronLeft className="h-3 w-3 mr-1" />
              Préc.
            </Button>
            <span className="text-xs text-muted-foreground">
              {currentPage + 1} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNext}
              disabled={currentPage === totalPages - 1}
              className="h-7 px-2 text-xs"
            >
              Suiv.
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t text-xs text-muted-foreground">
          <span>{sortedFirms.length} cabinet{sortedFirms.length > 1 ? 's' : ''}</span>
          <Link 
            to="/cm/firms" 
            className="flex items-center gap-1 hover:text-foreground transition-colors group"
          >
            <span>Gérer</span>
            <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
