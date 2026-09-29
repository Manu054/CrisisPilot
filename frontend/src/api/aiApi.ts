import { apiClient } from './client';

export interface AIChatPayload {
  message: string;
  crisis_id?: string | null;
  conversation_id?: string | null;
}

export interface AIChatResponse {
  reply: string;
  cited_precedents: Array<{
    title?: string;
    content?: string;
    text?: string;
    similarity?: number;
    case_number?: number;
    lesson?: string;
    [key: string]: any;
  }>;
  suggested_actions: string[];
}

export const aiApi = {
  chat: async (payload: AIChatPayload): Promise<AIChatResponse> => {
    return apiClient.post<AIChatResponse>('/ai/chat', payload);
  },
};
