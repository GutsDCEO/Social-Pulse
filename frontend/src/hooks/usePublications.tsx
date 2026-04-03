// ============================================================
// Lovable-compatible publication types + REST-backed hook (postService).
// ============================================================

import { useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useLawFirmContextSafe } from '@/contexts/LawFirmContext';
import { toast } from '@/hooks/use-toast';
import { getPosts, createPost, updatePost } from '@/services/postService';
import type { PostDTO, PostStatus, SocialNetwork, CreatePostRequest } from '@/types/post';

export type PublicationStatus = 'brouillon' | 'a_valider' | 'programme' | 'publie' | 'refuse';
export type PublicationSource = 'manual' | 'socialpulse';
export type SocialPlatform =
  | 'linkedin'
  | 'instagram'
  | 'facebook'
  | 'twitter'
  | 'blog'
  | 'google_business';
export type ValidationExtendedStatus =
  | 'draft'
  | 'cm_review'
  | 'submitted_to_lawyer'
  | 'in_lawyer_review'
  | 'validated'
  | 'refused'
  | 'modified_by_lawyer'
  | 'expired'
  | 'published';
export type UrgencyLevel = 'normal' | 'urgent';
export type ExpirationBehavior = 'do_not_publish' | 'save_as_draft' | 'auto_publish';

export interface Publication {
  id: string;
  user_id: string;
  law_firm_id: string | null;
  title: string | null;
  content: string;
  image_url: string | null;
  scheduled_date: string;
  scheduled_time: string;
  status: PublicationStatus;
  source: PublicationSource;
  platform: SocialPlatform | null;
  parent_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  rejection_reason: string | null;
  rejected_at: string | null;
  priority?: 'routine' | 'important' | 'strategique' | null;
  validation_status?: ValidationExtendedStatus | null;
  submitted_at?: string | null;
  expires_at?: string | null;
  urgency?: UrgencyLevel | null;
  modification_request_comment?: string | null;
  last_reminder_sent_at?: string | null;
  reminder_count?: number | null;
}

export interface CreatePublicationData {
  title?: string | null;
  content: string;
  image_url?: string | null;
  scheduled_date: string;
  scheduled_time: string;
  status: PublicationStatus;
  source?: PublicationSource;
  platform?: SocialPlatform | null;
  parent_id?: string | null;
  published_at?: string | null;
  law_firm_id?: string | null;
}

export interface UpdatePublicationData extends Partial<CreatePublicationData> {
  id: string;
}

export interface UsePublicationsOptions {
  lawFirmIdOverride?: string | null;
  showAllFirms?: boolean;
  limit?: number;
  enabled?: boolean;
}

function mapApiStatus(s: PostStatus): PublicationStatus {
  switch (s) {
    case 'DRAFT':
      return 'brouillon';
    case 'PENDING_CM':
    case 'PENDING_LAWYER':
      return 'a_valider';
    case 'SCHEDULED':
    case 'APPROVED':
      return 'programme';
    case 'PUBLISHED':
      return 'publie';
    case 'REJECTED':
    case 'ERROR':
      return 'refuse';
    default:
      return 'brouillon';
  }
}

function mapToApiStatus(s: PublicationStatus): PostStatus {
  switch (s) {
    case 'brouillon':
      return 'DRAFT';
    case 'a_valider':
      return 'PENDING_CM';
    case 'programme':
      return 'SCHEDULED';
    case 'publie':
      return 'PUBLISHED';
    case 'refuse':
      return 'REJECTED';
    default:
      return 'DRAFT';
  }
}

function mapNetwork(n?: SocialNetwork | null): SocialPlatform | null {
  if (!n) return null;
  const m: Record<SocialNetwork, SocialPlatform> = {
    LINKEDIN: 'linkedin',
    INSTAGRAM: 'instagram',
    FACEBOOK: 'facebook',
    TWITTER: 'twitter',
    GOOGLE_BUSINESS: 'google_business',
  };
  return m[n] ?? 'linkedin';
}

function mapPlatformToNetworks(p: SocialPlatform | null | undefined): SocialNetwork[] {
  if (!p || p === 'blog') return ['LINKEDIN'];
  const rev: Record<SocialPlatform, SocialNetwork> = {
    linkedin: 'LINKEDIN',
    instagram: 'INSTAGRAM',
    facebook: 'FACEBOOK',
    twitter: 'TWITTER',
    google_business: 'GOOGLE_BUSINESS',
    blog: 'LINKEDIN',
  };
  return [rev[p]];
}

