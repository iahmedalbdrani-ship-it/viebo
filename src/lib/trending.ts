import type { Post } from "@/types";

export interface TrendingScore {
  postId: string;
  score: number;
  engagementRate: number;
  trendingLevel: "viral" | "trending" | "popular" | "new";
}

/**
 * Calculate trending score for a post
 * Based on engagement metrics and recency
 */
export function calculateTrendingScore(post: Post, now: Date = new Date()): TrendingScore {
  const createdAt = typeof post.createdAt === "string"
    ? new Date(post.createdAt)
    : post.createdAt;

  const ageInHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
  const ageInDays = ageInHours / 24;

  // Engagement metrics
  const totalEngagement = post.likeCount + post.commentCount * 2 + post.shareCount * 3;
  const engagementRate = totalEngagement > 0 ? totalEngagement / Math.max(1, ageInHours) : 0;

  // Time decay factor (newer posts score higher)
  const timeDecay = 1 / (1 + ageInDays * 0.1);

  // Engagement multiplier
  const engagementMultiplier = Math.log10(Math.max(1, totalEngagement + 1)) * 10;

  // Comments boost (discussions boost trending)
  const commentBoost = Math.log10(Math.max(1, post.commentCount + 1)) * 5;

  // Viral threshold (high engagement in short time)
  const isViral = engagementRate > 10 && ageInDays < 2;

  // Calculate final score
  const score = (engagementMultiplier * timeDecay) + commentBoost + (isViral ? 50 : 0);

  // Determine trending level
  let trendingLevel: "viral" | "trending" | "popular" | "new";
  if (score > 100) {
    trendingLevel = "viral";
  } else if (score > 50) {
    trendingLevel = "trending";
  } else if (score > 10) {
    trendingLevel = "popular";
  } else {
    trendingLevel = "new";
  }

  return {
    postId: post.postId,
    score,
    engagementRate,
    trendingLevel,
  };
}

/**
 * Sort posts by trending score
 */
export function sortByTrending(
  posts: Post[],
  now: Date = new Date()
): Array<Post & { trendingScore: TrendingScore }> {
  return posts
    .map((post) => ({
      ...post,
      trendingScore: calculateTrendingScore(post, now),
    }))
    .sort((a, b) => b.trendingScore.score - a.trendingScore.score);
}

/**
 * Get hashtag trending by frequency
 */
export function getTrendingHashtags(
  posts: Post[],
  limit: number = 10
): Array<{ hashtag: string; count: number; posts: Post[] }> {
  const hashtagMap = new Map<string, Post[]>();

  posts.forEach((post) => {
    post.hashtags.forEach((tag) => {
      const current = hashtagMap.get(tag) || [];
      hashtagMap.set(tag, [...current, post]);
    });
  });

  return Array.from(hashtagMap.entries())
    .map(([hashtag, posts]) => ({
      hashtag,
      count: posts.length,
      posts,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Get suggested creators based on engagement
 */
export function getSuggestedCreators(
  posts: Post[],
  currentUserId: string,
  limit: number = 5
): Array<{ userId: string; score: number; postCount: number; totalEngagement: number }> {
  const creatorMap = new Map<
    string,
    { score: number; postCount: number; totalEngagement: number }
  >();

  posts.forEach((post) => {
    if (post.userId === currentUserId) return;

    const current = creatorMap.get(post.userId) || {
      score: 0,
      postCount: 0,
      totalEngagement: 0,
    };

    const engagement = post.likeCount + post.commentCount + post.shareCount;
    current.postCount += 1;
    current.totalEngagement += engagement;
    current.score = current.totalEngagement / current.postCount; // Average engagement per post

    creatorMap.set(post.userId, current);
  });

  return Array.from(creatorMap.entries())
    .map(([userId, data]) => ({
      userId,
      ...data,
    }))
    .filter((creator) => creator.postCount >= 2) // At least 2 posts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Get posts for explore/discover page
 */
export function getExplorePosts(posts: Post[]): {
  trending: Array<Post & { trendingScore: TrendingScore }>;
  popular: Array<Post & { trendingScore: TrendingScore }>;
  recent: Post[];
} {
  const sorted = sortByTrending(posts);

  return {
    trending: sorted.filter((p) => p.trendingScore.trendingLevel === "viral").slice(0, 5),
    popular: sorted.filter((p) => p.trendingScore.trendingLevel === "trending").slice(0, 10),
    recent: posts.sort((a, b) => {
      const timeA = typeof a.createdAt === "string" ? new Date(a.createdAt) : a.createdAt;
      const timeB = typeof b.createdAt === "string" ? new Date(b.createdAt) : b.createdAt;
      return timeB.getTime() - timeA.getTime();
    }).slice(0, 10),
  };
}
