import { useQuery, useQueries } from '@tanstack/react-query';
import { swapiApi } from '@/api/swapi';
import { Character } from '@/types/swapi';

export const usePeople = (page: number) => {
  return useQuery({
    queryKey: ['people', page],
    queryFn: () => swapiApi.getPeople(page),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePersonDetails = (uid: string) => {
  return useQuery({
    queryKey: ['person', uid],
    queryFn: () => swapiApi.getPersonDetails(uid),
    enabled: !!uid,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSearchPeople = (query: string, genderFilter?: string) => {
  return useQuery({
    queryKey: ['searchPeople', query, genderFilter],
    queryFn: () => swapiApi.searchPeople(query, genderFilter),
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useMultiplePersonDetails = (characters: Character[]) => {
  return useQueries({
    queries: characters.map((character) => ({
      queryKey: ['person', character.uid],
      queryFn: () => swapiApi.getPersonDetails(character.uid),
      staleTime: 10 * 60 * 1000, // 10 minutes
    })),
  });
};

export const useAllPeopleWithGenderFilter = (genderFilter: string) => {
  return useQuery({
    queryKey: ['allPeopleWithGender', genderFilter],
    queryFn: async () => {
      const allCharacters = await swapiApi.getAllPeople();
      
      if (genderFilter === 'all') {
        return allCharacters;
      }
      
      const uids = allCharacters.map(character => character.uid);
      const detailsMap = await swapiApi.getBatchPersonDetails(uids);
      
      const filteredCharacters = allCharacters.filter((character) => {
        const details = detailsMap.get(character.uid);
        return details?.result?.properties?.gender === genderFilter;
      });
      
      return filteredCharacters;
    },
    enabled: genderFilter !== 'all',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAllPeople = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['allPeople'],
    queryFn: () => swapiApi.getAllPeople(),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};