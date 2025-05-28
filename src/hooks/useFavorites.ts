import { useState, useEffect } from 'react';
import { FavoriteCharacter } from '@/types/swapi';

const FAVORITES_KEY = 'star-wars-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteCharacter[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse favorites from localStorage:', error);
      }
    }
  }, []);

  const addFavorite = (character: { uid: string; name: string }) => {
    const newFavorite: FavoriteCharacter = {
      uid: character.uid,
      name: character.name,
      addedAt: Date.now(),
    };
    
    const updatedFavorites = [...favorites, newFavorite];
    setFavorites(updatedFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  };

  const removeFavorite = (uid: string) => {
    const updatedFavorites = favorites.filter(fav => fav.uid !== uid);
    setFavorites(updatedFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  };

  const isFavorite = (uid: string) => {
    return favorites.some(fav => fav.uid === uid);
  };

  const toggleFavorite = (character: { uid: string; name: string }) => {
    if (isFavorite(character.uid)) {
      removeFavorite(character.uid);
    } else {
      addFavorite(character);
    }
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
}