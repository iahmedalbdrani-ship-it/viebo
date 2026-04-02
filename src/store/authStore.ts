"use client";

import { create } from "zustand";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setFirebaseUser: (user: FirebaseUser | null) => void;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  firebaseUser: null,
  loading: true,
  error: null,

  login: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      if (userDoc.exists()) {
        set({ user: userDoc.data() as User, firebaseUser: result.user });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed";
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  signup: async (email: string, password: string, username: string) => {
    try {
      set({ loading: true, error: null });
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const newUser: User = {
        userId: result.user.uid,
        email,
        username,
        displayName: username,
        avatar: "",
        bio: "",
        coverImage: "",
        followers: [],
        following: [],
        createdAt: new Date(),
        isVerified: false,
        isPrivate: false,
        vibeScore: 0,
        preferences: {
          theme: "dark",
          notifications: true,
          privacy: "public",
        },
      };
      await setDoc(doc(db, "users", result.user.uid), {
        ...newUser,
        createdAt: serverTimestamp(),
      });
      set({ user: newUser, firebaseUser: result.user });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Signup failed";
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  loginWithGoogle: async () => {
    try {
      set({ loading: true, error: null });
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      if (userDoc.exists()) {
        set({ user: userDoc.data() as User, firebaseUser: result.user });
      } else {
        const newUser: User = {
          userId: result.user.uid,
          email: result.user.email || "",
          username: result.user.displayName?.replace(/\s/g, "").toLowerCase() || "",
          displayName: result.user.displayName || "",
          avatar: result.user.photoURL || "",
          bio: "",
          coverImage: "",
          followers: [],
          following: [],
          createdAt: new Date(),
          isVerified: false,
          isPrivate: false,
          vibeScore: 0,
          preferences: {
            theme: "dark",
            notifications: true,
            privacy: "public",
          },
        };
        await setDoc(doc(db, "users", result.user.uid), {
          ...newUser,
          createdAt: serverTimestamp(),
        });
        set({ user: newUser, firebaseUser: result.user });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Google login failed";
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null, firebaseUser: null });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Logout failed";
      set({ error: message });
    }
  },

  setUser: (user) => set({ user }),
  setFirebaseUser: (firebaseUser) => set({ firebaseUser }),
  setLoading: (loading) => set({ loading }),
  clearError: () => set({ error: null }),
}));

// Auth state listener
if (typeof window !== "undefined") {
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      if (userDoc.exists()) {
        useAuthStore.setState({
          user: userDoc.data() as User,
          firebaseUser,
          loading: false,
        });
      } else {
        useAuthStore.setState({ firebaseUser, loading: false });
      }
    } else {
      useAuthStore.setState({ user: null, firebaseUser: null, loading: false });
    }
  });
}
