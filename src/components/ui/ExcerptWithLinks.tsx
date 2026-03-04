"use client";

import Link from "next/link";

/**
 * Parse un texte contenant des liens au format Markdown [texte](url)
 * et retourne des éléments React (texte + liens cliquables).
 */
export function ExcerptWithLinks({
  text,
  className,
  linkClassName = "text-[#fd0000] hover:underline font-medium",
}: {
  text: string;
  className?: string;
  linkClassName?: string;
}) {
  if (!text?.trim()) return null;

  const parts: React.ReactNode[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Texte avant le lien
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    // Lien
    const href = match[2].trim();
    const linkText = match[1];
    const isExternal = href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//");
    parts.push(
      isExternal ? (
        <a
          key={match.index}
          href={href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className={linkClassName}
          onClick={(e) => e.stopPropagation()}
        >
          {linkText}
        </a>
      ) : (
        <Link key={match.index} href={href} className={linkClassName} onClick={(e) => e.stopPropagation()}>
          {linkText}
        </Link>
      )
    );
    lastIndex = regex.lastIndex;
  }

  // Reste du texte
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <span className={className}>{parts}</span>;
}
