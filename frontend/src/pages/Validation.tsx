// ============================================================
// src/pages/Validation.tsx
// Rewired: post validation queue for CM review AND Lawyer approval.
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPosts, submitPost, approvePost, rejectPost, requestEdit, declinePost } from '@/services/postService';
import { useSimpleRole } from '@/hooks/useSimpleRole';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import type { PostDTO } from '@/types/post';
import { ClipboardCheck, CheckCircle, XCircle, MessageSquare, Send, Clock } from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon', PENDING_CM: 'En révision CM', PENDING_LAWYER: 'Attente avocat',
  APPROVED: 'Approuvé', REJECTED: 'Refusé', SCHEDULED: 'Programmé',
  PUBLISHED: 'Publié', ERROR: 'Erreur',
};

export default function Validation() {
  const { canValidateContent, canSubmitForValidation, isLawyer } = useSimpleRole();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [editComment, setEditComment] = useState<Record<string, string>>({});
  const [declineReason, setDeclineReason] = useState<Record<string, string>>({});

  const { data: page, isLoading } = useQuery({
    queryKey: ['posts', 'validation'],
    queryFn: () => getPosts(0, 50),
  });

  const posts = (page ?? []).filter(p =>
    isLawyer ? p.status === 'PENDING_LAWYER' : p.status !== 'PUBLISHED'
  );

  const invalidate = () => qc.invalidateQueries({ queryKey: ['posts'] });

  const mutApprove = useMutation({ mutationFn: approvePost, onSuccess: invalidate });
  const mutReject  = useMutation({ mutationFn: rejectPost,  onSuccess: invalidate });
  const mutSubmit  = useMutation({ mutationFn: submitPost,  onSuccess: invalidate });
  const mutEdit = useMutation({
    mutationFn: ({ id, comment }: { id: string; comment: string }) => requestEdit(id, comment),
    onSuccess: invalidate,
  });
  const mutDecline = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => declinePost(id, reason),
    onSuccess: invalidate,
  });

  const act = async (fn: () => Promise<unknown>, label: string) => {
    try { await fn(); toast({ title: `${label} effectué` }); }
    catch { toast({ variant: 'destructive', title: `Erreur lors de : ${label}` }); }
  };

  if (isLoading) return <PageSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ClipboardCheck className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">
          {canValidateContent ? 'Publications à valider' : 'Suivi des publications'}
        </h1>
      </div>

      {posts.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground">
          <CheckCircle className="h-10 w-10 mx-auto mb-3 text-sp-success" />
          Aucune publication en attente.
        </CardContent></Card>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              canValidate={canValidateContent}
              canSubmit={canSubmitForValidation}
              onApprove={() => act(() => mutApprove.mutateAsync(post.id), 'Approbation')}
              onReject={() => act(() => mutReject.mutateAsync(post.id), 'Refus')}
              onSubmit={() => act(() => mutSubmit.mutateAsync(post.id), 'Soumission')}
              editComment={editComment[post.id] ?? ''}
              onEditCommentChange={(v) => setEditComment((c) => ({ ...c, [post.id]: v }))}
              onRequestEdit={() =>
                act(
                  () => mutEdit.mutateAsync({ id: post.id, comment: editComment[post.id] ?? '' }),
                  'Demande de modification',
                )
              }
              declineReason={declineReason[post.id] ?? ''}
              onDeclineReasonChange={(v) => setDeclineReason((c) => ({ ...c, [post.id]: v }))}
              onDecline={() =>
                act(
                  () => mutDecline.mutateAsync({ id: post.id, reason: declineReason[post.id] ?? '' }),
                  'Renvoi au CM',
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PostCard({
  post,
  canValidate,
  canSubmit,
  onApprove,
  onReject,
  onSubmit,
  editComment,
  onEditCommentChange,
  onRequestEdit,
  declineReason,
  onDeclineReasonChange,
  onDecline,
}: {
  post: PostDTO;
  canValidate: boolean;
  canSubmit: boolean;
  onApprove: () => void;
  onReject: () => void;
  onSubmit: () => void;
  editComment: string;
  onEditCommentChange: (v: string) => void;
  onRequestEdit: () => void;
  declineReason: string;
  onDeclineReasonChange: (v: string) => void;
  onDecline: () => void;
}) {
  return (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-sm font-semibold line-clamp-2 flex-1">{post.content.slice(0, 120)}…</CardTitle>
          <Badge variant="outline" className="shrink-0">{STATUS_LABELS[post.status] ?? post.status}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          <Clock className="inline h-3 w-3 mr-1" />
          {new Date(post.createdAt).toLocaleDateString('fr-FR')}
          {' · '}{post.targetNetworks.join(', ')}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-foreground/80 line-clamp-3">{post.content}</p>

        {/* CM actions: submit to lawyer */}
        {canSubmit && (post.status === 'PENDING_CM' || post.status === 'DRAFT') && (
          <Button size="sm" onClick={onSubmit}>
            <Send className="h-4 w-4 mr-2" />Soumettre à l'avocat
          </Button>
        )}

        {canValidate && post.status === 'PENDING_LAWYER' && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={onApprove} className="bg-sp-success hover:bg-sp-success/90">
                <CheckCircle className="h-4 w-4 mr-1" />Valider
              </Button>
              <Button size="sm" variant="destructive" onClick={onReject}>
                <XCircle className="h-4 w-4 mr-1" />Refuser
              </Button>
            </div>
            <div className="space-y-1">
              <Textarea
                placeholder="Demander une modification (commentaire obligatoire)…"
                value={editComment}
                onChange={(e) => onEditCommentChange(e.target.value)}
                rows={2}
                className="text-sm"
              />
              <Button size="sm" variant="outline" onClick={onRequestEdit} disabled={!editComment.trim()}>
                <MessageSquare className="h-4 w-4 mr-1" />Demander modification
              </Button>
            </div>
            <div className="space-y-1 border-t border-border pt-3">
              <Textarea
                placeholder="Motif du renvoi vers le CM (obligatoire)…"
                value={declineReason}
                onChange={(e) => onDeclineReasonChange(e.target.value)}
                rows={2}
                className="text-sm"
              />
              <Button size="sm" variant="secondary" onClick={onDecline} disabled={!declineReason.trim()}>
                Renvoyer au CM
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PageSpinner() {
  return (
    <div className="flex justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
    </div>
  );
}
