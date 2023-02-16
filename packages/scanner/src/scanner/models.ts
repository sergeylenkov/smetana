export interface Track {
  id?: number;
  key: string;
  path: string;
  fileName: string;
  title: string;
  genres: string[];
  year: number;
  album: string,
  albumArtist: string;
  artists: string[];
  composers: string[];
  track: number;
  disk: number;
  start: number;
  duration: number;
  codec: string;
  multitrack: boolean;
  created_at: Date;
  modified_at: Date;
}

export interface Artist {
  id?: number;
  name: string;
}

export interface Album {
  id?: number;
  key: string;
  name: string;
  year: number;
}

export interface Genre {
  id?: number;
  name: string;
}

export interface Cover {
  id?: number;
  key: string;
  file: string;
  isMain: boolean;
}

export interface CoverWeight {
  cover: Cover;
  weight: number;
}
