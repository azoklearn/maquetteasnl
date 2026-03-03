"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Erreur de connexion");
        return;
      }
      router.push("/admin");
    } catch {
      setError("Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      {/* Fond décoratif */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 40px)",
        }}
      />
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#fd0000]" />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 relative mb-4">
            <Image src="/logo.jpeg" alt="ASNL" fill className="object-contain drop-shadow-xl" sizes="80px" />
          </div>
          <h1 className="text-white font-black text-3xl uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Espace Admin
          </h1>
          <p className="text-white/40 text-sm mt-1">AS Nancy Lorraine · Gestion du site</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-black/50">
          <h2 className="text-[#0A0A0A] font-black text-xl mb-1">Connexion</h2>
          <p className="text-[#0A0A0A]/40 text-sm mb-7">Accès réservé à l'équipe de gestion</p>

          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-sm font-medium">
              <Lock className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Username */}
            <div>
              <label className="text-[#0A0A0A] text-xs font-bold uppercase tracking-wider block mb-2">
                Identifiant
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A0A0A]/30" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Votre identifiant"
                  required
                  autoComplete="username"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#f5f5f5] border border-[#e5e5e5] focus:border-[#fd0000] focus:outline-none text-sm text-[#0A0A0A] placeholder-[#0A0A0A]/30 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[#0A0A0A] text-xs font-bold uppercase tracking-wider block mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A0A0A]/30" />
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-[#f5f5f5] border border-[#e5e5e5] focus:border-[#fd0000] focus:outline-none text-sm text-[#0A0A0A] placeholder-[#0A0A0A]/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0A0A0A]/30 hover:text-[#0A0A0A] transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 bg-[#fd0000] hover:bg-[#cc0000] disabled:opacity-60 text-white font-black text-base py-4 rounded-xl transition-colors uppercase tracking-wider"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Se connecter"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          Identifiants configurables via les variables d'environnement Vercel
        </p>
      </div>
    </div>
  );
}
