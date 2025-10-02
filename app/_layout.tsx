import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useFavorites } from '../state/favorites';

export default function RootLayout() {
  const loadFavorites = useFavorites((state) => state.loadFavorites);

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Recherche',
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="point/[id]"
        options={{
          title: 'Détail',
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="favorites"
        options={{
          title: 'Favoris',
          presentation: 'card',
        }}
      />
    </Stack>
  );
}
