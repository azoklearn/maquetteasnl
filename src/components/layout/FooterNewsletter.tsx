"use client";

import { useState } from "react";
import { trackNewsletterSignup } from "@/lib/analytics";

export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    trackNewsletterSignup(email);
    setSubmitted(true);
    setEmail("");
  }

  if (submitted) {
    return (
      <p className="text-white font-bold py-3">
        ✓ Bienvenue dans la famille ASNL !
      </p>
    );
  }

  return (
    <form className="flex w-full max-w-md gap-2" onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="votre@email.fr"
        className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-white text-sm"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-white text-[#C8102E] font-bold rounded-xl text-sm uppercase tracking-wide hover:bg-white/90 transition-colors shrink-0"
      >
        S'abonner
      </button>
    </form>
  );
}
