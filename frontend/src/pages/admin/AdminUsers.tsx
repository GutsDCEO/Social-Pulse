// src/pages/admin/AdminUsers.tsx — User management (REST + cabinet assign)
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, deleteUser } from '@/services/userService';
import { getCabinets, assignUserToCabinet } from '@/services/cabinetService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Loader2, Trash2 } from 'lucide-react';
import type { CreateUserRole } from '@/types/user';

const ROLES: { value: CreateUserRole; label: string }[] = [
  { value: 'CM', label: 'Community Manager' },
  { value: 'AVOCAT', label: 'Avocat' },
];

const ROLE_BADGE: Record<string, string> = {
  ADMIN: 'bg-primary/10 text-primary',
  CM: 'bg-sp-info/10 text-sp-info',
  AVOCAT: 'bg-sp-success/10 text-sp-success',
};

export default function AdminUsers() {
  const { data: users = [], isLoading } = useQuery({ queryKey: ['users'], queryFn: getUsers });
  const {
    data: cabinets = [],
    error: cabinetsError,
    isError: isCabinetsError,
  } = useQuery({ queryKey: ['cabinets'], queryFn: getCabinets });
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    role: 'CM' as CreateUserRole,
    cabinetId: '',
  });

  const mutCreate = useMutation({
    mutationFn: async () => {
      const { cabinetId, ...payload } = form;
      const created = await createUser(payload);
      await assignUserToCabinet(cabinetId, { userId: created.id, role: payload.role });
      return created;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'Utilisateur créé et assigné au cabinet' });
      setOpen(false);
    },
    onError: () => toast({ variant: 'destructive', title: 'Erreur création ou assignation' }),
  });

  const mutDelete = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'Utilisateur supprimé' });
    },
    onError: () => toast({ variant: 'destructive', title: 'Erreur suppression' }),
  });

  const field = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const canCreate =
    form.fullName && form.username && form.email && form.password && form.cabinetId;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un utilisateur</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              {(
                [
                  { id: 'usr-fullname', label: 'Nom complet *', key: 'fullName' as const, type: 'text' },
                  { id: 'usr-username', label: "Nom d'utilisateur *", key: 'username' as const, type: 'text' },
                  { id: 'usr-email', label: 'Email *', key: 'email' as const, type: 'email' },
                  { id: 'usr-password', label: 'Mot de passe *', key: 'password' as const, type: 'password' },
                ] as const
              ).map((f) => (
                <div key={f.id} className="space-y-1">
                  <Label htmlFor={f.id}>{f.label}</Label>
                  <Input
                    id={f.id}
                    type={f.type}
                    value={form[f.key]}
                    onChange={field(f.key)}
                    disabled={mutCreate.isPending}
                    autoComplete="off"
                  />
                </div>
              ))}
              <div className="space-y-1">
                <Label>Rôle dans le cabinet *</Label>
                <Select
                  value={form.role}
                  onValueChange={(v) => setForm((f) => ({ ...f, role: v as CreateUserRole }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Cabinet *</Label>
                <Select value={form.cabinetId} onValueChange={(v) => setForm((f) => ({ ...f, cabinetId: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un cabinet" />
                  </SelectTrigger>
                  <SelectContent>
                    {cabinets.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isCabinetsError ? (
                  <p className="text-xs text-destructive mt-1">
                    {(() => {
                      const e = cabinetsError as { response?: { status?: number; data?: { message?: string } } };
                      if (e?.response?.data?.message) return e.response.data.message;
                      if (e?.response?.status) return `Échec API (${e.response.status}) sur GET /api/v1/cabinets`;
                      return 'Chargement des cabinets échoué (GET /api/v1/cabinets).';
                    })()}
                  </p>
                ) : null}
              </div>
              <p className="text-xs text-muted-foreground">
                Les comptes administrateur plateforme ne se créent pas ici (indicateur is_admin côté serveur).
              </p>
              <Button className="w-full" onClick={() => mutCreate.mutate()} disabled={!canCreate || mutCreate.isPending}>
                {mutCreate.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Créer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="rounded-md border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {['Nom', 'Identifiant', 'Statut', 'Rôles cabinet', ''].map((h, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => {
                const cabinetCount = Object.keys(u.cabinetRoles).length;
                const roleEntries = Object.entries(u.cabinetRoles);
                return (
                  <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">
                      {u.fullName}
                      {u.isAdmin ? (
                        <Badge className="ml-2 text-[10px] bg-primary/15 text-primary">Super admin</Badge>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{u.username}</td>
                    <td className="px-4 py-3">
                      <Badge
                        className={`text-xs ${u.isActive ? 'bg-sp-success/10 text-sp-success' : 'bg-muted text-muted-foreground'}`}
                      >
                        {u.isActive ? 'Actif' : 'Inactif'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                     <td className="px-4 py-3 text-muted-foreground text-xs">
                      {cabinetCount === 0 ? (
                        '—'
                      ) : (
                        <div className="flex flex-wrap items-center gap-1.5">
                          {Array.from(new Set(Object.values(u.cabinetRoles))).map((role) => (
                            <Badge key={role} variant="outline" className={`text-[10px] uppercase font-bold tracking-tighter ${ROLE_BADGE[role] ?? ''}`}>
                              {role}
                            </Badge>
                          ))}
                          {cabinetCount > 1 && (
                            <span className="text-[10px] font-medium text-muted-foreground/80 lowercase">
                              ({cabinetCount} cabinets)
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          if (confirm('Supprimer cet utilisateur ?')) mutDelete.mutate(u.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
    </div>
  );
}
