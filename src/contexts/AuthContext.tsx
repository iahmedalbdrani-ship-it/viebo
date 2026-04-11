import React, { createContext, useContext, useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { supabase, isSupabaseConfigured } from '../config/supabase';
import { AuthContextType, AuthState, User } from '../types/auth';

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    // If Supabase isn't configured, skip loading and allow the app (and tabs) to render in dev mode.
    loading: isSupabaseConfigured,
    error: null,
    // Dev fallback: pretend the user is authenticated so screens like Chat are reachable for UI testing.
    isAuthenticated: !isSupabaseConfigured,
  });

  // Initialize auth state on app load
  useEffect(() => {
    if (!isSupabaseConfigured) {
      // No backend configured — stay in dev preview mode.
      return;
    }

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setState({
            user: profile || {
              id: session.user.id,
              email: session.user.email || '',
            },
            loading: false,
            error: null,
            isAuthenticated: true,
          });
        } else {
          setState((prev) => ({
            ...prev,
            loading: false,
          }));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: 'Failed to load authentication',
        }));
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setState({
          user: profile || {
            id: session.user.id,
            email: session.user.email || '',
          },
          loading: false,
          error: null,
          isAuthenticated: true,
        });
      } else {
        setState((prev) => ({
          ...prev,
          user: null,
          isAuthenticated: false,
        }));
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, username?: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: signUpError.message,
        }));
        return { success: false, error: signUpError.message };
      }

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase.from('users').insert([
          {
            id: authData.user.id,
            email: authData.user.email,
            username: username || email.split('@')[0],
            created_at: new Date().toISOString(),
          },
        ]);

        if (profileError) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: profileError.message,
          }));
          return { success: false, error: profileError.message };
        }

        setState((prev) => ({
          ...prev,
          loading: false,
          error: null,
        }));
        return { success: true };
      }

      return { success: false, error: 'Sign up failed' };
    } catch (error: any) {
      const errorMessage = error.message || 'Sign up failed';
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const signIn = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
        return { success: false, error: error.message };
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        setState({
          user: profile || {
            id: data.user.id,
            email: data.user.email || '',
          },
          loading: false,
          error: null,
          isAuthenticated: true,
        });

        return { success: true };
      }

      return { success: false, error: 'Sign in failed' };
    } catch (error: any) {
      const errorMessage = error.message || 'Sign in failed';
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const signInWithGoogle = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'viebo://',
          skipBrowserRedirect: false,
        },
      });

      if (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
        return { success: false, error: error.message };
      }

      // Handle successful OAuth
      if (data?.url) {
        try {
          await WebBrowser.openAuthSessionAsync(
            data.url,
            'viebo://'
          );
        } catch (error: any) {
          console.error('Browser error:', error);
        }
      }

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Google Sign-In failed';
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
    }
  };

  const updateProfile = async (username: string, avatarUrl?: string) => {
    if (!state.user) {
      return { success: false, error: 'No user logged in' };
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const { error } = await supabase
        .from('users')
        .update({
          username,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', state.user.id);

      if (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
        return { success: false, error: error.message };
      }

      setState((prev) => ({
        ...prev,
        user: prev.user ? { ...prev.user, username, avatar_url: avatarUrl } : null,
        loading: false,
      }));

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Profile update failed';
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const clearError = () => {
    setState((prev) => ({
      ...prev,
      error: null,
    }));
  };

  const value: AuthContextType = {
    ...state,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
