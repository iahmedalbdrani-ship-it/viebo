"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { createPost } from "@/lib/firestore";
import toast from "react-hot-toast";
import {
  HiXMark,
  HiCamera,
  HiPhoto,
  HiMapPin,
  HiHashtag,
  HiLockClosed,
  HiUserGroup,
  HiGlobeAlt,
} from "react-icons/hi2";

interface PostCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type MediaType = "image" | "video" | null;
type VisibilityType = "public" | "friends" | "private";

export default function PostCreationModal({
  isOpen,
  onClose,
  onSuccess,
}: PostCreationModalProps) {
  const { user } = useAuthStore();
  const [mediaType, setMediaType] = useState<MediaType>(null);
  const [mediaPreview, setMediaPreview] = useState<string>("");
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [visibility, setVisibility] = useState<VisibilityType>("public");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video");
    const isImage = file.type.startsWith("image");

    if (!isVideo && !isImage) {
      toast.error("Please select a valid image or video file");
      return;
    }

    setMediaType(isVideo ? "video" : "image");

    const reader = new FileReader();
    reader.onload = (event) => {
      setMediaPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCreatePost = async () => {
    if (!user.userId) return;

    if (!caption.trim()) {
      toast.error("Please add a caption to your post");
      return;
    }

    setIsLoading(true);
    try {
      // Parse hashtags
      const hashtagList = hashtags
        .split(" ")
        .filter((tag) => tag.startsWith("#"))
        .map((tag) => tag.toLowerCase());

      // In a real app, upload media to Firebase Storage first
      // For now, using placeholder URL
      const postData = {
        userId: user.userId,
        content: caption,
        mediaUrls: mediaPreview ? [mediaPreview] : [],
        type: mediaType || ("text" as const),
        caption,
        hashtags: hashtagList,
        mentions: [],
        location,
        likes: [],
        likeCount: 0,
        commentCount: 0,
        shareCount: 0,
        isEdited: false,
        visibility,
      };

      await createPost(postData);
      toast.success("Post created successfully!");

      // Reset form
      setCaption("");
      setLocation("");
      setHashtags("");
      setMediaPreview("");
      setMediaType(null);
      setVisibility("public");

      onClose();
      onSuccess?.();
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const visibilityIcons: Record<VisibilityType, React.ReactNode> = {
    public: <HiGlobeAlt className="w-4 h-4" />,
    friends: <HiUserGroup className="w-4 h-4" />,
    private: <HiLockClosed className="w-4 h-4" />,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass glass-dark rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 glass glass-dark border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-text-primary">Create Post</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <HiXMark className="w-6 h-6 text-text-secondary" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Media Selection */}
                {!mediaPreview && (
                  <div className="space-y-3">
                    <p className="text-sm text-text-secondary font-medium">Add Media</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          setMediaType("image");
                          fileInputRef.current?.click();
                        }}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-primary/50 hover:border-primary hover:bg-primary/5 transition-all"
                      >
                        <HiPhoto className="w-6 h-6 text-primary" />
                        <span className="text-sm text-text-primary">Upload Image</span>
                      </button>
                      <button
                        onClick={() => {
                          setMediaType("video");
                          fileInputRef.current?.click();
                        }}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-secondary/50 hover:border-secondary hover:bg-secondary/5 transition-all"
                      >
                        <HiCamera className="w-6 h-6 text-secondary" />
                        <span className="text-sm text-text-primary">Upload Video</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Media Preview */}
                {mediaPreview && (
                  <div className="space-y-3">
                    <div className="relative group">
                      {mediaType === "video" ? (
                        <video
                          src={mediaPreview}
                          className="w-full rounded-xl aspect-square object-cover"
                          controls
                        />
                      ) : (
                        <Image
                          src={mediaPreview}
                          alt="Preview"
                          width={400}
                          height={400}
                          className="w-full rounded-xl aspect-square object-cover"
                        />
                      )}
                      <button
                        onClick={() => {
                          setMediaPreview("");
                          setMediaType(null);
                        }}
                        className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all opacity-0 group-hover:opacity-100"
                      >
                        <HiXMark className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept={mediaType === "video" ? "video/*" : "image/*"}
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Caption */}
                <div className="space-y-2">
                  <label className="text-sm text-text-secondary font-medium block">
                    Caption
                  </label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="What's on your mind?"
                    maxLength={2200}
                    className="w-full bg-surface/50 border border-white/10 rounded-lg p-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary transition-colors resize-none h-24"
                  />
                  <p className="text-xs text-text-secondary">{caption.length}/2200</p>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="text-sm text-text-secondary font-medium flex items-center gap-2">
                    <HiMapPin className="w-4 h-4" />
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Add a location..."
                    className="w-full bg-surface/50 border border-white/10 rounded-lg p-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Hashtags */}
                <div className="space-y-2">
                  <label className="text-sm text-text-secondary font-medium flex items-center gap-2">
                    <HiHashtag className="w-4 h-4" />
                    Hashtags (Optional)
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
                        className={`flex items-center justify-center gap-2 p-2 rounded-lg border transition-all capitalize ${
                          visibility === v
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-white/10 bg-surface/50 text-text-secondary hover:border-white/20"
                        }`}
                      >
                        {visibilityIcons[v]}
                        <span className="text-sm hidden sm:inline">{v}</span>
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
                  onClick={handleCreatePost}
                  disabled={isLoading || !caption.trim()}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all"
                >
                  {isLoading ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
