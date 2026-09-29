import { apiClient } from './client';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  crisis_id?: string | null;
  created_at: string;
}

export const notificationApi = {
  getNotifications: async (unreadOnly: boolean = false): Promise<NotificationItem[]> => {
    return apiClient.get<NotificationItem[]>(`/notifications?unread_only=${unreadOnly}`);
  },

  markRead: async (notificationId: string): Promise<{ id: string; is_read: boolean; title: string }> => {
    return apiClient.patch<{ id: string; is_read: boolean; title: string }>(`/notifications/${notificationId}/read`);
  },

  markAllRead: async (): Promise<void> => {
    try {
      const unread = await notificationApi.getNotifications(true);
      await Promise.all(unread.map(n => notificationApi.markRead(n.id).catch(() => null)));
    } catch (e) {
      console.warn('Failed marking all notifications as read:', e);
    }
  },
};
