import { Character, ComparisonCharacter } from '@/types/swapi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Heart, GitCompare, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CharacterCardProps {
  character: Character;
  onSelect: (uid: string) => void;
  className?: string;
  isFavorite?: boolean;
  onToggleFavorite?: (character: { uid: string; name: string }) => void;
  onAddToComparison?: (character: ComparisonCharacter) => void;
  isInComparison?: boolean;
}

export function CharacterCard({ 
  character, 
  onSelect, 
  className,
  isFavorite = false,
  onToggleFavorite,
  onAddToComparison,
  isInComparison = false
}: CharacterCardProps) {
  const getGenderIcon = (name: string) => {
    const femaleNames = ['leia', 'padme', 'amidala', 'rey', 'jyn'];
    const isFemale = femaleNames.some(n => name.toLowerCase().includes(n));
    return isFemale ? '♀' : '♂';
  };

  const getCharacterImage = (name: string) => {
    const encodedName = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&size=48`;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('button')) {
      onSelect(character.uid);
    }
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 relative group",
        className
      )}
      onClick={handleCardClick}
    >
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 z-10">
        <Link
          to={`/character/${character.uid}`}
          className="inline-block"
          onClick={(e) => e.stopPropagation()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-background/80 backdrop-blur-sm"
            title="Open in new tab"
          >
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </Button>
        </Link>
        
        {onToggleFavorite && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-background/80 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite({ uid: character.uid, name: character.name });
            }}
          >
            <Heart 
              className={cn(
                "h-4 w-4",
                isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
              )} 
            />
          </Button>
        )}
        {onAddToComparison && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 bg-background/80 backdrop-blur-sm",
              isInComparison && "bg-primary/20"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onAddToComparison({ 
                uid: character.uid, 
                name: character.name,
                url: character.url 
              });
            }}
          >
            <GitCompare 
              className={cn(
                "h-4 w-4",
                isInComparison ? "text-primary" : "text-muted-foreground"
              )} 
            />
          </Button>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-center space-x-3">
          <img
            src={getCharacterImage(character.name)}
            alt={character.name}
            className="w-12 h-12 rounded-full bg-muted"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${character.name}&background=random`;
            }}
          />
          <div className="flex-1">
            <CardTitle className="text-lg">{character.name}</CardTitle>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{getGenderIcon(character.name)}</span>
              <span>ID: {character.uid}</span>
              {isFavorite && (
                <Heart className="h-3 w-3 fill-red-500 text-red-500" />
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-sm text-muted-foreground">
          Click to view details
        </div>
      </CardContent>
    </Card>
  );
}