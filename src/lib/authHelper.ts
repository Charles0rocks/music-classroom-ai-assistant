import { supabase } from '@/lib/supabaseClient';

/**
 * Bulletproof Global Logout Handler
 * Clears Supabase session, LocalStorage, SessionStorage, Cookies,
 * and performs a hard browser page replacement to '/'
 */
export const handleLogout = async (): Promise<void> => {
  try {
    if (supabase) {
      await supabase.auth.signOut({ scope: 'global' });
    }
  } catch (e) {
    console.error('Supabase signOut error:', e);
  } finally {
    if (typeof window !== 'undefined') {
      try {
        localStorage.clear();
        sessionStorage.clear();

        // Clear cookies
        document.cookie.split(';').forEach((c) => {
          document.cookie = c
            .replace(/^ +/, '')
            .replace(/=.*/, '=;expires=' + new Date(0).toUTCString() + ';path=/');
        });
      } catch (err) {
        console.error('Storage clear error:', err);
      }

      // Hard reload and replace URL to home page
      window.location.replace('/');
    }
  }
};
