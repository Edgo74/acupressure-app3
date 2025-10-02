export interface AcupressurePoint {
  id: string;
  name: string;
  description: string;
  image: string;
  similarity?: number;
}

export interface SearchResult {
  id: string;
  name: string;
  description: string;
  image: string;
  similarity: number;
}

export interface QueryResponse {
  results: SearchResult[];
  error?: string;
}
