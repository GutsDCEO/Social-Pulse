// ============================================================
// src/pages/Login.tsx
// Rewired from Lovable: Supabase auth → Social-Pulse AuthContext.
// CDC: No self-registration. "Contactez-nous" replaces "Sign up".
// Removed: Google/Apple OAuth, phone sign-in (not in our stack).
// ============================================================

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2, User } from 'lucide-react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// A03 OWASP: Input constraints as named constants, not magic numbers.
const MAX_USERNAME_LENGTH = 100;
const MAX_PASSWORD_LENGTH = 128;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername]         = useState('');
  const [password, setPassword]         = useState('');
  const [isLoading, setIsLoading]       = useState(false);

  const { login, isAuthenticated, isLoading: authLoading, user } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const { toast } = useToast();

  const defaultAuthedPath = user?.isAdmin ? '/admin' : '/dashboard';

  // Redirect to intended page (or dashboard) if already authenticated.
  const from = (location.state as { from?: Location })?.from?.pathname ?? defaultAuthedPath;
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, from]);

  // A07 OWASP: Rate-limiting enforced server-side; client shows a generic error.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // A03 OWASP: Fail early — validate at boundary before hitting the network.
    if (!username.trim() || !password.trim()) return;

    setIsLoading(true);
    try {
      await login({ username: username.trim(), password });
      toast({ title: 'Connexion réussie', description: 'Bienvenue !' });
      navigate(from, { replace: true });
    } catch {
      // A09 OWASP: Never expose server details; show a generic message.
      toast({
        variant: 'destructive',
        title: 'Erreur de connexion',
        description: "Identifiants incorrects. Vérifiez votre nom d'utilisateur et votre mot de passe.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthLayout tagline="Connectez-vous à votre espace SocialPulse.">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Se connecter
          </h1>
          <p className="text-muted-foreground">
            Entrez vos identifiants pour accéder à votre espace.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="login-username" className="sr-only">
              Nom d'utilisateur
            </Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="login-username"
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={e => setUsername(e.target.value.slice(0, MAX_USERNAME_LENGTH))}
                className="h-12 pl-12 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
                required
                disabled={isLoading}
                autoComplete="username"
                autoFocus
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="login-password" className="sr-only">
              Mot de passe
            </Label>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mot de passe"
                value={password}
                onChange={e => setPassword(e.target.value.slice(0, MAX_PASSWORD_LENGTH))}
                className="h-12 bg-muted/50 border-0 pr-12 focus-visible:ring-1 focus-visible:ring-primary"
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Submit */}
          <Button
            id="login-submit"
            type="submit"
            className="w-full h-12 font-semibold uppercase tracking-wide"
            disabled={isLoading || !username.trim() || !password.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion en cours…
              </>
            ) : (
              'Connexion'
            )}
          </Button>
        </form>

        {/* CDC compliance footer — no self-registration */}
        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p>
            Pas encore de compte ?{' '}
            <a
              href="mailto:contact@socialpulse.fr"
              className="text-primary font-medium hover:underline"
            >
              Contactez-nous
            </a>
          </p>
          <p className="text-xs">
            Les comptes sont créés par l'administrateur SocialPulse.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
