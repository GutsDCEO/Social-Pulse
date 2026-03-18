const stats = [
  { value: "10K+", label: "Utilisateurs actifs" },
  { value: "2M+", label: "Publications planifiées" },
  { value: "98%", label: "Satisfaction client" },
  { value: "15+", label: "Réseaux supportés" },
];

export default function Stats() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-8 pb-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-br from-purple-400 to-pink-500 bg-clip-text text-transparent">{s.value}</div>
            <div className="text-sm text-white/55 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
