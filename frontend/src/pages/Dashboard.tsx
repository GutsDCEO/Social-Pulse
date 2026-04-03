// ============================================================
// src/pages/Dashboard.tsx
// Role-based dashboard: Admin → operations overview,
// CM → publication workspace, Lawyer → validation queue.
// ============================================================

import { useSimpleRole } from '@/hooks/useSimpleRole';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '@/services/postService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle, AlertCircle, PlusCircle, Shield } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { isAdmin, isCommunityManager, isLawyer } = useSimpleRole();

  const { data: postsPage, isLoading } = useQuery({
    queryKey: ['posts', 'dashboard'],
    queryFn: () => getPosts(0, 10),
    enabled: !isAdmin,
  });

  const posts = postsPage?.data ?? [];
  const pending  = posts.filter(p => p.status === 'PENDING_LAWYER').length;
  const drafts   = posts.filter(p => p.status === 'DRAFT').length;
  const approved = posts.filter(p => p.status === 'APPROVED').length;

  if (isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tableau de bord Administration</h1>
          <p className="text-muted-foreground mt-1">Bienvenue, {user?.username} — vue globale SocialPulse.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Gestion des cabinets', href: '/admin/cabinets', icon: Shield, color: 'text-primary' },
            { label: 'Gestion des utilisateurs', href: '/admin/users', icon: FileText, color: 'text-sp-info' },
            { label: 'Publications', href: '/admin/publications', icon: CheckCircle, color: 'text-sp-success' },
          ].map(item => (
            <Card key={item.href} className="hover:shadow-elevated transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <Link to={item.href} className="flex flex-col gap-3">
                  <item.icon className={`h-8 w-8 ${item.color}`} />
                  <span className="font-semibold text-foreground">{item.label}</span>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isLawyer) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Espace Avocat</h1>
          <p className="text-muted-foreground mt-1">Publications en attente de validation.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={Clock} label="En attente" value={isLoading ? '…' : String(pending)} color="text-sp-warning" />
          <StatCard icon={CheckCircle} label="Approuvées" value={isLoading ? '…' : String(approved)} color="text-sp-success" />
          <StatCard icon={AlertCircle} label="Brouillons" value={isLoading ? '…' : String(drafts)} color="text-muted-foreground" />
        </div>
        <Button asChild>
          <Link to="/dashboard/validate">Voir les publications à valider</Link>
        </Button>
      </div>
    );
  }

  // CM (default)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Espace Community Manager</h1>
          <p className="text-muted-foreground mt-1">Gérez les publications de vos cabinets.</p>
        </div>
        <Button asChild>
          <Link to="/dashboard/editor">
            <PlusCircle className="h-4 w-4 mr-2" />
            Nouvelle publication
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={FileText} label="Brouillons" value={isLoading ? '…' : String(drafts)} color="text-muted-foreground" />
        <StatCard icon={Clock} label="En attente" value={isLoading ? '…' : String(pending)} color="text-sp-warning" />
        <StatCard icon={CheckCircle} label="Approuvées" value={isLoading ? '…' : String(approved)} color="text-sp-success" />
      </div>
      <Button variant="outline" asChild>
        <Link to="/dashboard/validate">Mes publications</Link>
      </Button>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: string; color: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${color}`}>{value}</div>
      </CardContent>
    </Card>
  );
}
