export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo?: string;
  awayLogo?: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  competition: string;
  stadium: string;
  isHome: boolean;
  ticketingUrl?: string;
  isHighProfile?: boolean;
  status: "upcoming" | "live" | "finished";
}

export interface Player {
  id: string;
  name: string;
  firstName: string;
  number: number;
  position: "GK" | "DEF" | "MID" | "ATT";
  /** Catégorie d'équipe: Séniors, Féminines, Jeunes */
  category?: "SENIOR" | "FEMININE" | "YOUTH";
  nationality: string;
  photo?: string;
  photoHover?: string;
  isFeatured?: boolean;
  stats: {
    appearances: number;
    goals: number;
    assists: number;
  };
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  photo?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  subSectionTitle?: string;
  subSectionContent?: string;
  image: string;
  category: string;
  publishedAt: string;
  slug: string;
  isFeatured?: boolean;
}

export interface StandingEntry {
  position: number;
  team: string;
  shortName: string;
  logo?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  form: ("W" | "D" | "L")[];
  isASNL?: boolean;
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  url: string;
  tier: "platinum" | "gold" | "silver" | "official";
}

export interface MediaVideo {
  id: string;
  title: string;
  competition: string;
  date: string;
  thumbnail: string;
  duration: string;
  youtubeId: string;
}

export interface MediaPhoto {
  id: string;
  src: string;
  caption: string;
  category: string;
}

export interface TrackingEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}
