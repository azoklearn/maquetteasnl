export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
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
  nationality: string;
  photo?: string;
  stats: {
    appearances: number;
    goals: number;
    assists: number;
  };
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
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

export interface TrackingEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}
