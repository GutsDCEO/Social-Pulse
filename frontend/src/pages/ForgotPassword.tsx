// src/pages/ForgotPassword.tsx
// CDC: Admin creates accounts. Password reset is an admin function.
// This page is informational only — directs users to contact admin.
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  return (
    <AuthLayout tagline="Récupération de compte SocialPulse.">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Mot de passe oublié ?
          </h1>
          <p className="text-muted-foreground">
            Les comptes SocialPulse sont gérés par votre administrateur.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-5 space-y-3">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium">Contactez votre administrateur</p>
              <p className="text-sm text-muted-foreground mt-1">
                Votre administrateur SocialPulse peut réinitialiser votre mot de passe
                et vous envoyer vos nouveaux identifiants.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button asChild variant="outline" className="w-full h-12">
            <a href="mailto:support@socialpulse.fr">
              <Mail className="h-4 w-4 mr-2" />
              Contacter le support
            </a>
          </Button>
          <Button asChild variant="ghost" className="w-full h-12">
            <Link to="/login">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la connexion
            </Link>
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Les comptes sont créés et gérés par l'administrateur SocialPulse.
        </p>
      </div>
    </AuthLayout>
  );
}
