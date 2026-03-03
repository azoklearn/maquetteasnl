import type { SectionStyle } from "@/lib/db";

/** Tailles de titre disponibles → classe Tailwind */
export const TITLE_SIZE_CLASSES: Record<NonNullable<SectionStyle["titleSize"]>, string> = {
  sm: "text-3xl md:text-5xl",
  md: "text-4xl md:text-6xl",
  lg: "text-5xl md:text-7xl",
  xl: "text-6xl md:text-9xl",
};

/** Retourne les styles CSS inline à appliquer à la section */
export function sectionBg(s?: SectionStyle): React.CSSProperties {
  if (!s?.bgColor) return {};
  return { backgroundColor: s.bgColor };
}

export function sectionText(s?: SectionStyle): React.CSSProperties {
  if (!s?.textColor) return {};
  return { color: s.textColor };
}

export function sectionAccent(s?: SectionStyle): string {
  return s?.accentColor ?? "#fd0000";
}

export function titleSizeClass(s?: SectionStyle, fallback = "text-4xl md:text-6xl"): string {
  if (!s?.titleSize) return fallback;
  return TITLE_SIZE_CLASSES[s.titleSize] ?? fallback;
}
