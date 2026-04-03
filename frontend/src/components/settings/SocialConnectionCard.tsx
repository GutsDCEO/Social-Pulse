import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Building2, Link2, Link2Off, Check, ExternalLink, Loader2, Calendar, Shield } from "lucide-react";
import { Linkedin, Facebook, Instagram, Twitter } from "@/lib/brand-icons";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  SocialConnection, 
  SocialPlatformConnection, 
  PlatformConfig,
  PLATFORM_CONFIGS 
} from "@/hooks/useSocialConnections";
import { cn } from "@/lib/utils";

interface SocialConnectionCardProps {
  platform: SocialPlatformConnection;
  connection?: SocialConnection;
  connecting: boolean;
  onConnectOAuth: () => void;
  onConnectWebhook: (webhookUrl: string, accountName?: string) => Promise<boolean>;
  onDisconnect: () => void;
}

const PlatformIcon = ({ platform, className, style }: { platform: SocialPlatformConnection; className?: string; style?: React.CSSProperties }) => {
  const icons = {
    linkedin: Linkedin,
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    google_business: Building2,
  };
  const Icon = icons[platform];
  return <Icon className={className} style={style} />;
};

export function SocialConnectionCard({
  platform,
  connection,
  connecting,
  onConnectOAuth,
  onConnectWebhook,
  onDisconnect,
}: SocialConnectionCardProps) {
  const [webhookDialogOpen, setWebhookDialogOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [accountName, setAccountName] = useState("");
  const [savingWebhook, setSavingWebhook] = useState(false);

  const config = PLATFORM_CONFIGS[platform];
  const isConnected = !!connection?.is_active;

  const handleWebhookSubmit = async () => {
    if (!webhookUrl) return;
    
    setSavingWebhook(true);
    const success = await onConnectWebhook(webhookUrl, accountName);
    setSavingWebhook(false);
    
    if (success) {
      setWebhookDialogOpen(false);
      setWebhookUrl("");
      setAccountName("");
    }
  };

  const handleConnect = () => {
    if (config.oauthSupported && config.connectionType === "oauth") {
      onConnectOAuth();
    } else {
      setWebhookDialogOpen(true);
    }
  };

  return (
    <>
      <Card className={cn(
        "transition-all duration-200",
        isConnected 
          ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20" 
          : "border-dashed hover:border-muted-foreground/50"
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-lg transition-colors",
                  isConnected ? config.bgColor : "bg-muted"
                )}
                style={isConnected ? { backgroundColor: `${config.color}15` } : undefined}
              >
                <PlatformIcon 
                  platform={platform} 
                  className={cn(
                    "h-6 w-6 transition-colors",
                    isConnected ? `text-[${config.color}]` : "text-muted-foreground"
                  )}
                  style={isConnected ? { color: config.color } : undefined}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{config.name}</CardTitle>
                  {isConnected && (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 gap-1">
                      <Check className="h-3 w-3" />
                      Connecté
                    </Badge>
                  )}
                </div>
                <CardDescription className="mt-0.5">
                  {isConnected && connection?.account_name 
                    ? connection.account_name 
                    : config.description}
                </CardDescription>
              </div>
            </div>
            
            {isConnected ? (
              <Button 
                variant="outline" 
                onClick={onDisconnect} 
                className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Link2Off className="h-4 w-4" />
                Déconnecter
              </Button>
            ) : (
              <Button 
                onClick={handleConnect} 
                disabled={connecting}
                className="gap-2"
                style={{ backgroundColor: config.color }}
              >
                {connecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Link2 className="h-4 w-4" />
                )}
                Connecter
              </Button>
            )}
          </div>
        </CardHeader>
        
        {isConnected && connection && (
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {connection.account_email && (
                <span className="flex items-center gap-1.5">
                  <span className="font-medium">Email:</span>
                  {connection.account_email}
                </span>
              )}
              {connection.connected_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Connecté le {format(new Date(connection.connected_at), "dd MMM yyyy", { locale: fr })}
                </span>
              )}
              {connection.last_used_at && (
                <span className="flex items-center gap-1.5">
                  Dernière utilisation: {format(new Date(connection.last_used_at), "dd MMM", { locale: fr })}
                </span>
              )}
            </div>
            
            {connection.permissions && connection.permissions.length > 0 && (
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Permissions:</span>
                {connection.permissions.slice(0, 3).map((perm) => (
                  <Badge key={perm} variant="secondary" className="text-xs">
                    {perm.replace(/_/g, " ")}
                  </Badge>
                ))}
                {connection.permissions.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{connection.permissions.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        )}

        {!isConnected && !config.oauthSupported && (
          <CardContent className="pt-0">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="instructions" className="border-none">
                <AccordionTrigger className="text-sm text-muted-foreground hover:text-foreground py-2">
                  Comment connecter via Make.com ?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground space-y-2">
                  <ol className="list-decimal list-inside space-y-1.5">
                    <li>Créez un compte gratuit sur <a href="https://www.make.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">make.com <ExternalLink className="h-3 w-3" /></a></li>
                    <li>Créez un nouveau scénario avec un <strong>Webhook</strong> comme déclencheur</li>
                    <li>Ajoutez l'action <strong>{config.name}</strong> → <strong>Create a Post</strong></li>
                    <li>Connectez votre compte {config.name} via OAuth dans Make.com</li>
                    <li>Copiez l'URL du webhook et collez-la ici</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        )}
      </Card>

      {/* Webhook Configuration Dialog */}
      <Dialog open={webhookDialogOpen} onOpenChange={setWebhookDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div 
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${config.color}15` }}
              >
                <PlatformIcon 
                  platform={platform} 
                  className="h-5 w-5"
                  style={{ color: config.color }}
                />
              </div>
              <div>
                <DialogTitle>Connecter {config.name}</DialogTitle>
                <DialogDescription>
                  Configurez le webhook Make.com pour publier automatiquement
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-url">URL du webhook Make.com *</Label>
              <Input
                id="webhook-url"
                placeholder="https://hook.make.com/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Collez l'URL du webhook générée par Make.com
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="account-name">Nom du compte (optionnel)</Label>
              <Input
                id="account-name"
                placeholder="Ex: Ma Page Facebook"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              />
            </div>

            <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
              <p className="font-medium mb-1">💡 Besoin d'aide ?</p>
              <p>
                Consultez notre <a href="#" className="text-primary hover:underline">guide de configuration Make.com</a> pour {config.name}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setWebhookDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleWebhookSubmit} 
              disabled={!webhookUrl || savingWebhook}
              style={{ backgroundColor: config.color }}
            >
              {savingWebhook ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Connecter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
