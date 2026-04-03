export interface Notification {
  id: string;
  type: string;
  is_read: boolean;
  title?: string;
  message?: string;
  action_url?: string;
  created_at: string;
}

export function useNotifications() {
  return {
    notifications: [] as Notification[],
    unreadCount: 0,
    loading: false,
    markAsRead: async (_id: string) => {},
    refetch: async () => {},
  };
}
