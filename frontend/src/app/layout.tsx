import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SocialPulse.pro – Gérez vos réseaux sociaux",
  description: "La plateforme tout-en-un pour gérer, planifier et analyser vos réseaux sociaux.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
