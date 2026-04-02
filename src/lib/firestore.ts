import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  DocumentSnapshot,
  addDoc,
  arrayUnion,
  arrayRemove,
  increment,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Post, User, Story, Comment, Notification } from "@/types";

// ============ Users ============

export async function getUserById(userId: string): Promise<User | null> {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as User) : null;
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const q = query(collection(db, "users"), where("username", "==", username), limit(1));
  const snapshot = await getDocs(q);
  return snapshot.empty ? null : (snapshot.docs[0].data() as User);
}

export async function updateUser(userId: string, data: Partial<User>): Promise<void> {
  const docRef = doc(db, "users", userId);
  await updateDoc(docRef, data);
}

export async function followUser(currentUserId: string, targetUserId: string): Promise<void> {
  const currentRef = doc(db, "users", currentUserId);
  const targetRef = doc(db, "users", targetUserId);
  await updateDoc(currentRef, { following: arrayUnion(targetUserId) });
  await updateDoc(targetRef, { followers: arrayUnion(currentUserId) });
}

export async function unfollowUser(currentUserId: string, targetUserId: string): Promise<void> {
  const currentRef = doc(db, "users", currentUserId);
  const targetRef = doc(db, "users", targetUserId);
  await updateDoc(currentRef, { following: arrayRemove(targetUserId) });
  await updateDoc(targetRef, { followers: arrayRemove(currentUserId) });
}

// ============ Posts ============

export async function createPost(postData: Omit<Post, "postId" | "createdAt" | "updatedAt">): Promise<string> {
  const postRef = await addDoc(collection(db, "posts"), {
    ...postData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return postRef.id;
}

export async function getFeedPosts(lastDoc?: DocumentSnapshot, pageSize = 10): Promise<{
  posts: Post[];
  lastDoc: DocumentSnapshot | null;
}> {
  let q = query(
    collection(db, "posts"),
    where("visibility", "==", "public"),
    orderBy("createdAt", "desc"),
    limit(pageSize)
  );

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  const snapshot = await getDocs(q);
  const posts = snapshot.docs.map((doc) => {
    const data = doc.data() as Post;
    return { ...data, postId: doc.id };
  });

  return {
    posts,
    lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
  };
}

export async function getUserPosts(userId: string): Promise<Post[]> {
  const q = query(
    collection(db, "posts"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data() as Post;
    return { ...data, postId: doc.id };
  });
}

export async function likePost(postId: string, userId: string): Promise<void> {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    likes: arrayUnion(userId),
    likeCount: increment(1),
  });
}

export async function unlikePost(postId: string, userId: string): Promise<void> {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    likes: arrayRemove(userId),
    likeCount: increment(-1),
  });
}

export async function updatePost(postId: string, data: Partial<Post>): Promise<void> {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    ...data,
    updatedAt: serverTimestamp(),
    isEdited: true,
  });
}

export async function deletePost(postId: string): Promise<void> {
  await deleteDoc(doc(db, "posts", postId));
}

// ============ Stories ============

export async function createStory(storyData: Omit<Story, "storyId" | "createdAt" | "expiresAt">): Promise<string> {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const storyRef = await addDoc(collection(db, "stories"), {
    ...storyData,
    createdAt: serverTimestamp(),
    expiresAt,
  });
  return storyRef.id;
}

export async function getActiveStories(): Promise<(Story & { storyId: string })[]> {
  const q = query(
    collection(db, "stories"),
    where("expiresAt", ">", new Date()),
    orderBy("expiresAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data() as Story;
    return { ...data, storyId: doc.id };
  });
}

// ============ Comments ============

export async function addComment(postId: string, commentData: Omit<Comment, "commentId" | "createdAt" | "postId">): Promise<string> {
  const commentRef = await addDoc(collection(db, "comments"), {
    ...commentData,
    postId,
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, "posts", postId), {
    commentCount: increment(1),
  });
  return commentRef.id;
}

export async function getComments(postId: string): Promise<Comment[]> {
  const q = query(
    collection(db, "comments"),
    where("postId", "==", postId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data() as Comment;
    return { ...data, commentId: doc.id };
  });
}

export async function deleteComment(commentId: string, postId: string): Promise<void> {
  await deleteDoc(doc(db, "comments", commentId));
  await updateDoc(doc(db, "posts", postId), {
    commentCount: increment(-1),
  });
}

export async function likeComment(commentId: string, userId: string): Promise<void> {
  const commentRef = doc(db, "comments", commentId);
  await updateDoc(commentRef, {
    likes: arrayUnion(userId),
  });
}

export async function unlikeComment(commentId: string, userId: string): Promise<void> {
  const commentRef = doc(db, "comments", commentId);
  await updateDoc(commentRef, {
    likes: arrayRemove(userId),
  });
}

// ============ Real-time Listeners ============

export function onMessagesUpdate(
  conversationId: string,
  callback: (messages: unknown[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "messages", conversationId, "messages"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      messageId: doc.id,
      ...doc.data(),
    }));
    callback(messages);
  });
}

export function onNotificationsUpdate(
  userId: string,
  callback: (notifications: unknown[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(50)
  );
  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map((doc) => ({
      notificationId: doc.id,
      ...doc.data(),
    }));
    callback(notifications);
  });
}

// ============ Notifications ============

export async function createNotification(notification: Omit<Notification, "notificationId" | "createdAt">): Promise<string> {
  const notifRef = await addDoc(collection(db, "notifications"), {
    ...notification,
    createdAt: serverTimestamp(),
  });
  return notifRef.id;
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const notifRef = doc(db, "notifications", notificationId);
  await updateDoc(notifRef, { isRead: true });
}

// ============ Stories ============

export async function addStoryReaction(
  storyId: string,
  userId: string,
  emoji: string
): Promise<void> {
  const storyRef = doc(db, "stories", storyId);
  await updateDoc(storyRef, {
    reactions: {
      ...{}, // Will be merged with existing reactions
      [userId]: emoji,
    },
  });
}

export async function removeStoryReaction(storyId: string, userId: string): Promise<void> {
  const storyRef = doc(db, "stories", storyId);
  const storyDoc = await getDoc(storyRef);
  if (storyDoc.exists()) {
    const reactions = storyDoc.data().reactions || {};
    delete reactions[userId];
    await updateDoc(storyRef, { reactions });
  }
}

export async function addStoryView(storyId: string, userId: string): Promise<void> {
  const storyRef = doc(db, "stories", storyId);
  await updateDoc(storyRef, {
    views: arrayUnion(userId),
    viewCount: increment(1),
  });
}
