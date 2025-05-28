import { SwapiListResponse, SwapiResponse, CharacterDetails, Character } from '@/types/swapi';

const BASE_URL = 'https://swapi.tech/api';

export const swapiApi = {
  async getPeople(page: number = 1): Promise<SwapiListResponse> {
    const response = await fetch(`${BASE_URL}/people?page=${page}&limit=12`);
    if (!response.ok) {
      throw new Error('Failed to fetch people');
    }
    return response.json();
  },

  async getPersonDetails(uid: string): Promise<SwapiResponse<CharacterDetails>> {
    const response = await fetch(`${BASE_URL}/people/${uid}`);
    if (!response.ok) {
      throw new Error('Failed to fetch person details');
    }
    return response.json();
  },

  async searchPeople(_query: string, _genderFilter?: string): Promise<SwapiListResponse> {
   
    throw new Error('Use useSearchPeople hook instead of direct API call');
  },

  async getAllPeople(): Promise<Character[]> {
    const maxPages = 9;
    const allCharacters: Character[] = [];
    
    try {
      const firstPage = await this.getPeople(1);
      allCharacters.push(...firstPage.results);
      
      if (firstPage.next && firstPage.total_pages) {
        const totalPages = Math.min(maxPages, firstPage.total_pages);
        
        const pagePromises: Promise<SwapiListResponse>[] = [];
        for (let page = 2; page <= totalPages; page++) {
          pagePromises.push(this.getPeople(page));
        }
        
        const responses = await Promise.allSettled(pagePromises);
        
        responses.forEach((result) => {
          if (result.status === 'fulfilled' && result.value?.results) {
            allCharacters.push(...result.value.results);
          }
        });
      }
    } catch (error) {
      console.error('Failed to fetch all people:', error);
      throw error;
    }

    return allCharacters;
  },

  async getBatchPersonDetails(uids: string[]): Promise<Map<string, SwapiResponse<CharacterDetails>>> {
    const results = new Map<string, SwapiResponse<CharacterDetails>>();
    
    const promises = uids.map(async (uid: string) => {
      try {
        const details = await this.getPersonDetails(uid);
        return { uid, details };
      } catch (error) {
        console.warn(`Failed to fetch details for ${uid}:`, error);
        return { uid, details: null };
      }
    });
    
    const responses = await Promise.allSettled(promises);
    
    responses.forEach((result) => {
      if (result.status === 'fulfilled' && result.value.details) {
        results.set(result.value.uid, result.value.details);
      }
    });
    
    return results;
  }
};