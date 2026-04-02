"use client";

import { useState } from "react";
import { HiMagnifyingGlass, HiPencilSquare } from "react-icons/hi2";
import ConversationList from "@/components/messages/ConversationList";

const mockConversations = [
  {
    conversationId: "1",
    participantName: "Sara Design",
    participantAvatar: "",
    lastMessage: "That looks amazing! Can you share the design file?",
    lastMessageAt: new Date(Date.now() - 300000),
    unreadCount: 2,
    isOnline: true,
  },
  {
    conversationId: "2",
    participantName: "Mike Photo",
    participantAvatar: "",
    lastMessage: "Let's meet up for a photoshoot this weekend!",
    lastMessageAt: new Date(Date.now() - 3600000),
    unreadCount: 0,
    isOnline: false,
  },
  {
    conversationId: "3",
    participantName: "Jess Music",
    participantAvatar: "",
    lastMessage: "New track dropping tonight 🎵",
    lastMessageAt: new Date(Date.now() - 7200000),
    unreadCount: 1,
    isOnline: true,
  },
];

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = mockConversations.filter((c) =>
    c.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-dark px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-text-primary">Messages</h1>
          <button className="p-2 text-text-secondary hover:text-text-primary transition-colors">
            <HiPencilSquare className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-surface rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
      </header>

      <ConversationList
        conversations={filteredConversations}
        onSelect={(id) => console.log("Selected:", id)}
      />
    </div>
  );
}
