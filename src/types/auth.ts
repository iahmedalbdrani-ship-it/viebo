export interface User {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, username?: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (username: string, avatarUrl?: string) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
}

export interface SignUpData {
  email: string;
  password: string;
  username?: string;
}

export interface SignInData {
  email: string;
  password: string;
}
