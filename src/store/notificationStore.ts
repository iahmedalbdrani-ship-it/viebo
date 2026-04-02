import { create } from "zustand";
import { onNotificationsUpdate } from "@/lib/firestore";
import type { Notification } from "@/types";
import type { Unsubscribe } from "firebase/firestore";

interface NotificationStore {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  subscribe: (userId: string) => Unsubscribe | null;
  markAsRead: (notificationId: string) => void;
  clearError: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  isLoading: true,
  error: null,

  subscribe: (userId: string) => {
    if (!userId) return null;

    const unsubscribe = onNotificationsUpdate(userId, (notifications) => {
      set({
        notifications: notifications as Notification[],
        isLoading: false,
      });
    });

    return unsubscribe;
  },

  markAsRead: (notificationId: string) => {
    set((state) => ({
      notifications: state.notifications.map((notif) =>
        notif.notificationId === notificationId
          ? { ...notif, isRead: true }
          : notif
      ),
    }));
  },

  clearError: () => set({ error: null }),
}));
