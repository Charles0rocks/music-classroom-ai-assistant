'use client';

import React, { createContext, useContext, useState } from 'react';
import {
  Role,
  User,
  Teacher,
  Student,
  ScheduleSlot,
  Appointment,
  RescheduleRequest,
  LessonRecord,
  TeacherDemoVideo,
  StudentPracticeVideo,
} from '@/types';
import { LoginModal } from '@/components/LoginModal';
import { getAvatarByGender } from '@/lib/avatarHelper';
import { supabase } from '@/lib/supabaseClient';

// Preset Teachers with Credentials (Default: Charles Lin, chl@gmail.com / 12345678)
export const PRESET_TEACHERS: { user: User; teacher: Teacher }[] = [
  {
    user: {
      id: 'u-charles-lin',
      role: 'teacher',
      name: 'Charles Lin',
      email: 'chl@gmail.com',
      avatar_url: getAvatarByGender('male', 'u-charles-lin'),
    },
    teacher: {
      id: 't-charles-lin',
      user_id: 'u-charles-lin',
      instrument: 'Piano',
      bio: '專業鋼琴演奏與 AI 音樂教學。',
    },
  },
  {
    user: {
      id: 'u-chang-001',
      role: 'teacher',
      name: '張老師',
      email: 'chang.teacher@harmony.edu',
      avatar_url: getAvatarByGender('female', 'u-chang-001'),
    },
    teacher: {
      id: 't-chang',
      user_id: 'u-chang-001',
      instrument: '鋼琴 (Piano)',
      bio: '國立音樂學院鋼琴演奏碩士，10年古典與流行鋼琴教學經驗。專精於古典鋼琴與AI音聲診斷。',
    },
  },
  {
    user: {
      id: 'u-lee-002',
      role: 'teacher',
      name: '李老師',
      email: 'lee.teacher@harmony.edu',
      avatar_url: getAvatarByGender('male', 'u-lee-002'),
    },
    teacher: {
      id: 't-lee',
      user_id: 'u-lee-002',
      instrument: '小提琴 (Violin)',
      bio: '知名交響樂團小提琴副首席，專精於古典小提琴演奏與檢定輔導。',
    },
  },
  {
    user: {
      id: 'u-wang-003',
      role: 'teacher',
      name: '王老師',
      email: 'wang.teacher@harmony.edu',
      avatar_url: getAvatarByGender('female', 'u-wang-003'),
    },
    teacher: {
      id: 't-wang',
      user_id: 'u-wang-003',
      instrument: '長笛 (Flute)',
      bio: '巴黎法蘭西音樂院長笛高階文憑，長笛演奏與長笛合奏專家。',
    },
  },
  {
    user: {
      id: 'u-chen-004',
      role: 'teacher',
      name: '陳老師',
      email: 'chen.teacher@harmony.edu',
      avatar_url: getAvatarByGender('male', 'u-chen-004'),
    },
    teacher: {
      id: 't-chen',
      user_id: 'u-chen-004',
      instrument: '爵士鼓 (Drums)',
      bio: '20年爵士鼓與打擊樂教學經驗，擅長 Funk、Rock 與 Jazz 節奏。',
    },
  },
  {
    user: {
      id: 'u-lin-005',
      role: 'teacher',
      name: '林老師',
      email: 'lin.teacher@harmony.edu',
      avatar_url: getAvatarByGender('female', 'u-lin-005'),
    },
    teacher: {
      id: 't-lin',
      user_id: 'u-lin-005',
      instrument: '聲樂 (Vocal)',
      bio: '義大利音樂學院聲樂碩士，專精於美聲唱法與流行發聲指導。',
    },
  },
];

const MOCK_STUDENT_USER: User = {
  id: 'u0000000-0000-0000-0000-000000000002',
  role: 'student',
  name: '學生端體驗帳號',
  email: 'student@demo.edu',
  avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
};

const MOCK_STUDENT: Student = {
  id: 's0000000-0000-0000-0000-000000000002',
  user_id: MOCK_STUDENT_USER.id,
  teacher_id: PRESET_TEACHERS[0].teacher.id,
};

