export interface User {
  userId: string;
  email: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  coverImage: string;
  followers: string[];
  following: string[];
  createdAt: Date;
  isVerified: boolean;
  isPrivate: boolean;
  vibeScore: number;
  preferences: {
    theme: "light" | "dark";
    notifications: boolean;
    privacy: "public" | "friends" | "private";
  };
}

export interface Post {
  postId: string;
  userId: string;
  content: string;
  mediaUrls: string[];
  type: "text" | "image" | "video" | "reel";
  caption: string;
  hashtags: string[];
  mentions: string[];
  location: string;
  likes: string[];
  likeCount: number;
  commentCount: number;
  shareCount: number;
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
  visibility: "public" | "friends" | "private";
}

export interface Story {
  storyId: string;
  userId: string;
  mediaUrl: string;
  caption: string;
  views: string[];
  viewCount: number;
  reactions: Record<string, string>;
  createdAt: Date;
  expiresAt: Date;
  isHighlight: boolean;
}

export interface Message {
  messageId: string;
  senderId: string;
  content: string;
  mediaUrl?: string;
  createdAt: Date;
  isRead: boolean;
  readAt?: Date;
  reactions: Record<string, string>;
}

export interface Conversation {
  conversationId: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt: Date;
  isRead: boolean;
  messages: Message[];
}

export interface Notification {
  notificationId: string;
  type: "like" | "comment" | "follow" | "message" | "mention";
  fromUserId: string;
  postId?: string;
  messageId?: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl: string;
}

export interface Comment {
  commentId: string;
  postId: string;
  userId: string;
  content: string;
  likes: string[];
  replies: Reply[];
  createdAt: Date;
}

export interface Reply {
  replyId: string;
  userId: string;
  content: string;
  createdAt: Date;
}
