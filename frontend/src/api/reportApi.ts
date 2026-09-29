import { apiClient } from './client';

export interface ReportItem {
  id: string;
  organization_id: string;
  crisis_id: string;
  title: string;
  content: {
    executive_summary?: string;
    current_situation?: Record<string, any>;
    historical_evidence?: any[];
    strategies_evaluated?: any[];
    recommendation?: Record<string, any>;
    risks?: any[];
    assumptions?: any[];
    action_plan?: any[];
    actual_outcome?: any;
    [key: string]: any;
  };
  created_at: string;
}

export const reportApi = {
  createReport: async (crisisId: string, title?: string): Promise<ReportItem> => {
    return apiClient.post<ReportItem>('/reports', {
      crisis_id: crisisId,
      title: title || 'Executive Crisis Intelligence Report',
    });
  },

  getReports: async (): Promise<ReportItem[]> => {
    return apiClient.get<ReportItem[]>('/reports');
  },

  getReport: async (reportId: string): Promise<ReportItem> => {
    return apiClient.get<ReportItem>(`/reports/${reportId}`);
  },
};
