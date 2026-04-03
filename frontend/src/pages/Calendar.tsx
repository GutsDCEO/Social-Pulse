// src/pages/Calendar.tsx — Editorial calendar (REST-wired)
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '@/services/postService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalIcon } from 'lucide-react';

const STATUS_COLOR: Record<string, string> = {
  DRAFT: 'bg-status-draft text-status-draft-foreground',
  PENDING_CM: 'bg-status-pending text-status-pending-foreground',
  PENDING_LAWYER: 'bg-status-pending text-status-pending-foreground',
  APPROVED: 'bg-status-scheduled text-status-scheduled-foreground',
  SCHEDULED: 'bg-status-scheduled text-status-scheduled-foreground',
  PUBLISHED: 'bg-status-published text-status-published-foreground',
};

export default function Calendar() {
  const { data: page, isLoading } = useQuery({
    queryKey: ['posts', 'calendar'],
    queryFn: () => getPosts(0, 100),
  });
  const posts = page?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CalIcon className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Calendrier éditorial</h1>
      </div>
      {isLoading ? (
        <Spinner />
      ) : posts.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground">Aucune publication planifiée.</CardContent></Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map(p => (
            <Card key={p.id} className="border border-border hover:shadow-card transition-shadow">
              <CardContent className="pt-4 space-y-2">
                <p className="text-sm font-medium line-clamp-2">{p.content.slice(0, 100)}</p>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">
                    {p.scheduledAt ? new Date(p.scheduledAt).toLocaleDateString('fr-FR') : '—'}
                  </span>
                  <Badge className={`text-[10px] ${STATUS_COLOR[p.status] ?? ''}`}>{p.status}</Badge>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {p.targetNetworks.map(n => <Badge key={n} variant="outline" className="text-[10px]">{n}</Badge>)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" /></div>;
}
