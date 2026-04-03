// src/pages/admin/AdminPublications.tsx — All publications
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '@/services/postService';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

const STATUS_LABEL: Record<string, string> = {
  DRAFT: 'Brouillon', PENDING_CM: 'En révision', PENDING_LAWYER: 'Att. avocat',
  APPROVED: 'Approuvé', REJECTED: 'Refusé', SCHEDULED: 'Planifié', PUBLISHED: 'Publié', ERROR: 'Erreur',
};
const STATUS_COLOR: Record<string, string> = {
  DRAFT: 'bg-muted text-muted-foreground', PENDING_LAWYER: 'bg-sp-warning/10 text-sp-warning',
  APPROVED: 'bg-sp-success/10 text-sp-success', PUBLISHED: 'bg-primary/10 text-primary',
  REJECTED: 'bg-destructive/10 text-destructive',
};

export default function AdminPublications() {
  const { data: page, isLoading } = useQuery({ queryKey: ['posts', 'admin-all'], queryFn: () => getPosts(0, 100) });
  const posts = page?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Publications</h1>
        <Badge variant="outline">{page?.totalElements ?? 0} total</Badge>
      </div>
      {isLoading ? <Spinner /> : (
        <div className="rounded-md border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>{['Contenu', 'Réseaux', 'Statut', 'Date'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map(p => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 max-w-xs truncate font-medium">{p.content.slice(0, 80)}</td>
                  <td className="px-4 py-3"><div className="flex gap-1">{p.targetNetworks.map(n => <Badge key={n} variant="outline" className="text-[10px]">{n}</Badge>)}</div></td>
                  <td className="px-4 py-3"><Badge className={`text-xs ${STATUS_COLOR[p.status] ?? 'bg-muted text-muted-foreground'}`}>{STATUS_LABEL[p.status] ?? p.status}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(p.createdAt).toLocaleDateString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Spinner() { return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" /></div>; }
