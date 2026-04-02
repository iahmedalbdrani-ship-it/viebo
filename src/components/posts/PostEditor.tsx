"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { updatePost } from "@/lib/firestore";
import toast from "react-hot-toast";
import { HiXMark } from "react-icons/hi2";
import type { Post } from "@/types";

interface PostEditorProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function PostEditor({
  post,
  isOpen,
  onClose,
  onSuccess,
}: PostEditorProps) {
  const { user } = useAuthStore();
  const [caption, setCaption] = useState(post.caption);
  const [location, setLocation] = useState(post.location);
  const [hashtags, setHashtags] = useState(post.hashtags.join(" "));
  const [visibility, setVisibility] = useState<"public" | "friends" | "private">(
    post.visibility as "public" | "friends" | "private"
  );
  const [isLoading, setIsLoading] = useState(false);

  if (!user || user.userId !== post.userId) return null;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const hashtagList = hashtags
        .split(" ")
        .filter((tag) => tag.startsWith("#"))
        .map((tag) => tag.toLowerCase());

      await updatePost(post.postId, {
        caption,
        location,
        hashtags: hashtagList,
        visibility,
      } as Partial<Post>);

      toast.success("Post updated!");
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass glass-dark rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 glass glass-dark border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-text-primary">Edit Post</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <HiXMark className="w-6 h-6 text-text-secondary" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Caption */}
                <div className="space-y-2">
                  <label className="text-sm text-text-secondary font-medium block">
                    Caption
                  </label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    maxLength={2200}
                    className="w-full bg-surface/50 border border-white/10 rounded-lg p-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary transition-colors resize-none h-24"
                  />
                  <p className="text-xs text-text-secondary">
                    {caption.length}/2200
                  </p>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="text-sm text-text-secondary font-medium block">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Edit location..."
                    className="w-full bg-surface/50 border border-white/10 rounded-lg p-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Hashtags */}
                <div className="space-y-2">
                  <label className="text-sm text-text-secondary font-medium block">
                    Hashtags
                  </label>
                  <input
                    type="text"
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    placeholder="#vibeo #trending #community"
                    className="w-full bg-surface/50 border border-white/10 rounded-lg p-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Visibility */}
                <div className="space-y-2">
                  <label className="text-sm text-text-secondary font-medium block">
                    Visibility
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["public", "friends", "private"] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => setVisibility(v)}
                        className={`p-3 rounded-lg border transition-all capitalize text-sm font-medium ${
                          visibility === v
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-white/10 bg-surface/50 text-text-secondary hover:border-white/20"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 glass glass-dark border-t border-white/10 px-6 py-4 flex gap-3 justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg bg-surface/50 hover:bg-surface border border-white/10 text-text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
