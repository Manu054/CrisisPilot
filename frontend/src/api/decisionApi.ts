import { apiClient } from './client';

export interface DecisionOutcomePayload {
  inventory_cleared: number;
  revenue: number;
  margin: number;
  customer_response?: string;
  time_to_clear: number;
  notes?: string;
}

export interface DecisionCreatePayload {
  crisis_id: string;
  strategy_type: string;
  parameters: Record<string, any>;
  expected_outcome?: Record<string, any>;
}

export interface DecisionResponse {
  id: string;
  crisis_id: string;
  organization_id: string;
  strategy_type: string;
  parameters: Record<string, any>;
  expected_outcome: Record<string, any>;
  actual_outcome?: Record<string, any> | null;
  status: 'pending' | 'executed' | 'completed' | 'cancelled';
  created_at: string;
  executed_at?: string | null;
  completed_at?: string | null;
}

export interface OutcomeRecordResponse {
  status: string;
  decision_id: string;
  outcome_id: string;
  hindsight_memory_updated: boolean;
}

export const decisionApi = {
  getDecisions: async (): Promise<DecisionResponse[]> => {
    return apiClient.get<DecisionResponse[]>('/decisions');
  },

  getDecision: async (id: string): Promise<DecisionResponse> => {
    return apiClient.get<DecisionResponse>(`/decisions/${id}`);
  },

  createDecision: async (payload: DecisionCreatePayload): Promise<DecisionResponse> => {
    return apiClient.post<DecisionResponse>('/decisions', payload);
  },

  executeDecision: async (id: string): Promise<DecisionResponse> => {
    return apiClient.post<DecisionResponse>(`/decisions/${id}/execute`);
  },

  recordOutcome: async (id: string, payload: DecisionOutcomePayload): Promise<OutcomeRecordResponse> => {
    return apiClient.post<OutcomeRecordResponse>(`/decisions/${id}/outcome`, payload);
  },
};
