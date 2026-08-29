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

// Mock Seed Users & Profiles
const MOCK_TEACHER_USER: User = {
  id: 'u0000000-0000-0000-0000-000000000001',
  role: 'teacher',
  name: '張老師 (Teacher Chang)',
  email: 'chang.teacher@harmony.edu',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

const MOCK_STUDENT_USER: User = {
  id: 'u0000000-0000-0000-0000-000000000002',
  role: 'student',
  name: '小明 (Ming)',
  email: 'ming.student@harmony.edu',
  avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
};

const MOCK_TEACHER: Teacher = {
  id: 't0000000-0000-0000-0000-000000000001',
  user_id: MOCK_TEACHER_USER.id,
  instrument: '小提琴 (Violin) & 鋼琴 (Piano)',
  bio: '國立音樂學院碩士，10年專業小提琴與古典鋼琴教學經驗。專精於古典演奏與AI音聲診斷。',
};

const MOCK_STUDENT: Student = {
  id: 's0000000-0000-0000-0000-000000000002',
  user_id: MOCK_STUDENT_USER.id,
  teacher_id: MOCK_TEACHER.id,
};

// Initial Slots (Dynamic relative to current week)
const getDynamicDate = (daysToAdd: number, hours: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysToAdd);
  d.setHours(hours, 0, 0, 0);
  return d.toISOString();
};

const INITIAL_SLOTS: ScheduleSlot[] = [
  {
    id: 'slot-1',
    teacher_id: MOCK_TEACHER.id,
    start_time: getDynamicDate(1, 14), // Tomorrow 14:00 (Afternoon)
    end_time: getDynamicDate(1, 15),
    is_available: true,
  },
  {
    id: 'slot-2',
    teacher_id: MOCK_TEACHER.id,
    start_time: getDynamicDate(1, 16), // Tomorrow 16:00 (Afternoon)
    end_time: getDynamicDate(1, 17),
    is_available: true,
  },
  {
    id: 'slot-3',
    teacher_id: MOCK_TEACHER.id,
    start_time: getDynamicDate(2, 10), // Day after tomorrow 10:00 (Morning)
    end_time: getDynamicDate(2, 11),
    is_available: true,
  },
  {
    id: 'slot-4',
    teacher_id: MOCK_TEACHER.id,
    start_time: getDynamicDate(2, 15), // Day after tomorrow 15:00 (Afternoon)
    end_time: getDynamicDate(2, 16),
    is_available: false, // Booked by another student
  },
  {
    id: 'slot-5',
    teacher_id: MOCK_TEACHER.id,
    start_time: getDynamicDate(3, 19), // 3 days later 19:00 (Evening)
    end_time: getDynamicDate(3, 20),
    is_available: true,
  },
  {
    id: 'slot-6',
    teacher_id: MOCK_TEACHER.id,
    start_time: getDynamicDate(4, 14),
    end_time: getDynamicDate(4, 15),
    is_available: true,
  },
  {
    id: 'slot-7',
    teacher_id: MOCK_TEACHER.id,
    start_time: getDynamicDate(5, 11),
    end_time: getDynamicDate(5, 12),
    is_available: true,
  },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-1',
    student_id: MOCK_STUDENT.id,
    student_name: '小明',
    teacher_id: MOCK_TEACHER.id,
    start_time: getDynamicDate(1, 10), // Tomorrow 10:00 - 11:00 (Morning)
    original_start_time: getDynamicDate(1, 10),
    end_time: getDynamicDate(1, 11),
    status: 'confirmed',
  },
  {
    id: 'app-2',
    student_id: 's0000000-other-student',
    student_name: '小華',
    teacher_id: MOCK_TEACHER.id,
    start_time: getDynamicDate(2, 15),
    original_start_time: getDynamicDate(2, 15),
    end_time: getDynamicDate(2, 16),
    status: 'confirmed',
  },
  {
    id: 'app-3',
    student_id: MOCK_STUDENT.id,
    student_name: '小明',
    teacher_id: MOCK_TEACHER.id,
    start_time: getDynamicDate(4, 19), // 4 days later 19:00 (Evening)
    original_start_time: getDynamicDate(4, 19),
    end_time: getDynamicDate(4, 20),
    status: 'confirmed',
  },
];

const INITIAL_LESSONS: LessonRecord[] = [
  {
    id: 'lesson-1',
    appointment_id: 'app-prev-1',
    audio_url: 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg',
    raw_transcript: '小明今天來練習巴哈E大調小提琴協奏曲。整體音高表現不錯，但是到了第24小節換弓的地方右手姿勢太緊繃了，導致聲音有點乾硬。樂理部分要特別注意十六分音符的拍子，不要搶拍！回家作業請把第16到32小節用 BPM 72 慢練10遍，把音準跟弓法拉平順。加油！你這周進步很多！',
    clean_summary_json: {
      highlights: ['巴哈E大調音高控制穩定', '讀譜速度提升'],
      technical_tips: ['第24小節換弓時放鬆右手手腕與持弓角度', '保持弓毛與琴弦垂直度'],
      homework: ['第16 - 32小節慢練 10 次', '使用節拍器由 BPM 72 逐步練至 BPM 88'],
      encouragement: '這週琴音圓潤許多，只要右手放鬆音色會更加華麗亮眼！加油！',
      bpm_recommendation: 72,
    },
    created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    song_title: '巴哈：E大調小提琴協奏曲 第一樂章',
  },
];

