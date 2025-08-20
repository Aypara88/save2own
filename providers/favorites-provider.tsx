import createContextHook from "@nkzw/create-context-hook";
import { useEffect, useState, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FavoritesState {
  favorites: string[];
  isLoading: boolean;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

export const [FavoritesProvider, useFavorites] = createContextHook<FavoritesState>(() => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem("favorites");
        const ids: string[] = raw ? JSON.parse(raw) : [];
        setFavorites(Array.isArray(ids) ? ids : []);
      } catch (e) {
        console.error("favorites: load error", e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const persist = useCallback(async (ids: string[]) => {
    try {
      await AsyncStorage.setItem("favorites", JSON.stringify(ids));
    } catch (e) {
      console.error("favorites: save error", e);
    }
  }, []);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter(id => id !== productId) : [productId, ...prev];
      persist(next);
      return next;
    });
  }, [persist]);

  const isFavorite = useCallback((productId: string) => favorites.includes(productId), [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    persist([]);
  }, [persist]);

  return useMemo(() => ({ favorites, isLoading, toggleFavorite, isFavorite, clearFavorites }), [favorites, isLoading, toggleFavorite, isFavorite, clearFavorites]);
});