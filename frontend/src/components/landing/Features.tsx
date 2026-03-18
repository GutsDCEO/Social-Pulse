"use client";
import { BarChart3, Calendar, MessageSquare, TrendingUp, Users, Zap } from "lucide-react";

const features = [
  { icon: Calendar, title: "Calendrier éditorial", desc: "Planifiez vos publications en avance avec un calendrier drag & drop intuitif." },
  { icon: BarChart3, title: "Métriques avancées", desc: "Analysez les performances de vos contenus en temps réel sur tous les canaux." },
  { icon: TrendingUp, title: "Tendances", desc: "Détectez les sujets viraux et capitalisez sur les tendances émergentes." },
  { icon: MessageSquare, title: "Mon CM", desc: "Gérez toutes vos interactions communautaires depuis une seule interface." },
  { icon: Users, title: "Gestion d'équipe", desc: "Invitez des collaborateurs et gérez les permissions par rôle." },
  { icon: Zap, title: "Intégrations", desc: "Connectez vos réseaux sociaux, CRM et outils marketing en quelques clics." },
];

export default function Features() {
  return (
    <section id="fonctionnalites" className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Tout ce dont vous avez besoin</h2>
        <p className="text-white/55 text-lg flex-1 max-w-xl mx-auto">
          Des outils puissants pour chaque étape de votre stratégie social media.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(f => (
          <div key={f.title} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:-translate-y-1 hover:border-purple-500/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-purple-600/15 flex items-center justify-center mb-4">
              <f.icon className="text-purple-400" size={22} />
            </div>
            <h3 className="font-bold text-lg mb-2">{f.title}</h3>
            <p className="text-white/55 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
