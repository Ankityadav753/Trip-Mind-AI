import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session on load
    const initAuth = async () => {
      try {
        if (!isSupabaseConfigured) {
          setLoading(false);
          return;
        }

        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('TripMind Auth: error getting session', error.message);
        }
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      } catch (err) {
        console.error('TripMind Auth: unexpected error initializing session', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Subscribe to auth state changes
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, newSession) => {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          setLoading(false);
        }
      );

      return () => {
        subscription?.unsubscribe();
      };
    }
  }, []);

  /**
   * Sign up with email, password, and optional full name
   */
  const signUp = async (email, password, fullName) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured yet. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env file.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || email.split('@')[0]
        }
      }
    });

    if (error) throw error;
    return data;
  };

  /**
   * Login with email and password
   */
  const signIn = async (email, password) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured yet. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env file.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  };

  /**
   * Log out current user
   */
  const signOut = async () => {
    if (!isSupabaseConfigured) {
      setUser(null);
      setSession(null);
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: Boolean(user),
    isConfigured: isSupabaseConfigured
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
