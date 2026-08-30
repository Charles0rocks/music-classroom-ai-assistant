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

// Preset 5 Teachers with Credentials (Password: Teacher#2026)
export const PRESET_TEACHERS: { user: User; teacher: Teacher }[] = [
  {
    user: {
      id: 'u-chang-001',
      role: 'teacher',
      name: '張老師',
      email: 'chang.teacher@harmony.edu',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
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
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
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
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
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
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
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
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
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
  email: 'student@harmony.edu',
  avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
};

const MOCK_STUDENT: Student = {
  id: 's0000000-0000-0000-0000-000000000002',
  user_id: MOCK_STUDENT_USER.id,
  teacher_id: PRESET_TEACHERS[0].teacher.id,
};

// CLEAN INITIAL STATES (100% pure initialization, 0 pre-populated mock appointment cards!)
const INITIAL_SLOTS: ScheduleSlot[] = [];
const INITIAL_APPOINTMENTS: Appointment[] = [];
const INITIAL_LESSONS: LessonRecord[] = [];
const INITIAL_DEMO_VIDEOS: TeacherDemoVideo[] = [];
const INITIAL_PRACTICE_VIDEOS: StudentPracticeVideo[] = [];

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
  const [currentRole, setCurrentRole] = useState<Role>('teacher');
  const [activeTeacherIdx, setActiveTeacherIdx] = useState<number>(0);

  const [scheduleSlots, setScheduleSlots] = useState<ScheduleSlot[]>(INITIAL_SLOTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [rescheduleRequests, setRescheduleRequests] = useState<RescheduleRequest[]>([]);
  const [lessonRecords, setLessonRecords] = useState<LessonRecord[]>(INITIAL_LESSONS);
  const [demoVideos, setDemoVideos] = useState<TeacherDemoVideo[]>(INITIAL_DEMO_VIDEOS);
  const [practiceVideos, setPracticeVideos] = useState<StudentPracticeVideo[]>(INITIAL_PRACTICE_VIDEOS);

  const activeTeacherPair = PRESET_TEACHERS[activeTeacherIdx] || PRESET_TEACHERS[0];
  const currentUser = currentRole === 'teacher' ? activeTeacherPair.user : MOCK_STUDENT_USER;
  const teacherProfile = activeTeacherPair.teacher;

  const login = (email: string, pass: string, role: Role) => {
    if (role === 'teacher') {
      const targetEmail = email.trim().toLowerCase();
      const matchedIdx = PRESET_TEACHERS.findIndex((t) => t.user.email.toLowerCase() === targetEmail);

      if (matchedIdx !== -1) {
        // Accept Teacher#2026 or legacy teacher123
        if (pass === 'Teacher#2026' || pass === 'teacher123') {
          setActiveTeacherIdx(matchedIdx);
          setCurrentRole('teacher');
          setIsAuthenticated(true);
          return { success: true, message: `登入成功！歡迎 ${PRESET_TEACHERS[matchedIdx].user.name}。` };
        } else {
          return { success: false, message: '密碼錯誤！預設密碼為 Teacher#2026' };
        }
      } else {
        return { success: false, message: '找不到該教師 Email 帳號。' };
      }
    } else {
      setCurrentRole('student');
      setIsAuthenticated(true);
      return { success: true, message: '登入成功！歡迎進入學生端體驗。' };
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
