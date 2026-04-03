import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

interface AuthLayoutProps {
  children: React.ReactNode;
  illustration?: "gradient" | "people";
  tagline?: string;
}

export function AuthLayout({ 
  children, 
  illustration = "gradient",
  tagline = "Connectez-vous parfaitement avec votre public."
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center p-12 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-white/10" />
          <div className="absolute -top-24 -left-24 h-[400px] w-[400px] rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/3 h-[300px] w-[300px] rounded-full bg-white/5" />
        </div>

        <div className="relative z-10 max-w-md">
          {/* Logo */}
          <div className="mb-16">
            <img 
              src={logo} 
              alt="SocialPulse" 
              className="h-24 brightness-0 invert" 
            />
          </div>

          {/* Tagline */}
          <h1 className="text-4xl font-semibold text-white leading-tight tracking-tight">
            {tagline.split(" ").map((word, i) => 
              word.toLowerCase() === "parfaitement" ? (
                <span key={i} className="italic text-white/90 font-light">{word} </span>
              ) : (
                <span key={i}>{word} </span>
              )
            )}
          </h1>

          {/* Decorative line */}
          <div className="mt-16 flex gap-2">
            <div className="h-1 w-16 rounded-full bg-white" />
            <div className="h-1 w-10 rounded-full bg-white/40" />
            <div className="h-1 w-10 rounded-full bg-white/20" />
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex w-full lg:w-1/2 flex-col justify-between bg-background p-8 lg:p-12">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-8">
          <img 
            src={logo} 
            alt="SocialPulse" 
            className="h-16" 
          />
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between text-sm text-muted-foreground mt-8">
          <Link to="#" className="hover:text-foreground transition-colors">
            Contactez-nous
          </Link>
          <Link to="#" className="hover:text-foreground transition-colors">
            À propos de nous
          </Link>
        </div>
      </div>
    </div>
  );
}
