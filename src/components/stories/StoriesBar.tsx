"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { HiPlus } from "react-icons/hi2";

interface StoryUser {
  userId: string;
  username: string;
  avatar: string;
  hasStory: boolean;
  isViewed: boolean;
}

interface StoriesBarProps {
  stories: StoryUser[];
}

export default function StoriesBar({ stories }: StoriesBarProps) {
  return (
    <div className="flex gap-4 overflow-x-auto py-4 px-4 scrollbar-hide">
      {/* Add Story */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center gap-1.5 flex-shrink-0"
      >
        <div className="w-16 h-16 rounded-full bg-surface border-2 border-dashed border-primary/50 flex items-center justify-center">
          <HiPlus className="w-6 h-6 text-primary" />
        </div>
        <span className="text-text-secondary text-[11px]">Your Story</span>
      </motion.button>

      {/* Story Items */}
      {stories.map((story) => (
        <motion.button
          key={story.userId}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center gap-1.5 flex-shrink-0"
        >
          <div
            className={`w-16 h-16 rounded-full p-[2px] ${
              story.hasStory
                ? story.isViewed
                  ? "bg-text-secondary/30"
                  : "bg-gradient-to-br from-primary via-accent to-secondary"
                : "bg-transparent"
            }`}
          >
            <div className="w-full h-full rounded-full bg-dark overflow-hidden">
              {story.avatar ? (
                <Image
                  src={story.avatar}
                  alt={story.username}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-primary text-lg font-bold bg-surface">
                  {story.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <span className="text-text-secondary text-[11px] max-w-[64px] truncate">
            {story.username}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
