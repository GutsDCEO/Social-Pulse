export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 px-6 text-center text-white/40 text-sm">
      © {new Date().getFullYear()} SocialPulse.pro · Tous droits réservés ·{" "}
      <a href="#" className="hover:text-white/60 transition-colors">Mentions légales</a>
    </footer>
  );
}
