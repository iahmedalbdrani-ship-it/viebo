"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { addStoryReaction, removeStoryReaction, addStoryView } from "@/lib/firestore";
import toast from "react-hot-toast";
import type { Story } from "@/types";

interface StoryViewProps {
  story: Story & { storyId: string; authorName: string; authorAvatar: string };
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

const REACTION_EMOJIS = ["❤️", "😂", "😍", "🔥", "👏", "😮", "🤔", "😢"];

export default function StoryView({
  story,
  onClose,
  onNext,
  onPrev,
}: StoryViewProps) {
  const { user } = useAuthStore();
  const [reactions, setReactions] = useState<Record<string, string>>(story.reactions || {});
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Track view when story is opened
    if (user?.userId && !story.views.includes(user.userId)) {
      addStoryView(story.storyId, user.userId).catch(console.error);
    }
  }, [story.storyId, story.views, user?.userId]);

  const userReaction = user?.userId ? reactions[user.userId] : null;

  const handleReaction = async (emoji: string) => {
    if (!user?.userId) {
      toast.error("Please log in to react");
      return;
    }

    setIsLoading(true);
    try {
      if (userReaction === emoji) {
        // Remove reaction
        await removeStoryReaction(story.storyId, user.userId);
        setReactions((prev) => {
          const next = { ...prev };
          delete next[user.userId];
          return next;
        });
      } else {
        // Add or change reaction
        await addStoryReaction(story.storyId, user.userId, emoji);
        setReactions((prev) => ({
          ...prev,
          [user.userId]: emoji,
        }));
      }
      setShowReactionPicker(false);
    } catch (error) {
      console.error("Error reacting to story:", error);
      toast.error("Failed to add reaction");
    } finally {
      setIsLoading(false);
    }
  };

  const reactionCounts = Object.values(reactions).reduce(
    (acc, emoji) => {
      acc[emoji] = (acc[emoji] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      onClick={onClose}
    >
      {/* Story Content */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full h-full max-w-md max-h-screen bg-black"
      >
        {/* Media */}
        <Image
          src={story.mediaUrl}
          alt="Story"
          fill
          className="object-cover"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            {story.authorAvatar && (
              <Image
                src={story.authorAvatar}
                alt={story.authorName}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <div>
              <p className="text-white font-semibold text-sm">
                {story.authorName}
              </p>
              <p className="text-white/70 text-xs">
                {new Date(
                  typeof story.createdAt === "string"
                    ? story.createdAt
                    : story.createdAt.toString()
                ).toLocaleDateString()}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Caption */}
        {story.caption && (
          <div className="absolute bottom-32 left-0 right-0 px-4">
            <p className="text-white text-sm">{story.caption}</p>
          </div>
        )}

        {/* Reactions Display */}
        {Object.keys(reactionCounts).length > 0 && (
          <div className="absolute bottom-24 left-4 right-4 flex flex-wrap gap-2">
            {Object.entries(reactionCounts).map(([emoji, count]) => (
              <motion.button
                key={emoji}
                whileHover={{ scale: 1.1 }}
                onClick={() => handleReaction(emoji)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                  userReaction === emoji
                    ? "bg-white text-black"
                    : "bg-white/30 text-white hover:bg-white/40"
                }`}
              >
                <span>{emoji}</span>
                <span>{count}</span>
              </motion.button>
            ))}
          </div>
        )}

        {/* Reaction Picker / Add Reaction Button */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
          {showReactionPicker ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-1 bg-black/70 backdrop-blur p-2 rounded-full w-full flex-wrap justify-center"
            >
              {REACTION_EMOJIS.map((emoji) => (
                <motion.button
                  key={emoji}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleReaction(emoji)}
                  disabled={isLoading}
                  className="text-2xl hover:bg-white/20 p-2 rounded-full transition-colors disabled:opacity-50"
                >
                  {emoji}
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowReactionPicker(true)}
              className="flex-1 bg-white/30 hover:bg-white/40 text-white rounded-full py-2 font-semibold transition-all text-sm"
            >
              {userReaction ? `${userReaction} React` : "😊 React"}
            </motion.button>
          )}
        </div>

        {/* Navigation Arrows */}
        {onPrev && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 p-3 rounded-full transition-colors z-10"
          >
            ‹
          </button>
        )}

        {onNext && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 p-3 rounded-full transition-colors z-10"
          >
            ›
          </button>
        )}

        {/* View Count */}
        <div className="absolute bottom-4 right-4 text-white text-xs text-white/70">
          <p>👁️ {story.viewCount} views</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
