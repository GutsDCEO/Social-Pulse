import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Share2, Sparkles, ExternalLink, Zap } from "lucide-react";
import { useSocialConnections, SocialPlatformConnection, PLATFORM_CONFIGS } from "@/hooks/useSocialConnections";
import { SocialConnectionCard } from "./SocialConnectionCard";

const PLATFORMS_ORDER: SocialPlatformConnection[] = [
  "linkedin",
  "facebook",
  "instagram",
  "twitter",
  "google_business",
];

export function SocialConnectionsTab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    connections,
    loading,
    connecting,
    isConnected,
    getConnectionByPlatform,
    connectWithOAuth,
    connectWithWebhook,
    disconnect,
    handleOAuthCallback,
  } = useSocialConnections();

  // Handle OAuth callback
  useEffect(() => {
    const oauthCallback = searchParams.get("oauth_callback") as SocialPlatformConnection | null;
    const code = searchParams.get("code");

    if (oauthCallback && code) {
      handleOAuthCallback(oauthCallback, code).then(() => {
        // Clean up URL params
        searchParams.delete("oauth_callback");
        searchParams.delete("code");
        searchParams.delete("state");
        setSearchParams(searchParams);
      });
    }
  }, [searchParams, handleOAuthCallback, setSearchParams]);

  const connectedCount = connections.filter(c => c.is_active).length;

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72 mt-2" />
          </CardHeader>
        </Card>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Share2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Connexions des réseaux sociaux
                {connectedCount > 0 && (
                  <span className="text-sm font-normal text-muted-foreground">
                    ({connectedCount}/{PLATFORMS_ORDER.length} connectés)
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                Connectez vos comptes pour publier directement depuis SocialPulse
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Alert className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              <strong>Publiez en un clic</strong> — Une fois connectés, vos réseaux sociaux permettront 
              de publier instantanément vos contenus et de récupérer les statistiques d'engagement.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Info about Make.com for webhook platforms */}
      <Card className="border-dashed bg-muted/30">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Connexion via Make.com (gratuit)</p>
              <p className="text-sm text-muted-foreground">
                Pour Facebook, Instagram et X (Twitter), nous utilisons Make.com comme intermédiaire. 
                C'est gratuit (1 000 opérations/mois) et évite les complexités de vérification des apps.
              </p>
              <a 
                href="https://www.make.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-1"
              >
                Créer un compte Make.com <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Cards */}
      <div className="space-y-4">
        {PLATFORMS_ORDER.map((platform) => (
          <SocialConnectionCard
            key={platform}
            platform={platform}
            connection={getConnectionByPlatform(platform)}
            connecting={connecting === platform}
            onConnectOAuth={() => connectWithOAuth(platform)}
            onConnectWebhook={(url, name) => connectWithWebhook(platform, url, name)}
            onDisconnect={() => disconnect(platform)}
          />
        ))}
      </div>

      {/* Connected Summary */}
      {connectedCount > 0 && (
        <Card className="bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <div className="flex -space-x-2">
                {connections
                  .filter(c => c.is_active)
                  .slice(0, 4)
                  .map((conn) => (
                    <div
                      key={conn.id}
                      className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center"
                      style={{ backgroundColor: `${PLATFORM_CONFIGS[conn.platform].color}15` }}
                    >
                      <span style={{ color: PLATFORM_CONFIGS[conn.platform].color }}>
                        {PLATFORM_CONFIGS[conn.platform].name.charAt(0)}
                      </span>
                    </div>
                  ))}
              </div>
              <span className="text-sm font-medium">
                {connectedCount} réseau{connectedCount > 1 ? "x" : ""} connecté{connectedCount > 1 ? "s" : ""}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
