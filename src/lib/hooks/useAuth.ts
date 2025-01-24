import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import type { User } from '../types';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState<{ count: number; timestamp: number }>(() => {
    const stored = localStorage.getItem('loginAttempts');
    return stored ? JSON.parse(stored) : { count: 0, timestamp: 0 };
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUser(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUser(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUser = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(data);

      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const isLockedOut = () => {
    if (loginAttempts.count >= MAX_LOGIN_ATTEMPTS) {
      const timeSinceLockout = Date.now() - loginAttempts.timestamp;
      if (timeSinceLockout < LOCKOUT_DURATION) {
        return true;
      }
      // Reset attempts if lockout period has passed
      setLoginAttempts({ count: 0, timestamp: 0 });
      localStorage.removeItem('loginAttempts');
    }
    return false;
  };

  const signIn = async (email: string, password: string, rememberMe?: boolean) => {
    if (isLockedOut()) {
      return { error: 'Account is temporarily locked. Please try again later.' };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const newAttempts = { 
          count: loginAttempts.count + 1,
          timestamp: Date.now()
        };
        setLoginAttempts(newAttempts);
        localStorage.setItem('loginAttempts', JSON.stringify(newAttempts));
        throw error;
      }

      if (rememberMe) {
        await supabase.auth.updateSession({
          data: { persistent: true }
        });
      }

      setLoginAttempts({ count: 0, timestamp: 0 });
      localStorage.removeItem('loginAttempts');
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/admin/login');
    } catch (error: any) {
      console.error('Error signing out:', error.message);
    }
  };

  return {
    user,
    loading,
    signIn,
    signOut,
    isLockedOut,
    remainingAttempts: MAX_LOGIN_ATTEMPTS - loginAttempts.count,
  };
}