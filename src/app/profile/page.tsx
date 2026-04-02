"use client";

import { useState } from "react";
import ProfileCard from "@/components/profile/ProfileCard";
import type { User } from "@/types";

const mockUser: User = {
  userId: "current-user",
  email: "user@vibeo.com",
  username: "vibeo_user",
  displayName: "Vibeo User",
  avatar: "",
  bio: "Welcome to Vibeo! Where moments matter ✨",
  coverImage: "",
  followers: ["1", "2", "3"],
  following: ["1", "2"],
  createdAt: new Date(),
  isVerified: false,
  isPrivate: false,
  vibeScore: 42,
  preferences: { theme: "dark", notifications: true, privacy: "public" },
};

type Tab = "posts" | "stories" | "highlights" | "liked";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("posts");

  const tabs: { key: Tab; label: string }[] = [
    { key: "posts", label: "Posts" },
    { key: "stories", label: "Stories" },
    { key: "highlights", label: "Highlights" },
    { key: "liked", label: "Liked" },
  ];

  return (
    <div className="max-w-lg mx-auto">
      <ProfileCard user={mockUser} isOwnProfile />

      {/* Tabs */}
      <div className="flex mt-6 border-b border-white/5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.key
                ? "text-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="p-4">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-3">
            <span className="text-2xl">
              {activeTab === "posts" && "📸"}
              {activeTab === "stories" && "📖"}
              {activeTab === "highlights" && "⭐"}
              {activeTab === "liked" && "❤️"}
            </span>
          </div>
          <h3 className="text-text-primary font-semibold mb-1">
            No {activeTab} yet
          </h3>
          <p className="text-text-secondary text-sm">
            {activeTab === "posts"
              ? "Share your first moment with the world!"
              : `Your ${activeTab} will appear here.`}
          </p>
        </div>
      </div>
    </div>
  );
}
