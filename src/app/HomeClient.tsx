"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { getFeedPosts, getUserById } from "@/lib/firestore";
import StoriesBar from "@/components/stories/StoriesBar";
import PostCard from "@/components/feed/PostCard";
import PostCreationModal from "@/components/posts/PostCreationModal";
import toast from "react-hot-toast";
import { DocumentSnapshot } from "firebase/firestore";
import type { Post } from "@/types";

const mockStories = [
  { userId: "1", username: "alex_dev", avatar: "", hasStory: true, isViewed: false },
  { userId: "2", username: "sara.design", avatar: "", hasStory: true, isViewed: false },
  { userId: "3", username: "mike_photo", avatar: "", hasStory: true, isViewed: true },
  { userId: "4", username: "jess.music", avatar: "", hasStory: true, isViewed: false },
  { userId: "5", username: "tom_travel", avatar: "", hasStory: true, isViewed: true },
  { userId: "6", username: "luna.art", avatar: "", hasStory: true, isViewed: false },
];

export default function Home() {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<Array<Post & { authorName: string; authorAvatar: string }>>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Load initial posts
  useEffect(() => {
    const loadInitialPosts = async () => {
      try {
        setIsLoadingInitial(true);
        const { posts: fetchedPosts, lastDoc: newLastDoc } = await getFeedPosts(undefined, 10);

        // Enrich posts with author data
        const enrichedPosts = await Promise.all(
          fetchedPosts.map(async (post) => {
            const author = await getUserById(post.userId);
            return {
              ...post,
              authorName: author?.username || "Unknown",
              authorAvatar: author?.avatar || "",
            };
          })
        );

        setPosts(enrichedPosts);
        setLastDoc(newLastDoc);
        setHasMorePosts(!!newLastDoc);
      } catch (error) {
        console.error("Error loading posts:", error);
        toast.error("Failed to load posts");
      } finally {
        setIsLoadingInitial(false);
      }
    };

    if (user?.userId) {
      loadInitialPosts();
    }
  }, [user?.userId]);

  // Load more posts (infinite scroll)
  const loadMorePosts = useCallback(async () => {
    if (!hasMorePosts || isLoadingMore || !lastDoc) return;

    try {
      setIsLoadingMore(true);
      const { posts: fetchedPosts, lastDoc: newLastDoc } = await getFeedPosts(lastDoc, 10);

      if (fetchedPosts.length === 0) {
        setHasMorePosts(false);
        return;
      }

      // Enrich posts with author data
      const enrichedPosts = await Promise.all(
        fetchedPosts.map(async (post) => {
          const author = await getUserById(post.userId);
          return {
            ...post,
            authorName: author?.username || "Unknown",
            authorAvatar: author?.avatar || "",
          };
        })
      );

      setPosts((prev) => [...prev, ...enrichedPosts]);
      setLastDoc(newLastDoc);
      setHasMorePosts(!!newLastDoc);
    } catch (error) {
      console.error("Error loading more posts:", error);
      toast.error("Failed to load more posts");
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMorePosts, isLoadingMore, lastDoc]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMorePosts && !isLoadingMore) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMorePosts, hasMorePosts, isLoadingMore]);

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-dark px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Vibeo
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-2 hover:bg-primary/20 rounded-full transition-colors text-primary"
              title="Create post"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
              </svg>
            </button>
            <button className="relative p-2 text-text-secondary hover:text-text-primary transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </button>
          </div>
        </div>
      </header>

      {/* Post Creation Modal */}
      <PostCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          // Reload feed after posting
          setPosts([]);
          setLastDoc(null);
          setHasMorePosts(true);
        }}
      />

      {/* Stories */}
      <StoriesBar stories={mockStories} />

      {/* Divider */}
      <div className="h-px bg-white/5 mx-4" />

      {/* Feed */}
      <div className="space-y-4 p-4">
        {isLoadingInitial ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary">No posts yet. Follow creators to see their posts!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.postId}
              post={post}
              authorName={post.authorName}
              authorAvatar={post.authorAvatar}
            />
          ))
        )}

        {/* Infinite scroll observer */}
        <div ref={observerTarget} className="py-4">
          {isLoadingMore && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary" />
            </div>
          )}
          {!hasMorePosts && posts.length > 0 && (
            <p className="text-center text-text-secondary text-sm">No more posts</p>
          )}
        </div>
      </div>
    </div>
  );
}
