import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string, locale = "fr-FR"): string {
  return new Date(dateStr).toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatShortDate(dateStr: string, locale = "fr-FR"): string {
  return new Date(dateStr).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
  });
}

/** Retire les liens [texte](url) d'un extrait pour affichage brut (ex: meta description) */
export function stripExcerptLinks(text: string): string {
  if (!text?.trim()) return "";
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

/** Convertit [texte](url) en <a> et ![alt](url) en <img> dans le HTML des articles */
export function markdownLinksToHtml(html: string): string {
  if (!html?.trim()) return "";

  let out = html;

  // Images: ![alt|taille](url) — taille: small | medium | large
  out = out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, url) => {
    const rawAlt = String(alt || "");
    const [altText, sizeRaw] = rawAlt.split("|").map((s) => s.trim());
    const size = (sizeRaw || "large").toLowerCase();

    let sizeClass = "w-full max-w-full";
    if (size === "small") {
      sizeClass = "w-full max-w-md mx-auto";
    } else if (size === "medium") {
      sizeClass = "w-full max-w-2xl mx-auto";
    } else {
      sizeClass = "w-full max-w-3xl mx-auto";
    }

    const src = String(url).trim().replace(/"/g, "&quot;").replace(/</g, "&lt;");
    const safeAlt = altText.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    return `<img src="${src}" alt="${safeAlt}" class="rounded-2xl border border-white/10 my-6 object-cover ${sizeClass}" />`;
  });

  // Liens: [texte](url)
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, text, url) => {
    const href = String(url).trim().replace(/"/g, "&quot;").replace(/</g, "&lt;");
    const safeText = String(text).replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    const ext = href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//");
    const target = ext ? ' target="_blank" rel="noopener noreferrer nofollow"' : "";
    return `<a href="${href}"${target} class="text-[#fd0000] hover:underline font-semibold">${safeText}</a>`;
  });

  return out;
}

export function getTimeUntil(dateStr: string, timeStr: string) {
  const target = new Date(`${dateStr}T${timeStr}:00`);
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isPast: false };
}