const INITIAL_SLOTS: ScheduleSlot[] = [
  { id: 's1', teacher_id: 't-charles-lin', start_time: '2026-08-31T09:00:00.000Z', end_time: '2026-08-31T10:00:00.000Z', is_available: true },
  { id: 's2', teacher_id: 't-charles-lin', start_time: '2026-08-31T14:00:00.000Z', end_time: '2026-08-31T15:00:00.000Z', is_available: false },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    student_id: 's1',
    student_name: '許雅婷',
    teacher_id: 't-charles-lin',
    start_time: '2026-08-31T10:00:00.000Z',
    end_time: '2026-08-31T11:00:00.000Z',
    date: '2026-08-31',
    day_of_week: '週一',
    time_slot: '10:00 - 11:00',
    fee: 1200,
    status: 'confirmed',
  },
];

const INITIAL_LESSONS: LessonRecord[] = [
  {
    id: 'l1',
    appointment_id: 'a1',
    student_name: '許雅婷',
    course_name: '鋼琴進階檢定曲',
    created_at: '2026-08-31T10:00:00Z',
    audio_url: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
    raw_transcript: '許雅婷今天練習巴哈二部創意曲，整體音符很精準，但在轉調段落手腕稍顯僵硬，音量層次可以更大。',
    clean_summary_json: {
      highlights: ['音符與拍子精準'],
      technical_tips: ['轉調段落放鬆手腕'],
      homework: ['每日慢速練習第 16-24 小節，維持觸鍵彈性。'],
      encouragement: '表現優秀！加油！',
    },
    llm_summary: '音符與拍子精準，轉調段落放鬆手腕。作業：每日慢速練習第 16-24 小節，維持觸鍵彈性。',
    tags: ['巴哈創意曲', '觸鍵技巧', '手腕放鬆'],
  } as any,
];

const INITIAL_DEMO_VIDEOS: TeacherDemoVideo[] = [
  {
    id: 'dv1',
    teacher_id: 't-charles-lin',
    title: '蕭邦 Nocturne Op.9 No.2 示範演練',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    pitch_tolerance: 5,
    tempo_tolerance: 8,
    tags: ['蕭邦夜曲', '踏板技巧', '音色控制'],
  },
];

const INITIAL_PRACTICE_VIDEOS: StudentPracticeVideo[] = [
  {
    id: 'pv1',
    student_id: 's1',
    demo_video_id: 'dv1',
    student_name: '許雅婷',
    practice_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    ai_feedback_json: {
      overall_score: 92,
      pitch_accuracy: 92,
      rhythm_accuracy: 88,
      bpm_detected: 120,
      timeline_markers: [],
      summary: '整體表現良好。',
    },
    pitch_similarity: 92,
    tempo_similarity: 88,
    posture_match_score: 95,
    created_at: '2026-08-31T11:30:00Z',
  } as any,
];

export interface DemoContextType {
  isAuthenticated: boolean;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  currentRole: Role;
  currentUser: User;
  teacherProfile: Teacher;
  studentProfile: Student;
  scheduleSlots: ScheduleSlot[];
  setScheduleSlots: React.Dispatch<React.SetStateAction<ScheduleSlot[]>>;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  rescheduleRequests: RescheduleRequest[];
  lessonRecords: LessonRecord[];
  demoVideos: TeacherDemoVideo[];
  practiceVideos: StudentPracticeVideo[];
  presetTeachers: typeof PRESET_TEACHERS;
  login: (email: string, pass: string, role: Role) => { success: boolean; message: string };
  logout: () => void;
  switchRole: (role: Role) => void;
  toggleSlotAvailability: (slotId: string) => void;
  addScheduleSlot: (startTime: string, endTime: string) => void;
  requestReschedule: (appointmentId: string, slotId: string, reason?: string) => { success: boolean; message: string };
  addLessonRecord: (record: Omit<LessonRecord, 'id' | 'created_at'>) => LessonRecord;
  updateDemoVideo: (id: string, updates: Partial<TeacherDemoVideo>) => void;
  addPracticeVideo: (practice: Omit<StudentPracticeVideo, 'id' | 'created_at'>) => StudentPracticeVideo;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<Role>('teacher');
  const [activeTeacherIdx, setActiveTeacherIdx] = useState<number>(0);

  const [customTeacherUser, setCustomTeacherUser] = useState<User | null>(null);
  const [customTeacherProfile, setCustomTeacherProfile] = useState<Teacher | null>(null);

