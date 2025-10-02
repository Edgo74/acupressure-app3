import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useFavorites } from '../state/favorites';
import { getPointById } from '../lib/api';
import PointCard from '../components/PointCard';
import EmptyState from '../components/EmptyState';
import { SearchResult } from '../lib/types';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites } = useFavorites();
  const [points, setPoints] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavoritePoints();
  }, [favorites]);

  const loadFavoritePoints = async () => {
    setLoading(true);
    try {
      const pointsData = await Promise.all(
        favorites.map((id) => getPointById(id))
      );
      const validPoints = pointsData.filter((p) => p !== null) as SearchResult[];
      setPoints(validPoints);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePointPress = (id: string) => {
    router.push(`/point/${id}`);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={points}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PointCard
            point={item}
            onPress={() => handlePointPress(item.id)}
          />
        )}
        contentContainerStyle={points.length === 0 ? styles.emptyContainer : styles.listContent}
        ListEmptyComponent={
          <EmptyState
            message="Aucun favori"
            subtitle="Ajoutez des points à vos favoris pour les retrouver ici"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 16,
  },
});
