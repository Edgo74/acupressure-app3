import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { SearchResult } from '../lib/types';
import { useFavorites } from '../state/favorites';

interface PointCardProps {
  point: SearchResult;
  onPress: () => void;
}

export default function PointCard({ point, onPress }: PointCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorite = isFavorite(point.id);

  const toggleFavorite = () => {
    if (favorite) {
      removeFavorite(point.id);
    } else {
      addFavorite(point.id);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image
        source={{ uri: point.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {point.name}
          </Text>
          <Pressable onPress={toggleFavorite} hitSlop={8}>
            <Text style={styles.favoriteIcon}>
              {favorite ? '❤️' : '🤍'}
            </Text>
          </Pressable>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {point.description}
        </Text>
        {point.similarity !== undefined && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {Math.round(point.similarity * 100)}% match
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  favoriteIcon: {
    fontSize: 24,
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
});
