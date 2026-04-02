"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import {
  deleteComment,
  likeComment,
  unlikeComment,
  addComment,
} from "@/lib/firestore";
import toast from "react-hot-toast";
import { HiHeart, HiTrash } from "react-icons/hi2";
import { HiHeart as HiHeartSolid } from "react-icons/hi2";
import type { Comment } from "@/types";

interface CommentThreadProps {
  postId: string;
  comments: Comment[];
  onCommentAdded?: () => void;
}

export default function CommentThread({
  postId,
  comments,
  onCommentAdded,
}: CommentThreadProps) {
  const { user } = useAuthStore();
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  const handleAddComment = async () => {
    if (!user?.userId || !newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment(postId, {
        userId: user.userId,
        content: newComment,
        likes: [],
        replies: [],
      });

      setNewComment("");
      toast.success("Comment added!");
      onCommentAdded?.();
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string, isLiked: boolean) => {
    if (!user?.userId) return;

    try {
      if (isLiked) {
        await unlikeComment(commentId, user.userId);
        setLikedComments((prev) => {
          const next = new Set(prev);
          next.delete(commentId);
          return next;
        });
      } else {
        await likeComment(commentId, user.userId);
        setLikedComments((prev) => new Set(prev).add(commentId));
      }
    } catch (error) {
      console.error("Error toggling comment like:", error);
      toast.error("Failed to update like");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user?.userId) return;

    try {
      await deleteComment(commentId, postId);
      toast.success("Comment deleted");
      onCommentAdded?.();
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div className="space-y-4">
      {/* Comment Input */}
      {user && (
        <div className="flex gap-3 pb-4 border-b border-white/10">
          <Image
            src={user.avatar || "/default-avatar.png"}
            alt={user.username}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
                className="flex-1 bg-surface/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary transition-colors"
              />
              <button
                onClick={handleAddComment}
                disabled={isSubmitting || !newComment.trim()}
                className="px-4 py-2 bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-sm font-semibold transition-colors"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-center text-text-secondary text-sm py-4">
            No comments yet. Be the first!
          </p>
        ) : (
          comments.map((comment) => {
            const isLiked = likedComments.has(comment.commentId);
            const canDelete = user?.userId === comment.userId;

            return (
              <motion.div
                key={comment.commentId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 group"
              >
                <Image
                  src={"/default-avatar.png"}
                  alt={comment.userId}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="bg-surface/50 rounded-lg p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-text-primary">
                          {comment.userId}
                        </p>
                        <p className="text-sm text-text-primary break-words mt-1">
                          {comment.content}
                        </p>
                      </div>
                      {canDelete && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              handleDeleteComment(comment.commentId)
                            }
                            className="p-1 hover:bg-red-500/20 rounded transition-colors"
                          >
                            <HiTrash className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Comment Actions */}
                  <div className="flex items-center gap-3 mt-2 text-xs text-text-secondary px-2">
                    <button
                      onClick={() => handleLikeComment(comment.commentId, isLiked)}
                      className="flex items-center gap-1 hover:text-accent transition-colors"
                    >
                      {isLiked ? (
                        <HiHeartSolid className="w-4 h-4 text-accent fill-current" />
                      ) : (
                        <HiHeart className="w-4 h-4" />
                      )}
                      <span>{comment.likes?.length || 0}</span>
                    </button>
                    <span>
                      {new Date(
                        typeof comment.createdAt === "string"
                          ? comment.createdAt
                          : comment.createdAt.toString()
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-2 space-y-2 pl-4 border-l-2 border-white/10">
                      {comment.replies.map((reply) => (
                        <div key={reply.replyId} className="flex gap-2">
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-text-secondary">
                              {reply.userId}
                            </p>
                            <p className="text-xs text-text-primary">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
