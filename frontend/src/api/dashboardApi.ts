import { apiClient } from './client';
import { CrisisResponse } from './crisisApi';
import { DecisionResponse } from './decisionApi';

export interface DashboardSummary {
  organization_id: string;
  total_inventory: number;
  at_risk_inventory: number;
  revenue_impact_percent: number;
  active_decisions: number;
  monitored_skus: number;
  monthly_holding_cost: number;
}

export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummary> => {
    return apiClient.get<DashboardSummary>('/dashboard/summary');
  },

  getActiveCrises: async (): Promise<CrisisResponse[]> => {
    return apiClient.get<CrisisResponse[]>('/dashboard/active-crises');
  },

  getRecentDecisions: async (): Promise<DecisionResponse[]> => {
    return apiClient.get<DecisionResponse[]>('/dashboard/recent-decisions');
  },
};
