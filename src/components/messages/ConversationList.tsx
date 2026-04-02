"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface ConversationPreview {
  conversationId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number;
  isOnline: boolean;
}

interface ConversationListProps {
  conversations: ConversationPreview[];
  onSelect: (conversationId: string) => void;
}

export default function ConversationList({
  conversations,
  onSelect,
}: ConversationListProps) {
  const timeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center mb-4">
          <span className="text-3xl">💬</span>
        </div>
        <h3 className="text-text-primary font-semibold text-lg mb-1">
          No messages yet
        </h3>
        <p className="text-text-secondary text-sm">
          Start a conversation with someone!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {conversations.map((conv, index) => (
        <motion.button
          key={conv.conversationId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSelect(conv.conversationId)}
          className="flex items-center gap-3 p-4 hover:bg-surface/50 transition-colors text-left"
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-full bg-surface overflow-hidden">
              {conv.participantAvatar ? (
                <Image
                  src={conv.participantAvatar}
                  alt={conv.participantName}
                  width={56}
                  height={56}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-primary font-bold text-lg bg-gradient-to-br from-primary/30 to-accent/30">
                  {conv.participantName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {conv.isOnline && (
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-dark" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <p
                className={`text-sm font-semibold truncate ${
                  conv.unreadCount > 0
                    ? "text-text-primary"
                    : "text-text-secondary"
                }`}
              >
                {conv.participantName}
              </p>
              <span className="text-text-secondary text-xs flex-shrink-0 ml-2">
                {timeAgo(conv.lastMessageAt)}
              </span>
            </div>
            <p
              className={`text-sm truncate ${
                conv.unreadCount > 0
                  ? "text-text-primary font-medium"
                  : "text-text-secondary"
              }`}
            >
              {conv.lastMessage}
            </p>
          </div>

          {/* Unread badge */}
          {conv.unreadCount > 0 && (
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[10px] font-bold">
                {conv.unreadCount}
              </span>
            </div>
          )}
        </motion.button>
      ))}
    </div>
  );
}
