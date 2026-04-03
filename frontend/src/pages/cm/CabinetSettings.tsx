// src/pages/cm/CabinetSettings.tsx — CM cabinet settings
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCabinet, updateCabinet } from '@/services/cabinetService';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Loader2 } from 'lucide-react';

export default function CabinetSettings() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: cabinet, isLoading } = useQuery({
    queryKey: ['cabinets', id],
    queryFn: () => getCabinet(id!),
    enabled: !!id,
  });

  const [name, setName]    = useState('');
  const [email, setEmail]  = useState('');
  const [phone, setPhone]  = useState('');
  const [city, setCity]    = useState('');

  useEffect(() => {
    if (cabinet) { setName(cabinet.name); setEmail(cabinet.email ?? ''); setPhone(cabinet.phone ?? ''); setCity(cabinet.city ?? ''); }
  }, [cabinet]);

  const mut = useMutation({
    mutationFn: () => updateCabinet(id!, { name, email, phone, city, pack: cabinet!.pack, status: cabinet!.status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cabinets'] }); toast({ title: 'Cabinet mis à jour' }); },
    onError: () => toast({ variant: 'destructive', title: 'Erreur lors de la mise à jour' }),
  });

  if (isLoading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" /></div>;
  if (!cabinet) return <p className="text-muted-foreground p-6">Cabinet introuvable.</p>;

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">{cabinet.name}</h1>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Informations du cabinet</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { id: 'cab-name', label: 'Nom', value: name, set: setName },
            { id: 'cab-email', label: 'Email', value: email, set: setEmail },
            { id: 'cab-phone', label: 'Téléphone', value: phone, set: setPhone },
            { id: 'cab-city', label: 'Ville', value: city, set: setCity },
          ].map(f => (
            <div key={f.id} className="space-y-1">
              <Label htmlFor={f.id}>{f.label}</Label>
              <Input id={f.id} value={f.value} onChange={e => f.set(e.target.value)} disabled={mut.isPending} />
            </div>
          ))}
          <Button className="w-full" onClick={() => mut.mutate()} disabled={mut.isPending}>
            {mut.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Enregistrer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
