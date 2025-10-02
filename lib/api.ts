import { supabase } from './supabase';
import { SearchResult, QueryResponse } from './types';

/**
 * Search for acupressure points using semantic search via Supabase Edge Function
 * @param query - The search query (e.g., "mal de tête")
 * @param matchThreshold - Minimum similarity score (default: 0.7)
 * @param matchCount - Maximum number of results (default: 10)
 */
export async function searchPoints(
  query: string,
  matchThreshold: number = 0.7,
  matchCount: number = 10
): Promise<SearchResult[]> {
  try {
    const { data, error } = await supabase.functions.invoke('query', {
      body: {
        query,
        match_threshold: matchThreshold,
        match_count: matchCount,
      },
    });

    if (error) {
      console.error('Error searching points:', error);
      return [];
    }

    return data?.results || [];
  } catch (error) {
    console.error('Error in searchPoints:', error);
    return [];
  }
}

/**
 * Get a specific acupressure point by ID
 * @param id - The UUID of the point
 */
export async function getPointById(id: string) {
  try {
    const { data, error } = await supabase
      .from('points')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching point:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getPointById:', error);
    return null;
  }
}
