"use client";

import { useState } from "react";
import StoriesBar from "@/components/stories/StoriesBar";
import PostCard from "@/components/feed/PostCard";
import type { Post } from "@/types";

const mockStories = [
  { userId: "1", username: "alex_dev", avatar: "", hasStory: true, isViewed: false },
  { userId: "2", username: "sara.design", avatar: "", hasStory: true, isViewed: false },
  { userId: "3", username: "mike_photo", avatar: "", hasStory: true, isViewed: true },
  { userId: "4", username: "jess.music", avatar: "", hasStory: true, isViewed: false },
  { userId: "5", username: "tom_travel", avatar: "", hasStory: true, isViewed: true },
  { userId: "6", username: "luna.art", avatar: "", hasStory: true, isViewed: false },
];

const mockPosts: (Post & { authorName: string; authorAvatar: string })[] = [
  {
    postId: "1",
    userId: "1",
    content: "",
    mediaUrls: [],
    type: "text",
    caption: "Just launched my new project! Check it out and let me know what you think 🚀",
    hashtags: ["coding", "webdev", "launch"],
    mentions: [],
    location: "San Francisco, CA",
    likes: [],
    likeCount: 128,
    commentCount: 24,
    shareCount: 12,
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 3600000),
    isEdited: false,
    visibility: "public",
    authorName: "alex_dev",
    authorAvatar: "",
  },
  {
    postId: "2",
    userId: "2",
    content: "",
    mediaUrls: [],
    type: "text",
    caption: "New design system is coming together beautifully. Dark mode is always the way to go ✨",
    hashtags: ["design", "ui", "darkmode"],
    mentions: [],
    location: "New York, NY",
    likes: [],
    likeCount: 256,
    commentCount: 42,
    shareCount: 18,
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 7200000),
    isEdited: false,
    visibility: "public",
    authorName: "sara.design",
    authorAvatar: "",
  },
  {
    postId: "3",
    userId: "3",
    content: "",
    mediaUrls: [],
    type: "text",
    caption: "Golden hour photography hits different when you are at the beach 📸🌅",
    hashtags: ["photography", "goldenhour", "beach"],
    mentions: [],
    location: "Malibu, CA",
    likes: [],
    likeCount: 512,
    commentCount: 67,
    shareCount: 34,
    createdAt: new Date(Date.now() - 14400000),
    updatedAt: new Date(Date.now() - 14400000),
    isEdited: false,
    visibility: "public",
    authorName: "mike_photo",
    authorAvatar: "",
  },
];

export default function Home() {
  const [posts] = useState(mockPosts);

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-dark px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Vibeo
          </h1>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-text-secondary hover:text-text-primary transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </button>
          </div>
        </div>
      </header>

      {/* Stories */}
      <StoriesBar stories={mockStories} />

      {/* Divider */}
      <div className="h-px bg-white/5 mx-4" />

      {/* Feed */}
      <div className="space-y-4 p-4">
        {posts.map((post) => (
          <PostCard
            key={post.postId}
            post={post}
            authorName={post.authorName}
            authorAvatar={post.authorAvatar}
          />
        ))}
      </div>
    </div>
  );
}
