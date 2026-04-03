// src/pages/admin/AdminDashboard.tsx — Admin operations overview
import { useQuery } from '@tanstack/react-query';
import { getCabinets } from '@/services/cabinetService';
import { getUsers } from '@/services/userService';
import { getPosts } from '@/services/postService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Building2, Users, FileText, ShieldCheck } from 'lucide-react';

export default function AdminDashboard() {
  const { data: cabinets = [] } = useQuery({ queryKey: ['cabinets'], queryFn: getCabinets });
  const { data: users = [] }    = useQuery({ queryKey: ['users'],    queryFn: getUsers });
  const { data: postsPage }     = useQuery({ queryKey: ['posts', 'admin'], queryFn: () => getPosts(0, 1) });

  const stats = [
    { label: 'Cabinets', value: cabinets.length, icon: Building2, href: '/admin/cabinets', color: 'text-primary' },
    { label: 'Utilisateurs', value: users.length, icon: Users, href: '/admin/users', color: 'text-sp-info' },
    { label: 'Publications', value: postsPage?.totalElements ?? '—', icon: FileText, href: '/admin/publications', color: 'text-sp-success' },
    { label: 'Conformité', value: '100 %', icon: ShieldCheck, href: '/admin/compliance', color: 'text-sp-warning' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Administration SocialPulse</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(s => (
          <Card key={s.label} className="hover:shadow-elevated transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <Button asChild variant="link" size="sm" className="px-0 mt-1">
                <Link to={s.href}>Gérer →</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
