import { SwapiListResponse, SwapiResponse, CharacterDetails, Character } from '@/types/swapi';

const BASE_URL = 'https://swapi.tech/api';

type CacheableData = SwapiListResponse | SwapiResponse<CharacterDetails> | Character[];

const cache = new Map<string, CacheEntry<CacheableData>>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const getCachedData = <T extends CacheableData>(key: string): T | null => {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (entry && Date.now() - entry.timestamp < CACHE_DURATION) {
    return entry.data;
  }
  return null;
};

const setCachedData = <T extends CacheableData>(key: string, data: T): void => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const swapiApi = {
  async getPeople(page: number = 1): Promise<SwapiListResponse> {
    const cacheKey = `people-page-${page}`;
    const cached = getCachedData<SwapiListResponse>(cacheKey);
    if (cached) return cached;

    const response = await fetch(`${BASE_URL}/people?page=${page}&limit=12`);
    if (!response.ok) {
      throw new Error('Failed to fetch people');
    }
    const data: SwapiListResponse = await response.json();
    setCachedData(cacheKey, data);
    return data;
  },

  async getPersonDetails(uid: string): Promise<SwapiResponse<CharacterDetails>> {
    const cacheKey = `person-${uid}`;
    const cached = getCachedData<SwapiResponse<CharacterDetails>>(cacheKey);
    if (cached) return cached;

    const response = await fetch(`${BASE_URL}/people/${uid}`);
    if (!response.ok) {
      throw new Error('Failed to fetch person details');
    }
    const data: SwapiResponse<CharacterDetails> = await response.json();
    setCachedData(cacheKey, data);
    return data;
  },

  async searchPeople(query: string, genderFilter?: string): Promise<SwapiListResponse> {
    const allCharacters = await this.getAllPeople();
    let filteredResults = allCharacters.filter(character =>
      character.name.toLowerCase().includes(query.toLowerCase())
    );

    if (genderFilter && genderFilter !== 'all') {
      const uids = filteredResults.map(character => character.uid);
      const detailsMap = await this.getBatchPersonDetails(uids);
      
      filteredResults = filteredResults.filter((character) => {
        const details = detailsMap.get(character.uid);
        return details?.result?.properties?.gender === genderFilter;
      });
    }
    
    return {
      message: 'ok',
      total_records: filteredResults.length,
      total_pages: Math.ceil(filteredResults.length / 10),
      previous: null,
      next: null,
      results: filteredResults.slice(0, 10)
    };
  },

  async getAllPeople(): Promise<Character[]> {
    const cacheKey = 'all-people';
    const cached = getCachedData<Character[]>(cacheKey);
    if (cached) return cached;

    const maxPages = 9; 
    const pagePromises: Promise<SwapiListResponse>[] = [];
    
    const firstPage = await this.getPeople(1);
    const characters: Character[] = [...firstPage.results];
    
    if (firstPage.next) {
      const totalPages = Math.min(maxPages, firstPage.total_pages || 9);
      
      for (let page = 2; page <= totalPages; page++) {
        pagePromises.push(this.getPeople(page));
      }
      
      try {
        const responses = await Promise.allSettled(pagePromises);
        
        responses.forEach((result) => {
          if (result.status === 'fulfilled' && result.value?.results) {
            characters.push(...result.value.results);
          }
        });
      } catch (error) {
        console.warn('Some pages failed to load:', error);
      }
    }

    setCachedData(cacheKey, characters);
    return characters;
  },

  async getBatchPersonDetails(uids: string[]): Promise<Map<string, SwapiResponse<CharacterDetails>>> {
    const results = new Map<string, SwapiResponse<CharacterDetails>>();
    const uncachedUids: string[] = [];
    
    for (const uid of uids) {
      const cacheKey = `person-${uid}`;
      const cached = getCachedData<SwapiResponse<CharacterDetails>>(cacheKey);
      if (cached) {
        results.set(uid, cached);
      } else {
        uncachedUids.push(uid);
      }
    }
    
    if (uncachedUids.length > 0) {
      const promises = uncachedUids.map((uid: string) => 
        this.getPersonDetails(uid).catch((error: Error) => {
          console.warn(`Failed to fetch details for ${uid}:`, error);
          return null;
        })
      );
      
      const responses = await Promise.allSettled(promises);
      
      responses.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          const uid = uncachedUids[index];
          results.set(uid, result.value);
        }
      });
    }
    
    return results;
  },

  clearCache() {
    cache.clear();
  }
};