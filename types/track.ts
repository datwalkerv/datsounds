export interface Stem {
  stemType: string;
  s3TrackId?: number;
  lqMp3Url: string;
  waveformUrl: string;
}

export interface Creative {
  creativeType: string;
  name: string;
  slug: string;
}

export interface CoverArt {
  baseUrl: string;
  sizes: {
    XS?: string;
    S?: string;
    M?: string;
    L?: string;
  };
}

export interface Genre {
  displayTag: string;
  tag: string;
  slug: string;
  fatherTag: string;
}

export interface Mood {
  tag: string;
  fatherTag: string;
  displayTag: string;
  slug: string;
}

export type EnergyLevel = "low" | "medium" | "variable" | "high";

export interface Track {
  id: number;
  kosmosId?: string;
  isrc?: string;
  title: string;
  added: string;
  creatives: {
    composers: Creative[];
    mainArtists: Creative[];
    featuredArtists: Creative[];
    producers: Creative[];
  };
  length: number; // seconds
  durationMs: number;
  bpm: number;
  isSfx: boolean;
  hasVocals: boolean;
  hidden: boolean;
  publicSlug?: string;
  genres: Genre[];
  moods: Mood[];
  energyLevel: EnergyLevel;
  stems: {
    full: Stem;
    bass?: Stem;
    drums?: Stem;
    instruments?: Stem;
    melody?: Stem;
  };
  isExplicit?: boolean;
  isCommercialRelease?: boolean;
  imageUrl?: string;
  coverArt?: CoverArt;
  releaseDate?: string;
  cover?: string;
  metadataTags?: string[];
}

export interface ApiResponse {
  entities: {
    tracks: Record<string, Track>;
  };
}
