"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Copy, Check, RefreshCw, Trash2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Rédige un post Instagram pour notre collection printemps",
  "Crée 5 idées de contenus LinkedIn pour une agence digitale",
  "Quel est le meilleur moment pour publier sur Instagram en France ?",
  "Génère des hashtags pour un post sur le marketing digital",
  "Rédige une réponse à un commentaire négatif",
  "Crée un calendrier éditorial pour la semaine prochaine",
];

function getResponse(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("instagram") && (q.includes("post") || q.includes("rédige") || q.includes("collection"))) {
    return `Voici un post Instagram percutant pour votre collection printemps 🌸\n\n---\n🌿 **Nouvelle collection Printemps 2026 — enfin disponible !**\n\nLe renouveau commence maintenant. Découvrez nos nouvelles pièces intemporelles, pensées pour les journées ensoleillées et les soirées douces.\n\n✨ Des matières naturelles\n🎨 Des teintes pastel & terracotta\n💚 Une fabrication responsable\n\nDisponible dès aujourd'hui en boutique et sur notre site 🛍️\n\n→ Lien en bio\n\n#NouvelleCollection #Printemps2026 #ModeFemme #FashionFrance #StyleDurable\n---\n\n💡 Publiez entre 18h et 21h pour maximiser votre portée.`;
  }
  if (q.includes("linkedin") || q.includes("idées")) {
    return `Voici 5 idées de contenus LinkedIn pour votre agence digitale :\n\n**1. 📊 Étude de cas client**\nPartagez un succès concret avec des chiffres. Ex : « Comment nous avons augmenté les ventes de 40% en 3 mois ».\n\n**2. 💡 Astuce de la semaine**\nFormat court et actionnable. Soyez direct et utile.\n\n**3. 🎙️ Interview d'expert**\nInterviewez un client ou expert du secteur. Tagguez-le pour amplifier la portée.\n\n**4. 📈 Tendance du marché**\nCommentez une actualité du digital avec votre angle d'expertise.\n\n**5. 🧵 Thread storytelling**\nRacontez votre histoire : débuts, échecs, pivots. L'authenticité crée la confiance.\n\n---\n💡 Fréquence recommandée : 3 à 4 posts/semaine, mardi-jeudi matin (8h-10h).`;
  }
  if (q.includes("hashtag")) {
    return `**Hashtags optimisés pour le marketing digital :**\n\nPopulaires : #MarketingDigital #SocialMedia #ContentMarketing\n\nNiche : #StratégieDigitale #CommunityManager #GrowthHacking\n\nTendance 2026 : #IA2026 #MarketingIA #PersonalBranding\n\n---\n💡 Instagram : 5 à 8 hashtags max. LinkedIn : 3 à 5 seulement, ultra-ciblés.`;
  }
  if (q.includes("moment") || q.includes("heure") || q.includes("publier")) {
    return `**Meilleurs moments pour publier en France :**\n\n📱 **Instagram** : Mardi-vendredi 8h-9h et 18h-20h\n\n💼 **LinkedIn** : Mardi-jeudi 8h-10h et 12h-13h\n\n🐦 **Twitter/X** : Lundi-vendredi 12h-15h et 17h-19h\n\n📘 **Facebook** : Mercredi 9h-10h, Jeudi-vendredi 12h-13h\n\n💡 Consultez vos propres insights pour affiner selon votre audience spécifique.`;
  }
  if (q.includes("commentaire") || q.includes("négatif") || q.includes("réponse")) {
    return `**Modèle de réponse à un commentaire négatif :**\n\nBonjour [Prénom],\n\nNous vous remercions sincèrement pour votre retour. Nous sommes vraiment désolés que votre expérience n'ait pas été à la hauteur de vos attentes.\n\nPourriez-vous nous contacter en message privé afin que nous trouvions ensemble une solution rapide ?\n\nCordialement, l'équipe [Nom de la marque]\n\n---\n💡 Règles d'or : répondre en moins de 2h, rester professionnel, proposer une solution concrète, déplacer en privé si nécessaire.`;
  }
  if (q.includes("calendrier") || q.includes("semaine")) {
    return `**Calendrier éditorial — Semaine type :**\n\n**Lundi** → LinkedIn : insight, Instagram : carrousel inspirationnel\n\n**Mardi** → Twitter/X : thread ou tip du jour, Facebook : question communautaire\n\n**Mercredi** *(jour fort)* → Instagram : Reels, LinkedIn : étude de cas\n\n**Jeudi** → Twitter/X : actualité secteur, Instagram : Story interactive\n\n**Vendredi** → LinkedIn : récap hebdo, Facebook : post léger weekend\n\n---\n💡 Total : 8 à 10 publications/semaine. Ajustez selon vos ressources.`;
  }
  return `Je suis votre assistant CM IA ! Je peux vous aider à :\n\n✍️ Rédiger des posts adaptés à chaque réseau social\n🗓️ Planifier votre calendrier éditorial\n💬 Gérer les réponses aux commentaires\n🔖 Générer des hashtags pertinents\n💡 Brainstormer des idées de contenu créatif\n\nPosez-moi une question ou choisissez une suggestion ci-dessus !`;
}

