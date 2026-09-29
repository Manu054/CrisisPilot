import { apiClient } from './client';

export interface MemoryCaseItem {
  case_id: string;
  case_number: number;
  date: string;
  title: string;
  product: string;
  similarity_score: number;
  problem: string;
  decision_taken: string;
  outcome_metric: string;
  status: string;
  financial_impact: string;
  margin_impact: string;
  revenue_impact: string;
  expected_outcome: string;
  actual_outcome: string;
  lesson_learned: string;
  tags: string[];
  region?: string;
  reusability_score?: string;
}

export interface MemoryInsightItem {
  id: string;
  text: string;
  category: string;
  supporting_case_count: number;
  confidence: number;
  last_observed: string;
  related_products: string[];
  related_strategies: string[];
  empirical_rule: string;
  impact_metric: string;
}

export interface MemorySearchResponse {
  query: string;
  total_memories: number;
  memories: Array<{
    content?: string;
    text?: string;
    similarity?: number;
    tags?: string[];
    metadata?: Record<string, any>;
  }>;
  reflections?: string;
}

export interface MemoryRetainPayload {
  content: string;
  tags?: string[];
  document_id?: string;
  context_metadata?: Record<string, any>;
}

export const memoryApi = {
  search: async (query: string, maxResults: number = 5): Promise<MemorySearchResponse> => {
    return apiClient.get<MemorySearchResponse>(`/memory/search?query=${encodeURIComponent(query)}&max_results=${maxResults}`);
  },

  getCases: async (query?: string, limit: number = 20): Promise<MemoryCaseItem[]> => {
    const q = query ? `?query=${encodeURIComponent(query)}&limit=${limit}` : `?limit=${limit}`;
    return apiClient.get<MemoryCaseItem[]>(`/memory/cases${q}`);
  },

  getInsights: async (): Promise<MemoryInsightItem[]> => {
    return apiClient.get<MemoryInsightItem[]>('/memory/insights');
  },

  retain: async (payload: MemoryRetainPayload): Promise<any> => {
    return apiClient.post<any>('/memory/retain', payload);
  },
};
