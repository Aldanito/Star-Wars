import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { X, User, Calendar, Ruler, Weight, Eye } from 'lucide-react';

interface Character {
  uid: string;
  properties: {
    name: string;
    gender: string;
    birth_year: string;
    height: string;
    mass: string;
    eye_color: string;
  };
}

interface QueryResult {
  data: {
    result: Character;
  };
}

interface CharacterComparisonProps {
  characters: QueryResult[];
  onClose: () => void;
  onRemoveCharacter: (index: number) => void;
}

export function CharacterComparison({ 
  characters, 
  onClose, 
  onRemoveCharacter 
}: CharacterComparisonProps) {
  const formatValue = (value: string | undefined) => {
    if (!value || value === 'unknown' || value === 'n/a') {
      return 'Unknown';
    }
    return value;
  };

  const getCharacterImage = (name: string) => {
    const encodedName = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&size=64`;
  };

  const getGridClasses = (count: number) => {
    if (count === 1) return "grid gap-3 sm:gap-4 grid-cols-1 max-w-sm sm:max-w-md mx-auto";
    if (count === 2) return "grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 max-w-lg sm:max-w-2xl mx-auto";
    if (count === 3) return "grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-2xl lg:max-w-4xl mx-auto";
    return "grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-6xl mx-auto";
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-6xl max-h-[90vh] h-auto overflow-hidden flex flex-col p-4 sm:p-6">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-lg sm:text-xl">Character Comparison</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Compare Star Wars characters side by side to see their detailed information and stats.
          </DialogDescription>
        </DialogHeader>

        {characters.length === 0 ? (
          <div className="text-center py-8 flex-1 flex flex-col justify-center">
            <p className="text-muted-foreground text-sm sm:text-base">No characters selected for comparison.</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              Click the compare button on character cards to add them here.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-2">
            <div className={getGridClasses(characters.length)}>
              {characters.map((queryResult, index) => {
                if (!queryResult?.data?.result) {
                  return (
                    <Card key={index} className="relative min-h-[200px] sm:min-h-[250px]">
                      <CardContent className="p-4 sm:p-6">
                        <div className="text-center py-4 flex items-center justify-center h-full">
                          <p className="text-xs sm:text-sm text-muted-foreground">Loading character details...</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                }

                const character = queryResult.data.result;
                return (
                  <Card key={character.uid || index} className="relative min-h-[280px] sm:min-h-[320px] flex flex-col">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 sm:right-2 sm:top-2 h-6 w-6 sm:h-8 sm:w-8 z-10"
                      onClick={() => onRemoveCharacter(index)}
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>

                    <CardHeader className="pb-3 sm:pb-4 flex-shrink-0">
                      <div className="flex flex-col items-center space-y-2">
                        <img
                          src={getCharacterImage(character.properties.name)}
                          alt={character.properties.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted flex-shrink-0"
                        />
                        <CardTitle className="text-sm sm:text-lg text-center leading-tight px-6">
                          {character.properties.name}
                        </CardTitle>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-2 sm:space-y-3 flex-1 p-3 sm:p-6 pt-0">
                      <div className="flex items-center space-x-2">
                        <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium min-w-0">Gender:</span>
                        <span className="text-xs sm:text-sm capitalize truncate">
                          {formatValue(character.properties.gender)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium min-w-0">Birth Year:</span>
                        <span className="text-xs sm:text-sm truncate">
                          {formatValue(character.properties.birth_year)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Ruler className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium min-w-0">Height:</span>
                        <span className="text-xs sm:text-sm truncate">
                          {formatValue(character.properties.height)}
                          {character.properties.height !== 'unknown' && 
                           character.properties.height !== 'n/a' && 
                           character.properties.height ? ' cm' : ''}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Weight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium min-w-0">Mass:</span>
                        <span className="text-xs sm:text-sm truncate">
                          {formatValue(character.properties.mass)}
                          {character.properties.mass !== 'unknown' && 
                           character.properties.mass !== 'n/a' && 
                           character.properties.mass ? ' kg' : ''}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium min-w-0">Eye Color:</span>
                        <span className="text-xs sm:text-sm capitalize truncate">
                          {formatValue(character.properties.eye_color)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}