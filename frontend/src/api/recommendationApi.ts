import { apiClient } from './client';
import { CrisisAnalysisResponse } from './crisisApi';

export const recommendationApi = {
  getRecommendation: async (crisisId: string): Promise<CrisisAnalysisResponse> => {
    return apiClient.get<CrisisAnalysisResponse>(`/recommendations/${crisisId}`);
  },

  regenerate: async (crisisId: string, objective: string = 'balanced'): Promise<CrisisAnalysisResponse> => {
    return apiClient.post<CrisisAnalysisResponse>(`/recommendations/${crisisId}/regenerate`, { objective });
  },
};
