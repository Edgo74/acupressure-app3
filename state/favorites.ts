import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@acupressure_favorites';

interface FavoritesState {
  favorites: string[];
  isLoading: boolean;
  loadFavorites: () => Promise<void>;
  addFavorite: (id: string) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
}

export const useFavorites = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoading: false,

  loadFavorites: async () => {
    set({ isLoading: true });
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        set({ favorites: JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addFavorite: async (id: string) => {
    const current = get().favorites;
    if (!current.includes(id)) {
      const updated = [...current, id];
      set({ favorites: updated });
      try {
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving favorite:', error);
      }
    }
  },

  removeFavorite: async (id: string) => {
    const current = get().favorites;
    const updated = current.filter((fav) => fav !== id);
    set({ favorites: updated });
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  },

  isFavorite: (id: string) => {
    return get().favorites.includes(id);
  },
}));
