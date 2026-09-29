import { apiClient } from './client';

export interface RegionalStockBreakdown {
  region: string;
  units: number;
  runway_days: number;
  status: string;
}

export interface ProductInventoryItem {
  product_id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  total_units: number;
  monthly_velocity: number;
  runway_days: number;
  expiry_days: number;
  risk_level: 'Critical' | 'Elevated' | 'Moderate' | 'Low';
  holding_cost_monthly: number;
  regional_breakdown: RegionalStockBreakdown[];
}

export interface InventorySummaryResponse {
  organization_id: string;
  total_inventory_units: number;
  total_inventory_value: number;
  total_at_risk_units: number;
  total_at_risk_value: number;
  revenue_impact_percentage: number;
  active_decisions_count: number;
  monitored_sku_count: number;
  monthly_holding_cost: number;
}

export interface InventoryRiskResponse {
  organization_id: string;
  critical_skus: number;
  elevated_skus: number;
  moderate_skus: number;
  low_risk_skus: number;
  at_risk_products: ProductInventoryItem[];
}

export const inventoryApi = {
  getSummary: async (): Promise<InventorySummaryResponse> => {
    return apiClient.get<InventorySummaryResponse>('/inventory/summary');
  },

  getRisk: async (): Promise<InventoryRiskResponse> => {
    return apiClient.get<InventoryRiskResponse>('/inventory/risk');
  },

  getInventory: async (): Promise<ProductInventoryItem[]> => {
    return apiClient.get<ProductInventoryItem[]>('/inventory');
  },

  getProduct: async (productId: string): Promise<ProductInventoryItem> => {
    return apiClient.get<ProductInventoryItem>(`/inventory/${productId}`);
  },
};
