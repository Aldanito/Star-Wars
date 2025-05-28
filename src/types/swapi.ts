export interface Character {
  uid: string;
  name: string;
  url: string;
}

export interface CharacterDetails {
  properties: {
    name: string;
    height: string;
    mass: string;
    hair_color: string;
    skin_color: string;
    eye_color: string;
    birth_year: string;
    gender: string;
    homeworld: string;
    created: string;
    edited: string;
    url: string;
  };
  description: string;
  _id: string;
  uid: string;
  __v: number;
}

export interface SwapiResponse<T> {
  message: string;
  result: T;
}

export interface SwapiListResponse {
  message: string;
  total_records: number;
  total_pages: number;
  previous: string | null;
  next: string | null;
  results: Character[];
}

export interface SearchFilters {
  search: string;
  gender: string;
  homeworld: string;
  species: string;
}

export interface FavoriteCharacter {
  uid: string;
  name: string;
  addedAt: number;
}

export interface ComparisonCharacter extends Character {
  details?: CharacterDetails;
}