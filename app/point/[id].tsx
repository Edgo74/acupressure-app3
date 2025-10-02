import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getPointById } from '../../lib/api';
import { AcupressurePoint } from '../../lib/types';
import { useFavorites } from '../../state/favorites';

export default function PointDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [point, setPoint] = useState<AcupressurePoint | null>(null);
  const [loading, setLoading] = useState(true);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorite = id ? isFavorite(id) : false;

  useEffect(() => {
    if (id) {
      loadPoint(id);
    }
  }, [id]);

  const loadPoint = async (pointId: string) => {
    setLoading(true);
    try {
      const data = await getPointById(pointId);
      setPoint(data);
    } catch (error) {
      console.error('Error loading point:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
    if (!id) return;

    if (favorite) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  if (!point) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Point non trouvé</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: point.image }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{point.name}</Text>
          <Pressable onPress={toggleFavorite} hitSlop={8}>
            <Text style={styles.favoriteIcon}>
              {favorite ? '❤️' : '🤍'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{point.description}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  favoriteIcon: {
    fontSize: 32,
    marginLeft: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#999',
  },
});
