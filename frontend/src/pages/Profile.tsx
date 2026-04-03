// src/pages/Profile.tsx — User profile
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const initials = (user?.username ?? 'U').slice(0, 2).toUpperCase();

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <User className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Mon profil</h1>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user?.username}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {user?.isAdmin ? 'Administrateur' : 'Utilisateur SocialPulse'}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Identifiant</dt>
              <dd className="font-medium">{user?.username}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Cabinet actif</dt>
              <dd className="font-medium">{user?.activeCabinetId ?? '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Rôle</dt>
              <dd className="font-medium">{user?.isAdmin ? 'Admin' : 'Utilisateur'}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
