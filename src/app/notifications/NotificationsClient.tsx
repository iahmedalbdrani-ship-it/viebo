"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { motion } from "framer-motion";
import {
  HiHeart,
  HiChatBubbleOvalLeft,
  HiUserPlus,
  HiChatBubbleLeftRight,
  HiAtSymbol,
} from "react-icons/hi2";

const iconMap = {
  like: HiHeart,
  comment: HiChatBubbleOvalLeft,
  follow: HiUserPlus,
  message: HiChatBubbleLeftRight,
  mention: HiAtSymbol,
};

const colorMap = {
  like: "text-accent bg-accent/10",
  comment: "text-secondary bg-secondary/10",
  follow: "text-primary bg-primary/10",
  message: "text-green-400 bg-green-400/10",
  mention: "text-yellow-400 bg-yellow-400/10",
};

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const { notifications, isLoading, subscribe } = useNotificationStore();

  useEffect(() => {
    if (!user?.userId) return;

    const unsubscribe = subscribe(user.userId);
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user?.userId, subscribe]);

  const timeAgo = (date: Date | string) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return "now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  return (
    <div className="max-w-lg mx-auto">
      <header className="sticky top-0 z-40 glass-dark px-6 py-4">
        <h1 className="text-xl font-bold text-text-primary">Notifications</h1>
      </header>

      <div className="divide-y divide-white/5">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notif, index) => {
            const Icon = iconMap[notif.type];
            const colorClass = colorMap[notif.type];
            return (
              <motion.div
                key={notif.notificationId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-3 p-4 ${
                  !notif.isRead ? "bg-primary/5" : ""
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-text-primary font-bold flex-shrink-0">
                  {notif.fromUserId.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="text-text-primary font-semibold">
                      {notif.fromUserId}
                    </span>{" "}
                    <span className="text-text-secondary">{notif.content}</span>
                  </p>
                  <p className="text-text-secondary text-xs mt-0.5">
                    {timeAgo(notif.createdAt)} ago
                  </p>
                </div>
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