const INITIAL_DEMO_VIDEOS: TeacherDemoVideo[] = [
  {
    id: 'demo-1',
    teacher_id: MOCK_TEACHER.id,
    title: '巴哈：E大調小提琴協奏曲 第一樂章範例 (張老師示範)',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    midi_data: { bpm: 96, key: 'E Major' },
    tags: ['小提琴', '巴哈', '弓法控制', '經典名曲'],
    pitch_tolerance: 5,
    tempo_tolerance: 8,
    created_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
  },
];

const INITIAL_PRACTICE_VIDEOS: StudentPracticeVideo[] = [
  {
    id: 'practice-1',
    student_id: MOCK_STUDENT.id,
    demo_video_id: 'demo-1',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    ai_feedback_json: {
      overall_score: 84,
      pitch_accuracy: 88,
      rhythm_accuracy: 79,
      bpm_detected: 102,
      summary: '整體表現富有音樂感！唯獨第 0:14 處節奏出現偏快（搶拍 6%），以及第 0:28 換指處音高偏高 15 cents。建議參考右側老師 Demo 調整運弓步調。',
      timeline_markers: [
        {
          time: 5,
          type: 'posture',
          severity: 'good',
          title: '起弓姿勢標準',
          description: '持弓手型自然，右手腕放鬆適度。',
          recommendation: '保持當前手型狀態。',
        },
        {
          time: 14,
          type: 'rhythm',
          severity: 'warning',
          title: '第 16 小節十六分音符搶拍',
          description: '偵測到演奏速度達到 104 BPM（老師範例為 96 BPM）。',
          recommendation: '建議搭配節拍器，在第 14-18 秒處保持穩定踏拍。',
        },
        {
          time: 28,
          type: 'pitch',
          severity: 'error',
          title: '第 32 小節升 C (C#) 音高偏高',
          description: '音高測量高出標準頻率 +18 cents。',
          recommendation: '第二指按弦位置需稍微後退 2 毫米，注意按弦力量。',
        },
      ],
    },
  },
];

interface DemoContextType {
  isAuthenticated: boolean;
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
  // Set default unauthenticated so users land on the Greeting & Identity Selector Login Screen
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<Role>('teacher');
  const [scheduleSlots, setScheduleSlots] = useState<ScheduleSlot[]>(INITIAL_SLOTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [rescheduleRequests, setRescheduleRequests] = useState<RescheduleRequest[]>([]);
  const [lessonRecords, setLessonRecords] = useState<LessonRecord[]>(INITIAL_LESSONS);
  const [demoVideos, setDemoVideos] = useState<TeacherDemoVideo[]>(INITIAL_DEMO_VIDEOS);
  const [practiceVideos, setPracticeVideos] = useState<StudentPracticeVideo[]>(INITIAL_PRACTICE_VIDEOS);

  const currentUser = currentRole === 'teacher' ? MOCK_TEACHER_USER : MOCK_STUDENT_USER;

  const login = (email: string, pass: string, role: Role) => {
    if (role === 'teacher') {
      if (email.trim() === 'chang.teacher@harmony.edu' && pass === 'teacher123') {
        setCurrentRole('teacher');
        setIsAuthenticated(true);
        return { success: true, message: '登入成功！歡迎張老師。' };
      } else {
        return { success: false, message: '帳號或密碼錯誤（預設帳號: chang.teacher@harmony.edu / 密碼: teacher123）' };
      }
    } else {
      if (email.trim() === 'ming.student@harmony.edu' && pass === 'student123') {
        setCurrentRole('student');
        setIsAuthenticated(true);
        return { success: true, message: '登入成功！歡迎小明同學。' };
      } else {
        return { success: false, message: '帳號或密碼錯誤（預設帳號: ming.student@harmony.edu / 密碼: student123）' };
      }
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
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
      teacher_id: MOCK_TEACHER.id,
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
      return { success: false, message: '該時段已被其他學生預約，衝突保護觸發！' };
      return { success: false, message: '該開放時段已不可預約或不存在。' };
    }

    const targetApp = appointments.find((a) => a.id === appointmentId);
    if (!targetApp) {
      return { success: false, message: '找不到欲調課的舊課程。' };
    }

    // 24-hour restriction check
    const now = new Date().getTime();
    const oldStartTime = new Date(targetApp.start_time).getTime();
    const diffHours = (oldStartTime - now) / (1000 * 60 * 60);
    if (diffHours < 24) {
      return { success: false, message: '上課前 24 小時內不接受線上調課，請直接聯繫老師！' };
    }

    const oldStartIso = targetApp.start_time;
    const origTime = targetApp.original_start_time || oldStartIso;
    const isRestored = new Date(targetSlot.start_time).getTime() === new Date(origTime).getTime();

    // 1. Target slot becomes unavailable (consumed) & old open slot becomes available (restored)
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

    // 2. Update appointment to target slot time & check if restored to original time
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

    return { success: true, message: '調課成功！舊課程已成功移至新時段，全站與老師端課表已即時同步連動。' };
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
        currentRole,
        currentUser,
        teacherProfile: MOCK_TEACHER,
        studentProfile: MOCK_STUDENT,
        scheduleSlots,
        setScheduleSlots,
        appointments,
        setAppointments,
        rescheduleRequests,
        lessonRecords,
        demoVideos,
        practiceVideos,
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
