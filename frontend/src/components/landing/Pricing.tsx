import Link from 'next/link';
import { Check, ChevronRight } from 'lucide-react';

const plans = [
  {
    name: "Starter", price: "29", desc: "Parfait pour débuter",
    features: ["3 réseaux sociaux", "50 publications/mois", "Métriques de base", "Support email"],
    cta: "Commencer", popular: false
  },
  {
    name: "Pro", price: "79", desc: "Pour les équipes actives",
    features: ["Réseaux illimités", "Publications illimitées", "Métriques avancées", "Équipe jusqu'à 5", "Tendances temps réel", "Support prioritaire"],
    cta: "Essayer Pro", popular: true
  },
  {
    name: "Agency", price: "199", desc: "Pour les agences",
    features: ["Multi-organisations", "Équipe illimitée", "Accès API", "White-label", "Manager dédié", "SLA garanti"],
    cta: "Nous contacter", popular: false
  },
];

export default function Pricing() {
  return (
    <section id="tarifs" className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Tarifs simples & transparents</h2>
        <p className="text-white/55 text-lg">Commencez gratuitement, évoluez selon vos besoins.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {plans.map(plan => (
          <div key={plan.name} className={`relative p-8 rounded-2xl bg-white/5 border ${plan.popular ? 'border-purple-500 shadow-[0_4px_24px_0_rgba(168,85,247,0.15)]' : 'border-white/10'}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-bold py-1 px-4 rounded-full">
                LE PLUS POPULAIRE
              </div>
            )}
            <div className="mb-6">
              <div className="font-bold text-xl mb-1">{plan.name}</div>
              <div className="text-white/50 text-sm mb-4">{plan.desc}</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">{plan.price}€</span>
                <span className="text-white/40 text-sm">/mois</span>
              </div>
            </div>
            <ul className="flex flex-col gap-3 mb-8">
              {plan.features.map(feat => (
                <li key={feat} className="flex items-center gap-2 text-sm text-white/75">
                  <Check size={16} className="text-purple-400 shrink-0" /> {feat}
                </li>
              ))}
            </ul>
            <Link href="/auth/register" className={`w-full flex items-center justify-center gap-1 py-3 rounded-lg font-medium transition-all ${plan.popular ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90' : 'bg-white/5 text-white hover:bg-white/10'}`}>
              {plan.cta} <ChevronRight size={16} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
