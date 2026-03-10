"use client";

import { useState } from "react";
import { trackNewsletterSignup } from "@/lib/analytics";

export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "already">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data?.error ?? "Une erreur est survenue.");
        return;
      }
      if (data.alreadySubscribed) {
        setStatus("already");
        setEmail("");
        return;
      }
      trackNewsletterSignup(email);
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMsg("Erreur de connexion.");
    }
  }

  if (status === "success") {
    return (
      <p className="text-white font-bold py-3">
        ✓ Bienvenue dans la famille ASNL !
      </p>
    );
  }

  if (status === "already") {
    return (
      <p className="text-white font-bold py-3">
        ✓ Vous êtes déjà inscrit à notre newsletter.
      </p>
    );
  }

  return (
    <form className="flex flex-col w-full max-w-md gap-2" onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.fr"
          required
          disabled={status === "loading"}
          className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-white text-sm disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-6 py-3 bg-white text-[#fd0000] font-bold rounded-xl text-sm uppercase tracking-wide hover:bg-white/90 transition-colors shrink-0 disabled:opacity-60"
        >
          {status === "loading" ? "..." : "S'abonner"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-red-200 text-sm">{errorMsg}</p>
      )}
    </form>
  );
}
