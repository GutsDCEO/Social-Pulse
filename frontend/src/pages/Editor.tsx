// ============================================================
// src/pages/Editor.tsx
// Rewired: create/edit posts via REST API.
// ============================================================

import { useState, type ElementType } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '@/services/postService';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import type { SocialNetwork } from '@/types/post';
import { Loader2, Send, Save } from 'lucide-react';
import { Linkedin, Instagram, Facebook, Twitter } from '@/lib/brand-icons';

const NETWORKS: { id: SocialNetwork; label: string; Icon: ElementType; color: string }[] = [
  { id: 'LINKEDIN',  label: 'LinkedIn',  Icon: Linkedin,  color: 'text-[#0077B5]' },
  { id: 'FACEBOOK',  label: 'Facebook',  Icon: Facebook,  color: 'text-[#1877F2]' },
  { id: 'INSTAGRAM', label: 'Instagram', Icon: Instagram, color: 'text-[#E1306C]' },
  { id: 'TWITTER',   label: 'Twitter',   Icon: Twitter,   color: 'text-[#1DA1F2]' },
];

const MAX_CONTENT = 3000;

export default function Editor() {
  const [content, setContent] = useState('');
  const [networks, setNetworks] = useState<SocialNetwork[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const qc = useQueryClient();

  const toggleNetwork = (id: SocialNetwork) =>
    setNetworks(prev => prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]);

  const mutSave = useMutation({
    mutationFn: () => createPost({ content, targetNetworks: networks, status: 'DRAFT' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['posts'] });
      toast({ title: 'Brouillon sauvegardé' });
      navigate('/dashboard/validate');
    },
    onError: () => toast({ variant: 'destructive', title: 'Erreur lors de la sauvegarde' }),
  });

  const mutSubmit = useMutation({
    mutationFn: () => createPost({ content, targetNetworks: networks, status: 'PENDING_CM' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['posts'] });
      toast({ title: 'Publication soumise pour validation' });
      navigate('/dashboard/validate');
    },
    onError: () => toast({ variant: 'destructive', title: 'Erreur lors de la soumission' }),
  });

  const isWorking = mutSave.isPending || mutSubmit.isPending;
  const canSubmit = content.trim().length > 0 && networks.length > 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Nouvelle publication</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Réseaux cibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {NETWORKS.map(({ id, label, Icon, color }) => (
              <label key={id} className="flex items-center gap-2 cursor-pointer select-none">
                <Checkbox
                  id={`net-${id}`}
                  checked={networks.includes(id)}
                  onCheckedChange={() => toggleNetwork(id)}
                  disabled={isWorking}
                />
                <Icon className={`h-4 w-4 ${color}`} />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
          {networks.length > 0 && (
            <div className="flex gap-1 mt-3 flex-wrap">
              {networks.map(n => (
                <Badge key={n} variant="secondary" className="text-xs">{n}</Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Contenu</CardTitle>
            <span className={`text-xs ${content.length > MAX_CONTENT * 0.9 ? 'text-sp-warning' : 'text-muted-foreground'}`}>
              {content.length}/{MAX_CONTENT}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <Label htmlFor="post-content" className="sr-only">Contenu de la publication</Label>
          <Textarea
            id="post-content"
            placeholder="Rédigez votre publication…"
            value={content}
            onChange={e => setContent(e.target.value.slice(0, MAX_CONTENT))}
            rows={10}
            disabled={isWorking}
            className="resize-none"
          />
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button
          variant="outline"
          onClick={() => mutSave.mutate()}
          disabled={!content.trim() || isWorking}
        >
          {mutSave.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Enregistrer brouillon
        </Button>
        <Button
          onClick={() => mutSubmit.mutate()}
          disabled={!canSubmit || isWorking}
        >
          {mutSubmit.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
          Soumettre
        </Button>
      </div>
    </div>
  );
}