function renderContent(text: string) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**")) return <div key={i} style={{ fontWeight: 700, color: "#a78bfa", marginTop: i > 0 ? "0.6rem" : 0 }}>{line.slice(2, -2)}</div>;
    if (line.startsWith("---")) return <hr key={i} style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.1)", margin: "0.6rem 0" }} />;
    if (line.startsWith("💡")) return <div key={i} style={{ marginTop: "0.4rem", padding: "0.5rem 0.75rem", background: "rgba(124,58,237,0.1)", borderRadius: "0.4rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.65)" }}>{line}</div>;
    if (line === "") return <div key={i} style={{ height: "0.3rem" }} />;
    return <div key={i} style={{ lineHeight: 1.65, color: "rgba(255,255,255,0.8)" }}>{line}</div>;
  });
}

export default function CMPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "0", role: "assistant", content: getResponse("") }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", content: text }]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: getResponse(text) }]);
      setIsTyping(false);
    }, 1200);
  };

  const copyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column", height: "calc(100vh - 4rem)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Sparkles size={18} color="white" />
          </div>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: "1.5rem", marginBottom: "0.1rem" }}>Mon CM IA</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>Assistant community manager intelligent, disponible 24h/24</p>
          </div>
        </div>
        <button onClick={() => setMessages([{ id: "0", role: "assistant", content: getResponse("") }])}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.4rem 0.85rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.5rem", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "0.82rem" }}>
          <Trash2 size={13} /> Effacer
        </button>
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", marginBottom: "0.5rem" }}>Suggestions rapides</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => sendMessage(s)}
                style={{ padding: "0.35rem 0.8rem", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "2rem", color: "#c4b5fd", fontSize: "0.8rem", cursor: "pointer" }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem", paddingBottom: "0.5rem" }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: "flex", gap: "0.65rem", flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: msg.role === "user" ? "rgba(124,58,237,0.3)" : "linear-gradient(135deg,#7c3aed,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {msg.role === "user" ? <User size={14} color="white" /> : <Bot size={14} color="white" />}
            </div>
            <div style={{ maxWidth: "78%", position: "relative" }}>
              <div style={{ background: msg.role === "user" ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${msg.role === "user" ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: msg.role === "user" ? "1rem 1rem 0 1rem" : "1rem 1rem 1rem 0", padding: "0.8rem 1rem", fontSize: "0.88rem" }}>
                {msg.role === "assistant" ? renderContent(msg.content) : <span style={{ color: "rgba(255,255,255,0.85)" }}>{msg.content}</span>}
              </div>
              {msg.role === "assistant" && (
                <button onClick={() => copyMessage(msg.id, msg.content)}
                  style={{ position: "absolute", top: "0.4rem", right: "0.4rem", background: "rgba(255,255,255,0.07)", border: "none", borderRadius: "0.3rem", padding: "0.2rem", cursor: "pointer", color: "rgba(255,255,255,0.35)", display: "flex" }}>
                  {copiedId === msg.id ? <Check size={12} style={{ color: "#10b981" }} /> : <Copy size={12} />}
                </button>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ display: "flex", gap: "0.65rem" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Bot size={14} color="white" />
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1rem 1rem 1rem 0", padding: "0.8rem 1.1rem", display: "flex", gap: "0.3rem", alignItems: "center" }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", opacity: 0.7 }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-end" }}>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder="Posez votre question... (Entrée pour envoyer, Shift+Entrée pour nouvelle ligne)"
            style={{ flex: 1, minHeight: 48, maxHeight: 120, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.75rem", padding: "0.7rem 1rem", color: "white", fontSize: "0.88rem", fontFamily: "inherit", resize: "none", outline: "none", lineHeight: 1.5 }} />
          <button onClick={() => sendMessage(input)} disabled={!input.trim() || isTyping}
            style={{ width: 48, height: 48, borderRadius: "0.75rem", background: !input.trim() || isTyping ? "rgba(124,58,237,0.3)" : "linear-gradient(135deg,#7c3aed,#ec4899)", border: "none", cursor: !input.trim() || isTyping ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
            {isTyping ? <RefreshCw size={17} color="white" /> : <Send size={17} color="white" />}
          </button>
        </div>
      </div>
    </div>
  );
}
