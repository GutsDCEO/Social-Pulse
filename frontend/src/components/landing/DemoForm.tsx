"use client";
import { useState } from "react";
import { Check } from "lucide-react";

export default function DemoForm() {
  const [demoEmail, setDemoEmail] = useState("");
  const [demoSent, setDemoSent] = useState(false);

  const handleDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (demoEmail) setDemoSent(true);
  };

  return (
    <section id="demo" className="max-w-3xl mx-auto px-6 py-16">
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Demander une démo</h2>
        <p className="text-white/55 mb-8">Notre équipe vous contacte sous 24h pour une démonstration personnalisée.</p>
        
        {demoSent ? (
          <div className="text-purple-400 font-semibold text-lg flex flex-col items-center">
            <Check size={36} className="mb-2" />
            Merci ! Nous vous contacterons très bientôt.
          </div>
        ) : (
          <form onSubmit={handleDemo} className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto">
            <input
              type="email"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Votre adresse e-mail"
              value={demoEmail}
              onChange={e => setDemoEmail(e.target.value)}
              required
            />
            <button type="submit" className="px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90 transition-opacity whitespace-nowrap">
              Demander une démo
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