function postToPublication(p: PostDTO): Publication {
  const sched = p.scheduledAt ? new Date(p.scheduledAt) : new Date(p.createdAt);
  return {
    id: p.id,
    user_id: p.createdBy,
    law_firm_id: p.cabinetId,
    title: null,
    content: p.content,
    image_url: null,
    scheduled_date: sched.toISOString().slice(0, 10),
    scheduled_time: sched.toTimeString().slice(0, 5),
    status: mapApiStatus(p.status),
    source: 'manual',
    platform: mapNetwork(p.targetNetworks[0]),
    parent_id: null,
    published_at: p.publishedAt,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
    rejection_reason: null,
    rejected_at: null,
  };
}

export function usePublications(options?: UsePublicationsOptions) {
  const { lawFirmIdOverride, showAllFirms = false, limit = 50, enabled = true } = options ?? {};
  const { user } = useAuth();
  const { isCommunityManager } = useUserRole();
  const { selectedFirmId, assignedFirms } = useLawFirmContextSafe();
  const queryClient = useQueryClient();

  const allFirmIds = useMemo(() => assignedFirms.map((f) => f.id), [assignedFirms]);
  const effectiveFirmId =
    lawFirmIdOverride !== undefined
      ? lawFirmIdOverride
      : isCommunityManager && !showAllFirms
        ? selectedFirmId
        : null;

  const queryKey = useMemo(
    () => ['publications', user?.id, effectiveFirmId, showAllFirms ? allFirmIds : null, limit],
    [user?.id, effectiveFirmId, showAllFirms, allFirmIds, limit],
  );

  const { data: publications = [], isLoading: loading, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!user) return [];
      const page = await getPosts(0, limit);
      let list = page.data.map(postToPublication);
      if (isCommunityManager && showAllFirms && allFirmIds.length > 0) {
        const allow = new Set(allFirmIds);
        list = list.filter((pub) => pub.law_firm_id && allow.has(pub.law_firm_id));
      } else if (effectiveFirmId) {
        list = list.filter((pub) => pub.law_firm_id === effectiveFirmId);
      }
      return list;
    },
    enabled: enabled && !!user,
    staleTime: 2 * 60 * 1000,
  });

  const createPublication = useCallback(
    async (data: CreatePublicationData) => {
      if (!user) return null;
      const firmIdToUse = data.law_firm_id ?? (isCommunityManager ? selectedFirmId : null);
      if (!firmIdToUse) {
        toast({ title: 'Cabinet requis', variant: 'destructive' });
        return null;
      }
      const scheduledAt = new Date(`${data.scheduled_date}T${data.scheduled_time}:00`).toISOString();
      const body: CreatePostRequest = {
        content: data.content,
        targetNetworks: mapPlatformToNetworks(data.platform),
        scheduledAt,
        status: mapToApiStatus(data.status),
      };
      try {
        const created = await createPost(body);
        await queryClient.invalidateQueries({ queryKey: ['publications'] });
        toast({ title: 'Publication créée' });
        return postToPublication(created);
      } catch {
        toast({ title: 'Erreur', description: 'Création impossible', variant: 'destructive' });
        return null;
      }
    },
    [user, isCommunityManager, selectedFirmId, queryClient],
  );

  const updatePublication = useCallback(
    async (data: UpdatePublicationData) => {
      const { id, ...rest } = data;
      try {
        const partial = {} as Record<string, unknown>;
        if (rest.content !== undefined) partial.content = rest.content;
        if (rest.scheduled_date && rest.scheduled_time) {
          partial.scheduledAt = new Date(`${rest.scheduled_date}T${rest.scheduled_time}:00`).toISOString();
        }
        if (rest.status !== undefined) partial.status = mapToApiStatus(rest.status);
        if (rest.platform !== undefined) partial.targetNetworks = mapPlatformToNetworks(rest.platform);
        await updatePost(id, partial as Partial<CreatePostRequest>);
        await queryClient.invalidateQueries({ queryKey: ['publications'] });
        toast({ title: 'Publication mise à jour' });
        return true;
      } catch {
        toast({ title: 'Erreur', variant: 'destructive' });
        return false;
      }
    },
    [queryClient],
  );

  const deletePublication = useCallback(async (_id: string) => {
    toast({ title: 'Suppression', description: 'Non disponible via API pour le moment.', variant: 'destructive' });
    return false;
  }, []);

  return {
    publications,
    loading,
    createPublication,
    updatePublication,
    deletePublication,
    refetch,
  };
}
