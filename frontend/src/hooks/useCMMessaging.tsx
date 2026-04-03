import { useCallback, useState } from 'react';

/** CM support messaging — local stub (no Supabase). UI renders empty state. */
export type ConversationStatus = 'nouveau' | 'en_cours' | 'resolu' | 'archive';
export type RequestType =
  | 'content_post'
  | 'editorial_planning'
  | 'performance'
  | 'firm_settings'
  | 'general_question';
export type Urgency = 'low' | 'normal' | 'high' | 'critical';
export type ExpectedAction = 'information' | 'callback' | 'escalation' | 'documentation';

export interface CMConversation {
  id: string;
  lawyer_name?: string | null;
  law_firm_name?: string | null;
  source: 'email' | 'chat';
  status: ConversationStatus;
  subject: string;
  created_at: string;
  request_type: RequestType;
  urgency: Urgency;
  expected_action: ExpectedAction;
  unread_count?: number;
  last_message_preview?: string | null;
}

export interface CMMessage {
  id: string;
  sender: 'user' | 'cm' | 'ai';
  content: string;
  created_at: string;
}

type StatusConfig = { label: string; bgColor: string; color: string };

export const STATUS_CONFIG: Record<ConversationStatus, StatusConfig> = {
  nouveau: { label: 'Nouveau', bgColor: 'bg-blue-100', color: 'text-blue-800' },
  en_cours: { label: 'En cours', bgColor: 'bg-amber-100', color: 'text-amber-800' },
  resolu: { label: 'Résolu', bgColor: 'bg-emerald-100', color: 'text-emerald-800' },
  archive: { label: 'Archivé', bgColor: 'bg-muted', color: 'text-muted-foreground' },
};

export const REQUEST_TYPE_CONFIG: Record<RequestType, { label: string }> = {
  content_post: { label: 'Publication' },
  editorial_planning: { label: 'Planning éditorial' },
  performance: { label: 'Performance' },
  firm_settings: { label: 'Paramètres cabinet' },
  general_question: { label: 'Question générale' },
};

export const URGENCY_CONFIG: Record<Urgency, { label: string; color: string }> = {
  low: { label: 'Basse', color: 'text-muted-foreground' },
  normal: { label: 'Normale', color: 'text-foreground' },
  high: { label: 'Élevée', color: 'text-amber-600' },
  critical: { label: 'Critique', color: 'text-red-600' },
};

export const EXPECTED_ACTION_CONFIG: Record<ExpectedAction, { label: string }> = {
  information: { label: 'Information' },
  callback: { label: 'Rappel' },
  escalation: { label: 'Escalade' },
  documentation: { label: 'Documentation' },
};

export function useCMMessaging() {
  const [conversations] = useState<CMConversation[]>([]);
  const [messages] = useState<CMMessage[]>([]);
  const [activeConversation, setActiveConversation] = useState<CMConversation | null>(null);
  const [loading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<{
    suggestedResponse?: string;
    summary?: string;
    recommendedActions?: string[];
  } | null>(null);
  const [statusFilter, setStatusFilter] = useState<ConversationStatus | 'all'>('all');
  const [requestTypeFilter, setRequestTypeFilter] = useState<RequestType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const selectConversation = useCallback((c: CMConversation) => {
    setActiveConversation(c);
  }, []);

  const sendMessage = useCallback(async (_text: string, _channel: 'chat' | 'email') => false, []);

  const updateStatus = useCallback(async (_status: ConversationStatus) => {}, []);

  const updateQualification = useCallback(
    async (_rt: RequestType, _u: Urgency, _e: ExpectedAction) => {},
    [],
  );

  const getAIAssistance = useCallback(async () => {
    setAiLoading(true);
    setAiLoading(false);
  }, []);

  const applyAISuggestions = useCallback(async () => {}, []);

  return {
    conversations,
    messages,
    activeConversation,
    loading,
    aiLoading,
    aiResponse,
    statusFilter,
    requestTypeFilter,
    searchQuery,
    setStatusFilter,
    setRequestTypeFilter,
    setSearchQuery,
    selectConversation,
    sendMessage,
    updateStatus,
    updateQualification,
    getAIAssistance,
    applyAISuggestions,
    setAiResponse,
  };
}
