import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { usePeople, useSearchPeople, useAllPeopleWithGenderFilter, useMultiplePersonDetails, useAllPeople } from '@/hooks/usePeople';
import { useFavorites } from '@/hooks/useFavorites';
import { CharacterCard } from '@/components/CharacterCard';
import { CharacterModal } from '@/components/CharacterModal';
import { CharacterComparison } from '@/components/CharacterComparison';
import { CharacterGridSkeleton } from '@/components/CharacterCardSkeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ChevronLeft, ChevronRight, AlertCircle, Heart, GitCompare, Star } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { ComparisonCharacter } from '@/types/swapi';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function StarWarsApp() {
  const navigate = useNavigate();
  const { characterId } = useParams();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [previousPage, setPreviousPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [comparisonCharacters, setComparisonCharacters] = useState<ComparisonCharacter[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  
  const { data: peopleData, isLoading: isPeopleLoading, error: peopleError } = usePeople(currentPage);
  const { data: searchData, isLoading: isSearchLoading } = useSearchPeople(debouncedSearch, genderFilter);
  
  const { data: genderFilteredData, isLoading: isGenderFilterLoading } = useAllPeopleWithGenderFilter(genderFilter);
  
  const { data: allPeopleData, isLoading: isAllPeopleLoading } = useAllPeople();
  
  const comparisonDetails = useMultiplePersonDetails(comparisonCharacters);
  
  const isSearching = debouncedSearch.length > 0;
  const isGenderFiltering = genderFilter !== 'all';
  
  const data = useMemo(() => {
    if (isSearching) {
      if (searchData?.results) {
        const startIndex = (currentPage - 1) * 12;
        const endIndex = startIndex + 12;
        const paginatedResults = searchData.results.slice(startIndex, endIndex);
        
        return {
          message: 'ok',
          total_records: searchData.results.length,
          total_pages: Math.ceil(searchData.results.length / 12),
          previous: currentPage > 1 ? 'prev' : null,
          next: endIndex < searchData.results.length ? 'next' : null,
          results: paginatedResults
        };
      }
      return searchData;
    } else if (showFavoritesOnly && allPeopleData) {
      const favoriteCharacters = allPeopleData.filter(character => 
        isFavorite(character.uid)
      );
      
      const startIndex = (currentPage - 1) * 12;
      const endIndex = startIndex + 12;
      const paginatedFavorites = favoriteCharacters.slice(startIndex, endIndex);
      
      return {
        message: 'ok',
        total_records: favoriteCharacters.length,
        total_pages: Math.ceil(favoriteCharacters.length / 12),
        previous: currentPage > 1 ? 'prev' : null,
        next: endIndex < favoriteCharacters.length ? 'next' : null,
        results: paginatedFavorites
      };
    } else if (isGenderFiltering && genderFilteredData) {
      const startIndex = (currentPage - 1) * 12;
      const endIndex = startIndex + 12;
      const paginatedResults = genderFilteredData.slice(startIndex, endIndex);
      
      return {
        message: 'ok',
        total_records: genderFilteredData.length,
        total_pages: Math.ceil(genderFilteredData.length / 12),
        previous: currentPage > 1 ? 'prev' : null,
        next: endIndex < genderFilteredData.length ? 'next' : null,
        results: paginatedResults
      };
    }
    
    return peopleData;
  }, [isSearching, searchData, showFavoritesOnly, allPeopleData, isGenderFiltering, genderFilteredData, peopleData, currentPage, isFavorite]);
  
  const isLoading = isPeopleLoading || isSearchLoading || 
    (showFavoritesOnly && isAllPeopleLoading) || 
    (isGenderFiltering && isGenderFilterLoading);
  
  const error = peopleError;
  
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, genderFilter]);
  
  useEffect(() => {
    if (showFavoritesOnly) {
      setPreviousPage(currentPage);
      setCurrentPage(1);
    } else {
      setCurrentPage(previousPage);
    }
  }, [showFavoritesOnly]);
  
  const handleCharacterSelect = (uid: string) => {
    navigate(`/character/${uid}`);
  };
  
  const handleCloseModal = () => {
    navigate('/');
  };
  
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  
  const addToComparison = (character: ComparisonCharacter) => {
    if (comparisonCharacters.length >= 3) {
      alert('You can only compare up to 3 characters at a time.');
      return;
    }
    
    if (comparisonCharacters.some(c => c.uid === character.uid)) {
      return;
    }
    
    setComparisonCharacters(prev => [...prev, character]);
  };
  
  const removeFromComparison = (uid: string) => {
    setComparisonCharacters(prev => prev.filter(c => c.uid !== uid));
  };

  const removeFromComparisonByIndex = (index: number) => {
    setComparisonCharacters(prev => prev.filter((_, i) => i !== index));
  };
  
  const clearComparison = () => {
    setComparisonCharacters([]);
  };
  
  const canShowPrevious = data?.previous !== null;
  const canShowNext = data?.next !== null;
  
  const totalPages = data?.total_pages || 0;
  const totalRecords = data?.total_records || 0;
  
  const getPageInfo = () => {
    if (isSearching && genderFilter !== 'all') {
      return `Search results for "${debouncedSearch}" (${genderFilter}): ${totalRecords} characters found`;
    } else if (isSearching) {
      return `Search results for "${debouncedSearch}": ${totalRecords} characters found`;
    } else if (showFavoritesOnly) {
      return `Favorites: ${totalRecords} characters`;
    } else if (isGenderFiltering) {
      return `${genderFilter} characters: ${totalRecords} found`;
    }
    return `Total: ${totalRecords} characters`;
  };
  
  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h2>
              <p className="text-muted-foreground mb-4">
                Failed to load Star Wars characters. Please try again later.
              </p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Star className="h-8 w-8 text-yellow-400" />
            <h1 className="text-4xl font-bold text-foreground">Star Wars Universe</h1>
          </div>
          <ThemeToggle />
        </div>
        
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search characters (e.g., Luke, Vader, Leia)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="hermaphrodite">Hermaphrodite</SelectItem>
                <SelectItem value="n/a">N/A</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant={showFavoritesOnly ? "default" : "outline"}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className="flex items-center gap-2"
            >
              <Heart className={`h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
              Favorites ({favorites.length})
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowComparison(true)}
              disabled={comparisonCharacters.length < 2}
              className="flex items-center gap-2"
            >
              <GitCompare className="h-4 w-4" />
              Compare ({comparisonCharacters.length})
            </Button>
          </div>
          
          {comparisonCharacters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Compare:</span>
              {comparisonCharacters.map((char) => (
                <div key={char.uid} className="flex items-center gap-1 bg-background px-2 py-1 rounded text-sm">
                  {char.name}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFromComparison(char.uid)}
                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                size="sm"
                onClick={() => setShowComparison(true)}
                disabled={comparisonCharacters.length < 2}
                className="ml-2"
              >
                <GitCompare className="h-4 w-4 mr-1" />
                Compare
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={clearComparison}
                className="ml-1"
              >
                Clear
              </Button>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{getPageInfo()}</span>
            {totalPages > 0 && (
              <span>Page {currentPage} of {totalPages}</span>
            )}
          </div>
        </div>
        
        {isLoading ? (
          <CharacterGridSkeleton />
        ) : (
          <>
            {data?.results && data.results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {data.results.map((character) => (
                  <CharacterCard
                    key={character.uid}
                    character={character}
                    onSelect={handleCharacterSelect}
                    isFavorite={isFavorite(character.uid)}
                    onToggleFavorite={toggleFavorite}
                    onAddToComparison={addToComparison}
                    isInComparison={comparisonCharacters.some(c => c.uid === character.uid)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  {isSearching ? (
                    <>
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No characters found matching "{debouncedSearch}"</p>
                      <p className="text-sm mt-2">Try searching for "Luke", "Vader", or "Leia"</p>
                    </>
                  ) : showFavoritesOnly ? (
                    <>
                      <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No favorite characters yet</p>
                      <p className="text-sm mt-2">Add characters to your favorites by clicking the heart icon</p>
                    </>
                  ) : isGenderFiltering ? (
                    <>
                      <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No characters found with gender: {genderFilter}</p>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No characters available</p>
                    </>
                  )}
                </div>
              </div>
            )}
            
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!canShowPrevious}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <span className="text-sm text-muted-foreground px-4">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!canShowNext}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
        
        {characterId && (
          <CharacterModal
            uid={characterId}
            onClose={handleCloseModal}
            onToggleFavorite={toggleFavorite}
            isFavorite={isFavorite(characterId)}
          />
        )}
        
        {showComparison && comparisonCharacters.length >= 2 && (
          <CharacterComparison
            characters={comparisonDetails}
            onClose={() => setShowComparison(false)}
            onRemoveCharacter={removeFromComparisonByIndex}
          />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<StarWarsApp />} />
            <Route path="/character/:characterId" element={<StarWarsApp />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
