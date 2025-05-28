import { useQuery, useQueries, useQueryClient } from '@tanstack/react-query';
import { swapiApi } from '@/api/swapi';
import { Character } from '@/types/swapi';

export const usePeople = (page: number) => {
  return useQuery({
    queryKey: ['people', page],
    queryFn: () => swapiApi.getPeople(page),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes 
  });
};

export const usePersonDetails = (uid: string) => {
  return useQuery({
    queryKey: ['person', uid],
    queryFn: () => swapiApi.getPersonDetails(uid),
    enabled: !!uid,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useSearchPeople = (query: string, genderFilter?: string) => {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ['searchPeople', query, genderFilter],
    queryFn: async () => {
      const allCharacters = await queryClient.fetchQuery({
        queryKey: ['allPeople'],
        queryFn: () => swapiApi.getAllPeople(),
        staleTime: 5 * 60 * 1000,
      });
      
      let filteredResults = allCharacters.filter(character =>
        character.name.toLowerCase().includes(query.toLowerCase())
      );

      if (genderFilter && genderFilter !== 'all') {
        const detailsPromises = filteredResults.map(character =>
          queryClient.fetchQuery({
            queryKey: ['person', character.uid],
            queryFn: () => swapiApi.getPersonDetails(character.uid),
            staleTime: 10 * 60 * 1000,
          })
        );
        
        const detailsResults = await Promise.allSettled(detailsPromises);
        
        filteredResults = filteredResults.filter((_, index) => {
          const result = detailsResults[index];
          if (result.status === 'fulfilled') {
            return result.value.result.properties.gender === genderFilter;
          }
          return false;
        });
      }
      
      return {
        message: 'ok' as const,
        total_records: filteredResults.length,
        total_pages: Math.ceil(filteredResults.length / 10),
        previous: null,
        next: null,
        results: filteredResults
      };
    },
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMultiplePersonDetails = (characters: Character[]) => {
  return useQueries({
    queries: characters.map((character) => ({
      queryKey: ['person', character.uid],
      queryFn: () => swapiApi.getPersonDetails(character.uid),
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    })),
  });
};

export const useAllPeopleWithGenderFilter = (genderFilter: string) => {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ['allPeopleWithGender', genderFilter],
    queryFn: async () => {
      const allCharacters = await queryClient.fetchQuery({
        queryKey: ['allPeople'],
        queryFn: () => swapiApi.getAllPeople(),
        staleTime: 5 * 60 * 1000,
      });
      
      if (genderFilter === 'all') {
        return allCharacters;
      }
      
      const detailsPromises = allCharacters.map(character =>
        queryClient.fetchQuery({
          queryKey: ['person', character.uid],
          queryFn: () => swapiApi.getPersonDetails(character.uid),
          staleTime: 10 * 60 * 1000,
        })
      );
      
      const detailsResults = await Promise.allSettled(detailsPromises);
      
      const filteredCharacters = allCharacters.filter((_, index) => {
        const result = detailsResults[index];
        if (result.status === 'fulfilled') {
          return result.value.result.properties.gender === genderFilter;
        }
        return false;
      });
      
      return filteredCharacters;
    },
    enabled: genderFilter !== 'all',
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAllPeople = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['allPeople'],
    queryFn: () => swapiApi.getAllPeople(),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};