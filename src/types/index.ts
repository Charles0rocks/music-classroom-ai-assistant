export type Role = 'teacher' | 'student';

export interface User {
  id: string;
  role: Role;
  name: string;
  email: string;
  avatar_url?: string;
}

export interface Teacher {
  id: string;
  user_id: string;
  instrument: string;
  bio: string;
}

export interface Student {
  id: string;
  user_id: string;
  teacher_id: string;
}

export interface ScheduleSlot {
  id: string;
  teacher_id: string;
  start_time: string; // ISO string
  end_time: string;   // ISO string
  is_available: boolean;
}

export type AppointmentStatus = 'confirmed' | 'cancelled' | 'rescheduled' | 'restored';

export interface Appointment {
  id: string;
  student_id: string;
  student_name?: string;
  teacher_id: string;
  start_time: string;
  original_start_time?: string;
  end_time: string;
  date?: string;
  day_of_week?: string;
  time_slot?: string;
  duration?: string;
  fee?: number;
  status: AppointmentStatus;
}

export interface AvailableSlotResponse {
  slot_id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  clash_reason?: string;
}

export type RescheduleStatus = 'pending' | 'approved' | 'rejected';

export interface RescheduleRequest {
  id: string;
  appointment_id: string;
  requested_slot_id: string;
  status: RescheduleStatus;
  reason?: string;
  created_at: string;
}

export interface CleanSummaryJSON {
  highlights: string[];
  technical_tips: string[];
  homework: string[];
  encouragement: string;
  bpm_recommendation?: number;
}

export interface LessonRecord {
  id: string;
  appointment_id: string;
  audio_url?: string;
  raw_transcript: string;
  clean_summary_json: CleanSummaryJSON;
  created_at: string;
  song_title?: string;
}

export interface TeacherDemoVideo {
  id: string;
  teacher_id: string;
  title: string;
  video_url: string;
  midi_data?: {
    bpm: number;
    key: string;
  };
  tags: string[];
  pitch_tolerance: number;
  tempo_tolerance: number;
  created_at?: string;
}

export interface TimelineMarker {
  time: number; // in seconds
  type: 'pitch' | 'rhythm' | 'posture';
  severity: 'error' | 'warning' | 'good';
  title: string;
  description: string;
  recommendation: string;
}

export interface AIFeedbackJSON {
  overall_score: number;
  pitch_accuracy: number;
  rhythm_accuracy: number;
  bpm_detected: number;
  timeline_markers: TimelineMarker[];
  summary: string;
}

export interface StudentPracticeVideo {
  id: string;
  student_id: string;
  demo_video_id: string;
  video_url: string;
  ai_feedback_json: AIFeedbackJSON;
  created_at: string;
}
