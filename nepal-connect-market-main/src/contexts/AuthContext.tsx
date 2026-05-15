import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  profile: any | null;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any; isAdmin?: boolean; emailConfirmationRequired?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: any; isAdmin?: boolean }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState<any | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    setProfile(data);
    return data;
  }, []);

  const checkAdmin = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    const admin = data?.some((r: any) => r.role === 'admin') ?? false;
    setIsAdmin(admin);
    return admin;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
      await checkAdmin(user.id);
    }
  }, [user, fetchProfile, checkAdmin]);

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(async () => {
          if (!mounted) return;
          await fetchProfile(session.user.id);
          await checkAdmin(session.user.id);
          setLoading(false);
        }, 0);
      } else {
        setProfile(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
        await checkAdmin(session.user.id);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile, checkAdmin]);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) return { error };
    
    // Check if email confirmation is required
    if (data.user && !data.session) {
      return { error: null, isAdmin: false, emailConfirmationRequired: true };
    }
    
    // If auto-confirmed (shouldn't happen now but fallback)
    if (data.user && data.session) {
      await new Promise(resolve => setTimeout(resolve, 500));
      await fetchProfile(data.user.id);
      const adminStatus = await checkAdmin(data.user.id);
      return { error: null, isAdmin: adminStatus };
    }
    return { error: null, isAdmin: false };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error };
    
    const adminStatus = await checkAdmin(data.user.id);
    await fetchProfile(data.user.id);
    return { error: null, isAdmin: adminStatus };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, profile, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
