import React, { useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import SearchBar from '../components/SearchBar';
import PointCard from '../components/PointCard';
import EmptyState from '../components/EmptyState';
import { searchPoints } from '../lib/api';
import { SearchResult } from '../lib/types';

export default function SearchScreen() {
  const router = useRouter();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const data = await searchPoints(query);
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePointPress = (id: string) => {
    router.push(`/point/${id}`);
  };

  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleSearch} />

      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.favoritesButton}
          onPress={() => router.push('/favorites')}
        >
          <Text style={styles.favoritesText}>❤️ Favoris</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1976d2" />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PointCard
              point={item}
              onPress={() => handlePointPress(item.id)}
            />
          )}
          contentContainerStyle={results.length === 0 ? styles.emptyContainer : styles.listContent}
          ListEmptyComponent={
            hasSearched ? (
              <EmptyState
                message="Aucun résultat"
                subtitle="Essayez une autre recherche"
              />
            ) : (
              <EmptyState
                message="Rechercher un point d'acupression"
                subtitle="Ex: mal de tête, stress, douleur..."
              />
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  favoritesButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  favoritesText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
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
    paddingBottom: 16,
  },
});
