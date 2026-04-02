"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HiPaperAirplane, HiPhoto, HiFaceSmile } from "react-icons/hi2";
import type { Message } from "@/types";

interface ChatViewProps {
  messages: Message[];
  currentUserId: string;
  onSend: (content: string) => void;
}

export default function ChatView({ messages, currentUserId, onSend }: ChatViewProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => {
          const isMine = msg.senderId === currentUserId;
          return (
            <motion.div
              key={msg.messageId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                  isMine
                    ? "bg-primary text-white rounded-br-md"
                    : "bg-surface text-text-primary rounded-bl-md"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p
                  className={`text-[10px] mt-1 ${
                    isMine ? "text-white/60" : "text-text-secondary"
                  }`}
                >
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <button className="p-2 text-text-secondary hover:text-text-primary transition-colors">
            <HiPhoto className="w-6 h-6" />
          </button>
          <button className="p-2 text-text-secondary hover:text-text-primary transition-colors">
            <HiFaceSmile className="w-6 h-6" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-surface rounded-full px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary outline-none focus:ring-1 focus:ring-primary/50"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2.5 bg-primary rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <HiPaperAirplane className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
