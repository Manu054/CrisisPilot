import { apiClient } from './client';

export interface CrisisCreatePayload {
  title: string;
  crisis_type: string;
  description: string;
  product_id?: string;
  severity?: string;
  status?: string;
  input_data?: Record<string, any>;
}

export interface CrisisResponse {
  id: string;
  organization_id: string;
  title: string;
  crisis_type: string;
  description: string;
  product_id?: string | null;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'analyzing' | 'recommendation_ready' | 'decision_made' | 'resolved' | 'archived';
  input_data: Record<string, any>;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface HistoricalEvidenceItem {
  case_id: string;
  case_number?: number;
  title: string;
  date?: string;
  product?: string;
  similarity: number;
  problem: string;
  strategy_used?: string;
  decision_taken?: string;
  outcome: string;
  inventory_cleared_pct?: number;
  cleared?: string;
  margin_impact?: string;
  financial_impact?: string;
  revenue_impact?: string;
  expected_outcome?: string;
  actual_outcome?: string;
  lesson_learned: string;
  tags?: string[];
  region?: string;
  relevance_explanation?: string;
}

export interface StrategySimulationItem {
  id?: string;
  name: string;
  strategy_type?: string;
  is_recommended?: boolean;
  projected_clearance: number; // 0.0 - 1.0
  cleared_units?: number;
  remaining_inventory?: number;
  projected_revenue: number;
  projected_margin: number; // percentage
  margin_change: number; // fraction, e.g. -0.18
  days_to_clear: number;
  risk: string;
  risk_score?: string;
  parameters?: Record<string, any>;
  timeline_projection?: Array<{
    day: number;
    clearance_pct: number;
    revenue: number;
    remaining_stock: number;
  }>;
}

export interface RecommendationData {
  strategy: string;
  reasoning: string;
  confidence: number;
  expected_impact: {
    inventory_clearance: number;
    revenue: number;
    margin_change: number;
    days_to_clear: number;
  };
  risks: string[] | Array<{ risk: string; severity: string; mitigation?: string }>;
  assumptions: string[];
  alternative_strategies: string[];
  next_steps?: string[];
}

export interface CrisisAnalysisResponse {
  crisis: CrisisResponse;
  historical_evidence: HistoricalEvidenceItem[];
  strategies: StrategySimulationItem[];
  recommendation: RecommendationData;
}

export const crisisApi = {
  getCrises: async (): Promise<CrisisResponse[]> => {
    return apiClient.get<CrisisResponse[]>('/crises');
  },

  getCrisis: async (id: string): Promise<CrisisResponse> => {
    return apiClient.get<CrisisResponse>(`/crises/${id}`);
  },

  createCrisis: async (payload: CrisisCreatePayload): Promise<CrisisResponse> => {
    return apiClient.post<CrisisResponse>('/crises', payload);
  },

  updateCrisis: async (id: string, payload: Partial<CrisisCreatePayload>): Promise<CrisisResponse> => {
    return apiClient.patch<CrisisResponse>(`/crises/${id}`, payload);
  },

  deleteCrisis: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/crises/${id}`);
  },

  analyzeCrisis: async (id: string, objective: string = 'balanced'): Promise<CrisisAnalysisResponse> => {
    return apiClient.post<CrisisAnalysisResponse>(`/crises/${id}/analyze`, { objective });
  },

  getAnalysisStreamUrl: (id: string): string => {
    const token = localStorage.getItem('crisispilot_token') || '';
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
    return `${base}/crises/${id}/analysis-stream?token=${encodeURIComponent(token)}`;
  },
};
