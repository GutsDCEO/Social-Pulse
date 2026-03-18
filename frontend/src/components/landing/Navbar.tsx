import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#0f0f1a]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center font-extrabold text-lg text-white">S</div>
          <span className="font-bold text-xl">
            Social<span className="text-purple-400">Pulse</span><span className="text-pink-500 text-xs ml-1">.pro</span>
          </span>
        </div>
        <div className="flex gap-3 items-center">
          <Link href="/auth/login" className="px-5 py-2 rounded-lg font-medium text-sm text-white/80 hover:text-white transition-colors">Connexion</Link>
          <Link href="/auth/register" className="px-5 py-2 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90 transition-opacity shadow-[0_4px_14px_0_rgba(168,85,247,0.39)]">Essayer gratuitement</Link>
        </div>
      </div>
    </nav>
  );
}
