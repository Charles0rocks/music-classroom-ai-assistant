import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-supabase-project.supabase.co');
};

let supabaseInstance: SupabaseClient | null = null;

if (supabaseUrl && supabaseUrl.startsWith('http')) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey || 'dummy-key');
  } catch (e) {
    console.warn('Failed to initialize Supabase client:', e);
  }
}

export const supabase = supabaseInstance;

export interface DbScheduleRecord {
  id: string;
  teacher_id?: string;
  student_name?: string;
  start_time?: string;
  end_time?: string;
  date?: string;
  day_of_week?: string;
  time_slot?: string;
  duration?: string | number;
  room?: string;
  fee?: number;
  status?: string;
  created_at?: string;
}
