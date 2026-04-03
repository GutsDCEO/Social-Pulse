/** Trend UI types (mock / REST futur). */
export type TrendEvolution = 'rising' | 'stable' | 'falling';
export type TrendRelevance = 'pertinent' | 'watch' | 'neutral';
export type TrendAttentionLevel = 'high' | 'medium' | 'low';

export interface TrendTopic {
  id: string;
  title: string;
  category: string;
  intensity: number;
  evolution: TrendEvolution;
  relevance: TrendRelevance;
  region?: string;
  /** Optional multi-region copy when wired to API */
  regions?: string[];
  platforms?: string[];
  whyTrending?: string;
  editorialRecommendation?: string;
  attentionLevel: TrendAttentionLevel;
  peakRegion?: string;
  description?: string;
}

export function getRelevanceInfo(relevance: TrendRelevance): {
  label: string;
  color: string;
  description: string;
} {
  switch (relevance) {
    case 'pertinent':
      return {
        label: 'Pertinent',
        color: 'text-emerald-600',
        description: 'Ce sujet correspond fortement à votre domaine et à votre audience.',
      };
    case 'watch':
      return {
        label: 'À surveiller',
        color: 'text-amber-600',
        description: 'Sujet en progression : utile pour anticiper sans forcément publier immédiatement.',
      };
    default:
      return {
        label: 'Neutre',
        color: 'text-muted-foreground',
        description: 'Pertinence modérée pour votre pratique actuelle.',
      };
  }
}

export function getAttentionLabel(level: TrendAttentionLevel): string {
  switch (level) {
    case 'high':
      return 'Forte attention';
    case 'medium':
      return 'Attention modérée';
    default:
      return 'Faible attention';
  }
}

export function getEvolutionLabel(evolution: TrendEvolution): string {
  switch (evolution) {
    case 'rising':
      return 'En hausse';
    case 'falling':
      return 'En baisse';
    default:
      return 'Stable';
  }
}

export interface TrendStats {
  total: number;
  rising: number;
  stable: number;
}