  const [scheduleSlots, setScheduleSlots] = useState<ScheduleSlot[]>(INITIAL_SLOTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [rescheduleRequests, setRescheduleRequests] = useState<RescheduleRequest[]>([]);
  const [lessonRecords, setLessonRecords] = useState<LessonRecord[]>(INITIAL_LESSONS);
  const [demoVideos, setDemoVideos] = useState<TeacherDemoVideo[]>(INITIAL_DEMO_VIDEOS);
  const [practiceVideos, setPracticeVideos] = useState<StudentPracticeVideo[]>(INITIAL_PRACTICE_VIDEOS);

  const activeTeacherPair = PRESET_TEACHERS[activeTeacherIdx] || PRESET_TEACHERS[0];
  
  const currentUser: User = currentRole === 'teacher'
    ? (customTeacherUser || activeTeacherPair.user)
    : MOCK_STUDENT_USER;

  const teacherProfile: Teacher = (currentRole === 'teacher' && customTeacherProfile)
    ? customTeacherProfile
    : activeTeacherPair.teacher;

  // Restore authenticated teacher from localStorage or Supabase on client mount
  React.useEffect(() => {
    const syncAuth = async () => {
      if (typeof window === 'undefined') return;

      // 1. Check Supabase session first
      if (supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const user = session.user;
            let teacherDb: any = null;
            try {
              const { data } = await supabase
                .from('teachers')
                .select('*')
                .or(`user_id.eq.${user.id},id.eq.${user.id}`)
                .maybeSingle();
              teacherDb = data;
            } catch (e) {}

            const isDefaultOrEmptyName = (str?: string) => {
              if (!str) return true;
              const trimmed = str.trim();
              return (
                trimmed === '' ||
                trimmed === '認證老師' ||
                trimmed === '新註冊老師' ||
                trimmed === '新申請認證教師' ||
                trimmed === '老師'
              );
            };

            const emailPrefix = user.email?.split('@')[0];
            const fallbackName = emailPrefix === 'js' ? 'Johnny Shaw' : (emailPrefix || 'Johnny Shaw');

            const teacherName =
              (!isDefaultOrEmptyName(teacherDb?.name) && teacherDb?.name?.trim()) ||
              user.user_metadata?.name?.trim() ||
              user.user_metadata?.full_name?.trim() ||
              user.user_metadata?.nickname?.trim() ||
              fallbackName;

            const teacherNickname =
              teacherDb?.nickname?.trim() ||
              user.user_metadata?.nickname?.trim() ||
              teacherName;

            const rawGender =
              teacherDb?.gender ||
              user.user_metadata?.gender ||
              user.user_metadata?.raw_gender ||
              (user.email?.toLowerCase().includes('js@') || teacherName.toLowerCase().includes('johnny') ? '男' : '男');

            const teacherGender = (rawGender === 'female' || rawGender === '女') ? '女' : '男';
            const avatarUrl = teacherDb?.avatar_url || getAvatarByGender(teacherGender, user.id);

            const teacherInstrument =
              teacherDb?.instrument?.trim() ||
              user.user_metadata?.instrument?.trim() ||
              user.user_metadata?.teachingSubjects?.trim() ||
              '吉他';

            const userObj: User = {
              id: user.id,
              role: 'teacher',
              name: teacherName,
              email: user.email || '',
              avatar_url: avatarUrl,
              gender: teacherGender,
            };

            const profileObj: Teacher = {
              id: teacherDb?.id || `t-${user.id}`,
              user_id: user.id,
              instrument: teacherInstrument,
              bio: teacherDb?.bio || user.user_metadata?.bio || '專業吉他與音樂教師',
              gender: teacherGender,
            };

            setCustomTeacherUser(userObj);
            setCustomTeacherProfile(profileObj);
            setCurrentRole('teacher');
            setIsAuthenticated(true);

            // Also store in LocalStorage for offline cache
            localStorage.setItem('auth_teacher', JSON.stringify({
              id: profileObj.id,
              user_id: user.id,
              name: userObj.name,
              nickname: teacherNickname,
              email: userObj.email,
              gender: teacherGender,
              instrument: profileObj.instrument,
              bio: profileObj.bio,
              avatar_url: avatarUrl,
            }));
            return;
          }
        } catch (e) {
          console.warn('Supabase session fetch notice:', e);
        }
      }

      // 2. Fallback to LocalStorage 'auth_teacher'
      const saved = localStorage.getItem('auth_teacher');
      if (saved) {
        try {
          const teacherObj = JSON.parse(saved);
          const idx = PRESET_TEACHERS.findIndex(
            (t) =>
              t.user.email.toLowerCase() === teacherObj.email?.toLowerCase() ||
              t.user.name === teacherObj.name
          );

          if (idx !== -1) {
            setActiveTeacherIdx(idx);
            setCustomTeacherUser(null);
            setCustomTeacherProfile(null);
          } else {
            // Custom registered teacher profile
            const rawGender = teacherObj.gender || (teacherObj.email?.includes('js@') || teacherObj.name?.includes('Johnny') ? '男' : '男');
            const teacherGender = (rawGender === 'female' || rawGender === '女') ? '女' : '男';
            const avatarUrl = teacherObj.avatar_url || getAvatarByGender(teacherGender, teacherObj.user_id || teacherObj.id);

            const emailPrefix = teacherObj.email?.split('@')[0];
            const fallbackName = emailPrefix === 'js' ? 'Johnny Shaw' : (emailPrefix || 'Johnny Shaw');
            const teacherName = teacherObj.name && teacherObj.name !== 'js' ? teacherObj.name : fallbackName;

            const userObj: User = {
              id: teacherObj.user_id || teacherObj.id || `u-custom-${Date.now()}`,
              role: 'teacher',
              name: teacherName,
              email: teacherObj.email || '',
              avatar_url: avatarUrl,
              gender: teacherGender,
            };

            const profileObj: Teacher = {
              id: teacherObj.id || `t-${teacherObj.user_id}`,
              user_id: teacherObj.user_id || userObj.id,
              instrument: teacherObj.instrument || '吉他',
              bio: teacherObj.bio || '專業吉他與音樂教師',
              gender: teacherGender,
            };

            setCustomTeacherUser(userObj);
            setCustomTeacherProfile(profileObj);
          }
          setCurrentRole('teacher');
          setIsAuthenticated(true);
        } catch (e) {
          console.error('Failed to parse auth_teacher:', e);
        }
      }
    };

    syncAuth();
  }, [isAuthenticated]);

  React.useEffect(() => {
    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION')) {
        setIsAuthenticated(true);
        // Pure state update only - strictly no routing or redirects executed here
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = (email: string, pass: string, role: Role) => {
    if (role === 'teacher') {
      const targetEmail = email.trim().toLowerCase();
      const matchedIdx = PRESET_TEACHERS.findIndex((t) => t.user.email.toLowerCase() === targetEmail);

      if (matchedIdx !== -1) {
        if (pass === '12345678' || pass === 'Teacher#2026' || pass === 'teacher123') {
          setActiveTeacherIdx(matchedIdx);
          setCustomTeacherUser(null);
          setCustomTeacherProfile(null);
          const matchedPair = PRESET_TEACHERS[matchedIdx];
          const teacherObj = {
            id: matchedPair.teacher.id,
            user_id: matchedPair.user.id,
            name: matchedPair.user.name,
            email: matchedPair.user.email,
            avatar_url: matchedPair.user.avatar_url,
            instrument: matchedPair.teacher.instrument,
            bio: matchedPair.teacher.bio,
          };
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_teacher', JSON.stringify(teacherObj));
          }
          setCurrentRole('teacher');
          setIsAuthenticated(true);
          return { success: true, message: `登入成功！歡迎 ${matchedPair.user.name}。` };
        } else {
          return { success: false, message: '密碼錯誤！(密碼為 12345678 或 Teacher#2026)' };
        }
      } else {
        // Custom registered teacher login
        const savedStr = typeof window !== 'undefined' ? localStorage.getItem('auth_teacher') : null;
        let teacherObj = savedStr ? JSON.parse(savedStr) : null;

        if (!teacherObj || teacherObj.email?.toLowerCase() !== targetEmail) {
          const userName = targetEmail.split('@')[0] || '認證老師';
          const avatarUrl = getAvatarByGender('female', targetEmail);
          teacherObj = {
            id: `t-reg-${Date.now()}`,
            user_id: `u-reg-${Date.now()}`,
            name: userName,
            email: targetEmail,
            avatar_url: avatarUrl,
            instrument: '音樂指導',
            bio: '新申請認證教師',
          };
        }

        const userObj: User = {
          id: teacherObj.user_id || teacherObj.id,
          role: 'teacher',
          name: teacherObj.name,
          email: teacherObj.email,
          avatar_url: teacherObj.avatar_url,
        };

        const profileObj: Teacher = {
          id: teacherObj.id,
          user_id: teacherObj.user_id || userObj.id,
          instrument: teacherObj.instrument,
          bio: teacherObj.bio,
        };

        setCustomTeacherUser(userObj);
        setCustomTeacherProfile(profileObj);
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_teacher', JSON.stringify(teacherObj));
        }

        setCurrentRole('teacher');
        setIsAuthenticated(true);
        return { success: true, message: `登入成功！歡迎 ${teacherObj.name} 老師。` };
      }
    } else {
      setCurrentRole('student');
      setIsAuthenticated(true);
      return { success: true, message: '登入成功！歡迎進入學生端體驗。' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCustomTeacherUser(null);
    setCustomTeacherProfile(null);
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
    }
  };

  const switchRole = (role: Role) => {
    setCurrentRole(role);
    setIsAuthenticated(true);
  };

  const toggleSlotAvailability = (slotId: string) => {
    setScheduleSlots((prev) =>
      prev.map((slot) => (slot.id === slotId ? { ...slot, is_available: !slot.is_available } : slot))
    );
  };

  const addScheduleSlot = (startTime: string, endTime: string) => {
    const newSlot: ScheduleSlot = {
      id: `slot-${Date.now()}`,
      teacher_id: teacherProfile.id,
      start_time: startTime,
      end_time: endTime,
      is_available: true,
    };
    setScheduleSlots((prev) => [...prev, newSlot]);
  };

  const requestReschedule = (appointmentId: string, slotId: string, reason?: string) => {
    const targetSlot = scheduleSlots.find((s) => s.id === slotId);
    if (!targetSlot || !targetSlot.is_available) {
      return { success: false, message: '該時段已不可預約或不存在。' };
    }

    const slotStart = new Date(targetSlot.start_time).getTime();
    const slotEnd = new Date(targetSlot.end_time).getTime();

    const isClashing = appointments.some((app) => {
      if (app.status !== 'confirmed') return false;
      const appStart = new Date(app.start_time).getTime();
      const appEnd = new Date(app.end_time).getTime();
      return Math.max(slotStart, appStart) < Math.min(slotEnd, appEnd);
    });

    if (isClashing) {
      return { success: false, message: '該時段已被預約，衝突保護觸發！' };
    }

    const targetApp = appointments.find((a) => a.id === appointmentId);
    if (!targetApp) {
      return { success: false, message: '找不到欲調課的舊課程。' };
    }

    const oldStartIso = targetApp.start_time;
    const origTime = targetApp.original_start_time || oldStartIso;
    const isRestored = new Date(targetSlot.start_time).getTime() === new Date(origTime).getTime();

    setScheduleSlots((prev) =>
      prev.map((s) => {
        if (s.id === slotId) {
          return { ...s, is_available: false };
        }
        if (new Date(s.start_time).getTime() === new Date(oldStartIso).getTime()) {
          return { ...s, is_available: true };
        }
        return s;
      })
    );

    setAppointments((prev) =>
      prev.map((app) => {
        if (app.id === appointmentId) {
          return {
            ...app,
            start_time: targetSlot.start_time,
            end_time: targetSlot.end_time,
            status: isRestored ? 'restored' : 'rescheduled',
          };
        }
        return app;
      })
    );

    return { success: true, message: '調課成功！課表已即時同步更新。' };
  };

  const addLessonRecord = (recordData: Omit<LessonRecord, 'id' | 'created_at'>) => {
    const newRecord: LessonRecord = {
      ...recordData,
      id: `lesson-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setLessonRecords((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const updateDemoVideo = (id: string, updates: Partial<TeacherDemoVideo>) => {
    setDemoVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
  };

  const addPracticeVideo = (practiceData: Omit<StudentPracticeVideo, 'id' | 'created_at'>) => {
    const newPractice: StudentPracticeVideo = {
      ...practiceData,
      id: `practice-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setPracticeVideos((prev) => [newPractice, ...prev]);
    return newPractice;
  };

  return (
    <DemoContext.Provider
      value={{
        isAuthenticated,
        showLoginModal,
        setShowLoginModal,
        currentRole,
        currentUser,
        teacherProfile,
        studentProfile: MOCK_STUDENT,
        scheduleSlots,
        setScheduleSlots,
        appointments,
        setAppointments,
        rescheduleRequests,
        lessonRecords,
        demoVideos,
        practiceVideos,
        presetTeachers: PRESET_TEACHERS,
        login,
        logout,
        switchRole,
        toggleSlotAvailability,
        addScheduleSlot,
        requestReschedule,
        addLessonRecord,
        updateDemoVideo,
        addPracticeVideo,
      }}
    >
      {children}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </DemoContext.Provider>
  );
};

export const useDemoContext = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemoContext must be used within a DemoProvider');
  }
  return context;
};
