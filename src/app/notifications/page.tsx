"use client";

import { motion } from "framer-motion";
import {
  HiHeart,
  HiChatBubbleOvalLeft,
  HiUserPlus,
  HiChatBubbleLeftRight,
  HiAtSymbol,
} from "react-icons/hi2";

const mockNotifications = [
  {
    id: "1",
    type: "like" as const,
    from: "sara.design",
    content: "liked your post",
    time: "2m",
    isRead: false,
  },
  {
    id: "2",
    type: "comment" as const,
    from: "mike_photo",
    content: 'commented: "This is amazing!"',
    time: "15m",
    isRead: false,
  },
  {
    id: "3",
    type: "follow" as const,
    from: "jess.music",
    content: "started following you",
    time: "1h",
    isRead: true,
  },
  {
    id: "4",
    type: "mention" as const,
    from: "alex_dev",
    content: "mentioned you in a post",
    time: "3h",
    isRead: true,
  },
  {
    id: "5",
    type: "message" as const,
    from: "tom_travel",
    content: "sent you a message",
    time: "5h",
    isRead: true,
  },
];

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
  return (
    <div className="max-w-lg mx-auto">
      <header className="sticky top-0 z-40 glass-dark px-6 py-4">
        <h1 className="text-xl font-bold text-text-primary">Notifications</h1>
      </header>

      <div className="divide-y divide-white/5">
        {mockNotifications.map((notif, index) => {
          const Icon = iconMap[notif.type];
          const colorClass = colorMap[notif.type];
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-3 p-4 ${
                !notif.isRead ? "bg-primary/5" : ""
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-text-primary font-bold flex-shrink-0">
                {notif.from.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="text-text-primary font-semibold">
                    {notif.from}
                  </span>{" "}
                  <span className="text-text-secondary">{notif.content}</span>
                </p>
                <p className="text-text-secondary text-xs mt-0.5">
                  {notif.time} ago
                </p>
              </div>
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
