import { apiClient } from './client';

export interface SimulationParamsInput {
  product?: string;
  inventory_units: number;
  monthly_sales: number;
  price: number;
  cost: number;
  expiry_days: number;
  discount_percentage: number;
  promotion_duration: number;
  promotion_lift?: number;
  regional_allocation?: string;
  campaign_budget?: number;
}

export interface SimulationTimelinePoint {
  day: number;
  clearance_pct: number;
  revenue: number;
  remaining_stock: number;
}

export interface SimulationResultOutput {
  inventory_clearance_percentage: number;
  cleared_units: number;
  remaining_inventory: number;
  estimated_revenue: number;
  estimated_margin: number;
  estimated_margin_change: number;
  estimated_clearance_days: number;
  risk_score: string;
  timeline_projection: SimulationTimelinePoint[];
}

export interface ScenarioComparisonItem {
  scenario_id: string;
  name: string;
  parameters: Record<string, any>;
  result: SimulationResultOutput;
}

export interface SimulationScenarioCompareResponse {
  product: string;
  scenarios: ScenarioComparisonItem[];
}

export interface SimulationScenarioComparePayload {
  product?: string;
  inventory_units: number;
  monthly_sales: number;
  price: number;
  cost: number;
  expiry_days: number;
  scenarios?: Array<Record<string, any>>;
}

export const simulationApi = {
  runSimulation: async (params: SimulationParamsInput): Promise<SimulationResultOutput> => {
    return apiClient.post<SimulationResultOutput>('/simulations', params);
  },

  compareScenarios: async (payload: SimulationScenarioComparePayload): Promise<SimulationScenarioCompareResponse> => {
    return apiClient.post<SimulationScenarioCompareResponse>('/simulations/compare', payload);
  },
};
