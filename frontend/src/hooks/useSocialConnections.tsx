import { useCallback, useState } from 'react';

export const PREVIEW_MODE = false;

export type SocialPlatformConnection =
  | 'linkedin'
  | 'facebook'
  | 'instagram'
  | 'twitter'
  | 'google_business';

export interface SocialConnection {
  id: string;
  platform: SocialPlatformConnection;
  is_active: boolean;
  permissions?: string[];
  account_name?: string | null;
  account_email?: string | null;
  connected_at?: string | null;
  last_used_at?: string | null;
}

export interface PlatformConfig {
  name: string;
  description: string;
  color: string;
  bgColor: string;
  oauthSupported: boolean;
  connectionType: 'oauth' | 'webhook';
}

export const PLATFORM_CONFIGS: Record<SocialPlatformConnection, PlatformConfig> = {
  linkedin: {
    name: 'LinkedIn',
    description: 'Publiez et suivez vos contenus professionnels.',
    color: '#0A66C2',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    oauthSupported: true,
    connectionType: 'oauth',
  },
  facebook: {
    name: 'Facebook',
    description: 'Connexion recommandée via Make.com (webhook).',
    color: '#1877F2',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    oauthSupported: false,
    connectionType: 'webhook',
  },
  instagram: {
    name: 'Instagram',
    description: 'Connexion recommandée via Make.com (webhook).',
    color: '#E1306C',
    bgColor: 'bg-pink-50 dark:bg-pink-950/30',
    oauthSupported: false,
    connectionType: 'webhook',
  },
  twitter: {
    name: 'X (Twitter)',
    description: 'Connexion recommandée via Make.com (webhook).',
    color: '#000000',
    bgColor: 'bg-muted',
    oauthSupported: false,
    connectionType: 'webhook',
  },
  google_business: {
    name: 'Google Business Profile',
    description: 'Avis et fiche locale (intégration à venir).',
    color: '#4285F4',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    oauthSupported: false,
    connectionType: 'webhook',
  },
};

export function useSocialConnections() {
  const [connections] = useState<SocialConnection[]>([]);
  const [loading] = useState(false);
  const [connecting, setConnecting] = useState<SocialPlatformConnection | null>(null);

  const getConnectionByPlatform = useCallback(
    (platform: SocialPlatformConnection) => connections.find((c) => c.platform === platform),
    [connections],
  );

  const isConnected = useCallback(
    (platform: SocialPlatformConnection) => !!getConnectionByPlatform(platform)?.is_active,
    [getConnectionByPlatform],
  );

  const connectWithOAuth = useCallback(async (_platform: SocialPlatformConnection) => {
    setConnecting(_platform);
    setConnecting(null);
  }, []);

  const connectWithWebhook = useCallback(
    async (_platform: SocialPlatformConnection, _url: string, _accountName?: string) => false,
    [],
  );

  const disconnect = useCallback(async (_platform: SocialPlatformConnection) => {}, []);

  const handleOAuthCallback = useCallback(
    async (_platform: SocialPlatformConnection, _code: string) => {},
    [],
  );

  return {
    connections,
    loading,
    connecting,
    isConnected,
    getConnectionByPlatform,
    connectWithOAuth,
    connectWithWebhook,
    disconnect,
    handleOAuthCallback,
    refetch: async () => {},
  };
}
