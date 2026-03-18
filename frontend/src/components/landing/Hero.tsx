import Link from 'next/link';
import { Zap, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
      <div className="inline-flex items-center gap-2 bg-purple-600/15 border border-purple-600/30 rounded-full px-4 py-1.5 mb-8 text-sm text-purple-400">
        <Zap size={14} /> Nouveau – Tendances IA en temps réel
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
        Gérez tous vos réseaux<br />
        <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">depuis une seule plateforme</span>
      </h1>
      <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
        SocialPulse centralise la création, la planification, l&apos;analyse et la modération de vos contenus sur tous vos réseaux sociaux.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/auth/register" className="px-8 py-3.5 rounded-lg font-medium text-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90 transition-opacity flex items-center gap-2 shadow-[0_4px_14px_0_rgba(168,85,247,0.39)]">
          Essayer gratuitement <ArrowRight size={18} />
        </Link>
        <a href="#demo" className="px-8 py-3.5 rounded-lg font-medium text-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
          Demander une démo
        </a>
      </div>
      <p className="mt-6 text-sm text-white/35">
        Aucune carte bancaire requise · 14 jours d&apos;essai gratuit
      </p>
    </section>
  );
}
