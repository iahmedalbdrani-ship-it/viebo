"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import {
  likePost,
  unlikePost,
  getComments,
} from "@/lib/firestore";
import CommentThread from "@/components/posts/CommentThread";
import toast from "react-hot-toast";
import {
  HiHeart,
  HiChatBubbleOvalLeft,
  HiArrowUpTray,
  HiBookmark,
} from "react-icons/hi2";
import type { Post, Comment } from "@/types";

interface PostCardProps {
  post: Post;
  authorName: string;
  authorAvatar: string;
}

export default function PostCard({ post, authorName, authorAvatar }: PostCardProps) {
  const { user } = useAuthStore();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  useEffect(() => {
    // Check if current user has liked this post
    if (user?.userId && post.likes.includes(user.userId)) {
      setIsLiked(true);
    }
  }, [user, post.likes]);

  const handleLike = async () => {
    if (!user?.userId) {
      toast.error("Please log in to like posts");
      return;
    }

    try {
      if (isLiked) {
        await unlikePost(post.postId, user.userId);
        setLikeCount((prev) => prev - 1);
      } else {
        await likePost(post.postId, user.userId);
        setLikeCount((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like");
    }
  };

  const loadComments = async () => {
    if (isLoadingComments) return;
    setIsLoadingComments(true);
    try {
      const fetchedComments = await getComments(post.postId);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error loading comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setIsLoadingComments(false);
    }
  };

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-2xl overflow-hidden border border-white/5"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent p-[2px]">
          <div className="w-full h-full rounded-full bg-surface overflow-hidden">
            {authorAvatar ? (
              <Image
                src={authorAvatar}
                alt={authorName}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-primary text-sm font-bold">
                {authorName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
        <div className="flex-1">
          <p className="text-text-primary font-semibold text-sm">{authorName}</p>
          {post.location && (
            <p className="text-text-secondary text-xs">{post.location}</p>
          )}
        </div>
        <span className="text-text-secondary text-xs">{timeAgo(post.createdAt)}</span>
      </div>

      {/* Media */}
      {post.mediaUrls.length > 0 && (
        <div className="relative aspect-square bg-dark">
          <Image
            src={post.mediaUrls[0]}
            alt="Post media"
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={handleLike}
              className="transition-colors"
            >
              <HiHeart
                className={`w-6 h-6 ${
                  isLiked ? "text-accent fill-accent" : "text-text-secondary"
                }`}
              />
            </motion.button>
            <button
              onClick={() => {
                setShowComments(!showComments);
                if (!showComments && comments.length === 0) {
                  loadComments();
                }
              }}
              className="transition-colors"
            >
              <HiChatBubbleOvalLeft className="w-6 h-6 text-text-secondary hover:text-text-primary transition-colors" />
            </button>
            <button>
              <HiArrowUpTray className="w-6 h-6 text-text-secondary hover:text-text-primary transition-colors" />
            </button>
          </div>
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => setIsSaved(!isSaved)}
          >
            <HiBookmark
              className={`w-6 h-6 ${
                isSaved ? "text-primary fill-primary" : "text-text-secondary"
              }`}
            />
          </motion.button>
        </div>

        {/* Like count */}
        <p className="text-text-primary text-sm font-semibold mb-1">
          {likeCount.toLocaleString()} likes
        </p>

        {/* Caption */}
        {post.caption && (
          <p className="text-text-primary text-sm">
            <span className="font-semibold mr-1">{authorName}</span>
            {post.caption}
          </p>
        )}

        {/* Hashtags */}
        {post.hashtags.length > 0 && (
          <p className="text-secondary text-sm mt-1">
            {post.hashtags.map((tag) => `#${tag}`).join(" ")}
          </p>
        )}

        {/* Comments count */}
        {post.commentCount > 0 && (
          <button
            onClick={() => {
              setShowComments(!showComments);
              if (!showComments && comments.length === 0) {
                loadComments();
              }
            }}
            className="text-text-secondary text-sm mt-2 hover:text-text-primary transition-colors"
          >
            View all {post.commentCount} comments
          </button>
        )}
      </div>

      {/* Comments Section */}
      {showComments && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-white/10 p-4"
        >
          {isLoadingComments ? (
            <p className="text-center text-text-secondary text-sm py-4">
              Loading comments...
            </p>
          ) : (
            <CommentThread
              postId={post.postId}
              comments={comments}
              onCommentAdded={loadComments}
            />
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
