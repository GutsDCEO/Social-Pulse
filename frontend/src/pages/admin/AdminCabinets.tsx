// src/pages/admin/AdminCabinets.tsx — Global cabinet management
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCabinets, createCabinet } from '@/services/cabinetService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Building2, Plus, Loader2 } from 'lucide-react';
import type { PackType, CabinetStatus } from '@/types/cabinet';

const STATUS_BADGE: Record<string, string> = {
  ACTIF: 'bg-sp-success/10 text-sp-success',
  INACTIF: 'bg-muted text-muted-foreground',
  EN_TEST: 'bg-sp-warning/10 text-sp-warning',
};

export default function AdminCabinets() {
  const {
    data: cabinets = [],
    isLoading,
    isError,
    error,
  } = useQuery({ queryKey: ['cabinets'], queryFn: getCabinets });
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', barreau: '', email: '', pack: 'ESSENTIEL' as PackType, status: 'EN_TEST' as CabinetStatus });

  const mut = useMutation({
    mutationFn: () => createCabinet({ ...form }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cabinets'] });
      toast({ title: 'Cabinet créé' });
      setOpen(false);
    },
    onError: (err: unknown) => {
      const status = (err as { response?: { status?: number } })?.response?.status;
      const responseMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast({
        variant: 'destructive',
        title: 'Erreur création cabinet',
        description:
          responseMessage ??
          (status ? `Échec API (${status}). Vérifiez backend + droits SUPER_ADMIN.` : 'Erreur réseau/API.'),
      });
    },
  });

  const field = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Gestion des cabinets</h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Nouveau cabinet</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Créer un cabinet</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              {[
                { id: 'adm-cab-name', label: 'Nom *', key: 'name' as const },
                { id: 'adm-cab-barreau', label: 'Barreau *', key: 'barreau' as const },
                { id: 'adm-cab-email', label: 'Email', key: 'email' as const },
              ].map(f => (
                <div key={f.id} className="space-y-1">
                  <Label htmlFor={f.id}>{f.label}</Label>
                  <Input id={f.id} value={form[f.key]} onChange={field(f.key)} disabled={mut.isPending} />
                </div>
              ))}
              <Button className="w-full" onClick={() => mut.mutate()} disabled={!form.name || !form.barreau || mut.isPending}>
                {mut.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Créer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? <Spinner /> : isError ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Impossible de charger les cabinets</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {(() => {
              const e = error as { response?: { status?: number; data?: { message?: string } } };
              if (e?.response?.data?.message) return e.response.data.message;
              if (e?.response?.status) return `Échec API (${e.response.status}) sur GET /api/v1/cabinets`;
              return 'La requête GET /api/v1/cabinets a échoué. Vérifiez backend + droits.';
            })()}
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>{['Nom', 'Barreau', 'Ville', 'Pack', 'Statut'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cabinets.map(c => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.barreau}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.city ?? '—'}</td>
                  <td className="px-4 py-3"><Badge variant="outline">{c.pack}</Badge></td>
                  <td className="px-4 py-3"><Badge className={`text-xs ${STATUS_BADGE[c.status] ?? ''}`}>{c.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" /></div>;
}
