import { usePersonDetails } from '@/hooks/usePeople';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { AlertCircle, User, Calendar, Ruler, Weight, Eye, Palette, Users, Share, Copy, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface CharacterModalProps {
  uid: string;
  onClose: () => void;
  onToggleFavorite: (character: { uid: string; name: string }) => void;
  isFavorite: boolean;
}

export function CharacterModal({ uid, onClose, onToggleFavorite, isFavorite }: CharacterModalProps) {
  const { data, isLoading, error } = usePersonDetails(uid || '');
  const [copied, setCopied] = useState(false);

  const getCharacterImage = (name: string) => {
    const encodedName = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&size=96`;
  };

  const formatValue = (value: string | undefined) => {
    if (!value || value === 'unknown' || value === 'n/a') {
      return 'Unknown';
    }
    return value;
  };

  const shareCharacter = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${data?.result?.properties?.name} - Star Wars Character`,
          text: `Check out ${data?.result?.properties?.name} from Star Wars Universe`,
          url: url,
        });
      } catch (err) {
        copyToClipboard(url);
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleToggleFavorite = () => {
    if (data?.result?.properties?.name) {
      onToggleFavorite({
        uid: uid,
        name: data.result.properties.name
      });
    }
  };

  return (
    <Dialog open={!!uid} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm w-[90vw] sm:w-full">
        {/* Header without duplicate close button */}
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>
              {data?.result?.properties?.name || 'Character Details'}
            </DialogTitle>
          </VisuallyHidden>
          
          <VisuallyHidden>
            <DialogDescription>
              Detailed information about the Star Wars character
            </DialogDescription>
          </VisuallyHidden>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-3 p-4">
            <div className="space-y-2 text-center">
              <Skeleton className="h-5 w-32 mx-auto" />
              <Skeleton className="h-3 w-24 mx-auto" />
            </div>
            <div className="flex justify-center">
              <Skeleton className="h-20 w-20 rounded-full" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-3 w-3" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center space-y-3 p-4">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <div className="text-center">
              <h2 className="text-lg font-semibold">Error</h2>
              <p className="text-xs text-muted-foreground">
                Failed to load character details. Please try again.
              </p>
            </div>
          </div>
        )}

        {data?.result && (
          <div className="space-y-4 p-4">
            <div className="space-y-1 text-center">
              <h2 className="text-lg font-semibold">{data.result.properties.name}</h2>
              <p className="text-xs text-muted-foreground">Character Details</p>
            </div>

            <div className="flex justify-center">
              <img
                src={getCharacterImage(data.result.properties.name)}
                alt={data.result.properties.name}
                className="w-20 h-20 rounded-full bg-muted"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${data.result.properties.name}&background=random`;
                }}
              />
            </div>

            <div className="grid gap-2.5">
              <div className="flex items-center space-x-2">
                <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-xs font-medium min-w-0">Gender:</span>
                <span className="text-xs capitalize truncate">{formatValue(data.result.properties.gender)}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-xs font-medium min-w-0">Birth Year:</span>
                <span className="text-xs truncate">{formatValue(data.result.properties.birth_year)}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Ruler className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-xs font-medium min-w-0">Height:</span>
                <span className="text-xs truncate">
                  {formatValue(data.result.properties.height)}
                  {data.result.properties.height !== 'unknown' && data.result.properties.height !== 'n/a' && data.result.properties.height ? ' cm' : ''}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Weight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-xs font-medium min-w-0">Mass:</span>
                <span className="text-xs truncate">
                  {formatValue(data.result.properties.mass)}
                  {data.result.properties.mass !== 'unknown' && data.result.properties.mass !== 'n/a' && data.result.properties.mass ? ' kg' : ''}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Eye className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-xs font-medium min-w-0">Eye Color:</span>
                <span className="text-xs capitalize truncate">{formatValue(data.result.properties.eye_color)}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Users className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-xs font-medium min-w-0">Hair Color:</span>
                <span className="text-xs capitalize truncate">{formatValue(data.result.properties.hair_color)}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Palette className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-xs font-medium min-w-0">Skin Color:</span>
                <span className="text-xs capitalize truncate">{formatValue(data.result.properties.skin_color)}</span>
              </div>
            </div>

            {/* Action buttons at the bottom */}
            <div className="flex justify-center gap-2 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleFavorite}
                className="flex items-center gap-2"
              >
                <Heart 
                  className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
                />
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={shareCharacter}
                className="flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Copy className="h-4 w-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share className="h-4 w-4" />
                    Share
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}