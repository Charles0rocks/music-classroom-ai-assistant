'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDemoContext } from '@/context/DemoContext';
import {
  Calendar as CalendarIcon,
  Clock,
  Check,
  X,
  Plus,
  User,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Repeat,
  Sliders,
  Layers,
  BookOpen,
  ArrowRightLeft,
  Trash2,
  GripVertical,
} from 'lucide-react';
import { ScheduleSlot, Appointment } from '@/types';

const DAYS = [
  { key: 1, label: '週一', short: 'Mon' },
  { key: 2, label: '週二', short: 'Tue' },
  { key: 3, label: '週三', short: 'Wed' },
  { key: 4, label: '週四', short: 'Thu' },
  { key: 5, label: '週五', short: 'Fri' },
  { key: 6, label: '週六', short: 'Sat' },
  { key: 0, label: '週日', short: 'Sun' },
];

const TIME_BLOCKS = [
  { key: 'morning', label: '上午', sub: '09:00 - 12:00', icon: Sun, startHour: 9, endHour: 12 },
  { key: 'afternoon', label: '下午', sub: '13:00 - 18:00', icon: Sunset, startHour: 13, endHour: 18 },
  { key: 'evening', label: '晚間', sub: '19:00 - 22:00', icon: Moon, startHour: 19, endHour: 22 },
];

type ScheduleMode = 'recurring' | 'openSlot' | 'reschedule';

interface RecurringScheduleLog {
  id: string;
  studentName: string;
  dayKey: number;
  monthDay: string;
  dayLabel: string;
  blockKey: string;
  startTime: string;
  endTime: string;
}

// Student Color Mapping Rules (iOS Calendar Style Left Accent Border):
const getStudentCardStyle = (studentName: string) => {
  if (studentName.includes('小明')) {
    return 'bg-[#E3F2FD] border-[#BBDEFB] border-l-4 border-l-[#1565C0] text-[#1565C0] shadow-xs';
  } else if (studentName.includes('小華')) {
    return 'bg-[#EDE7F6] border-[#D1C4E9] border-l-4 border-l-[#4527A0] text-[#4527A0] shadow-xs';
  } else if (studentName.includes('小美')) {
    return 'bg-[#FCE4EC] border-[#F8BBD0] border-l-4 border-l-[#C2185B] text-[#C2185B] shadow-xs';
  } else if (studentName.includes('小王')) {
    return 'bg-[#FFF3E0] border-[#FFE0B2] border-l-4 border-l-[#E65100] text-[#E65100] shadow-xs';
  } else {
    return 'bg-[#E8EAF6] border-[#C5CAE9] border-l-4 border-l-[#283593] text-[#283593] shadow-xs';
  }
};

export default function TeacherSchedulePage() {
  const router = useRouter();
  const {
    currentRole,
    scheduleSlots,
    setScheduleSlots,
    toggleSlotAvailability,
    addScheduleSlot,
    appointments,
    setAppointments,
    teacherProfile,
  } = useDemoContext();

  // Strict Role Guard: Students trying to access Teacher Schedule MUST be redirected to Student Schedule immediately
  useEffect(() => {
    if (currentRole === 'student') {
      router.replace('/student/schedule');
    }
  }, [currentRole, router]);

  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [scheduleMode, setScheduleMode] = useState<ScheduleMode>('recurring');

  // Form State for Mode 1: 1. 常態課表 (Supports Custom Typing!)
  const [recurringStudent, setRecurringStudent] = useState('小明');
  const [recurringDayKey, setRecurringDayKey] = useState<number>(3);
  const [recurringBlockKey, setRecurringBlockKey] = useState<string>('morning');
  const [recurringStartTime, setRecurringStartTime] = useState('10:00');
  const [recurringEndTime, setRecurringEndTime] = useState('11:00');

  // Persistent Log Array for Registered Recurring Schedules in "課表設定" Panel
  const [recurringLogs, setRecurringLogs] = useState<RecurringScheduleLog[]>([
    {
      id: 'rec-log-1',
      studentName: '小明',
      dayKey: 3,
      monthDay: '08/19',
      dayLabel: '週三',
      blockKey: 'morning',
      startTime: '10:00',
      endTime: '11:00',
    },
    {
      id: 'rec-log-2',
      studentName: '小華',
      dayKey: 4,
      monthDay: '08/20',
      dayLabel: '週四',
      blockKey: 'afternoon',
      startTime: '15:00',
      endTime: '16:00',
    },
  ]);

  // Form State for Mode 2: 2. 開放時段
  const [openDayKey, setOpenDayKey] = useState<number>(4);
  const [openBlockKey, setOpenBlockKey] = useState<string>('afternoon');
  const [openStartTime, setOpenStartTime] = useState('14:00');
  const [openEndTime, setOpenEndTime] = useState('15:00');

  // Form State for Mode 3: 3. 課程異動
  const [rescheduleAppId, setRescheduleAppId] = useState<string>(appointments[0]?.id || '');
  const [rescheduleDayKey, setRescheduleDayKey] = useState<number>(4);
  const [rescheduleBlockKey, setRescheduleBlockKey] = useState<string>('morning');
  const [rescheduleStartTime, setRescheduleStartTime] = useState('10:00');
  const [rescheduleEndTime, setRescheduleEndTime] = useState('11:00');

  const [settingNotice, setSettingNotice] = useState<string | null>(null);

  // HTML5 Drag and Drop State
  const [draggedCard, setDraggedCard] = useState<{ type: 'appointment' | 'slot'; id: string } | null>(null);

  // Modal State for Single Quick Add
  const [selectedDayKey, setSelectedDayKey] = useState<number>(3);
  const [selectedBlockKey, setSelectedBlockKey] = useState<string>('afternoon');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStartTime, setNewStartTime] = useState('14:00');
  const [newEndTime, setNewEndTime] = useState('15:00');

  // Compute Current Week Dates relative to Monday
  const getWeekDates = (offset: number) => {
    const now = new Date();
    const currentDay = now.getDay();
    const distanceToMon = currentDay === 0 ? -6 : 1 - currentDay;

    const monday = new Date(now);
    monday.setDate(now.getDate() + distanceToMon + offset * 7);
    monday.setHours(0, 0, 0, 0);

    const weekDates = DAYS.map((d, idx) => {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + idx);
      const year = dayDate.getFullYear();
      const month = String(dayDate.getMonth() + 1).padStart(2, '0');
      const date = String(dayDate.getDate()).padStart(2, '0');
      return {
        key: d.key,
        dayLabel: d.label,
        short: d.short,
        monthDay: `${month}/${date}`,
        fullDateStr: `${year}-${month}-${date}`,
        year: year,
        dateObj: dayDate,
      };
    });

    const sundayDate = weekDates[6].dateObj;
    const yearBanner = `${monday.getFullYear()} 年 · ${String(monday.getMonth() + 1).padStart(2, '0')}月${String(monday.getDate()).padStart(2, '0')}日 至 ${String(sundayDate.getMonth() + 1).padStart(2, '0')}月${String(sundayDate.getDate()).padStart(2, '0')}日`;

    return { weekDates, yearBanner };
  };

  const { weekDates, yearBanner } = getWeekDates(weekOffset);

  if (currentRole === 'student') {
    return null;
  }

  const getSlotDayOfWeek = (isoString: string) => new Date(isoString).getDay();
  const getSlotHour = (isoString: string) => new Date(isoString).getHours();

  const isTimeInBlock = (hour: number, blockKey: string) => {
    if (blockKey === 'morning') return hour >= 8 && hour < 12;
    if (blockKey === 'afternoon') return hour >= 12 && hour < 18;
    return hour >= 18 && hour < 23;
  };

  const handleOpenAddModal = (dayKey: number, blockKey: string) => {
    setSelectedDayKey(dayKey);
    setSelectedBlockKey(blockKey);
    if (blockKey === 'morning') {
      setNewStartTime('10:00');
      setNewEndTime('11:00');
    } else if (blockKey === 'afternoon') {
      setNewStartTime('14:00');
      setNewEndTime('15:00');
    } else {
      setNewStartTime('19:00');
      setNewEndTime('20:00');
    }
    setShowAddModal(true);
  };

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const targetDayObj = weekDates.find((w) => w.key === selectedDayKey);
    const datePrefix = targetDayObj ? targetDayObj.fullDateStr : new Date().toISOString().split('T')[0];

    const startIso = new Date(`${datePrefix}T${newStartTime}`).toISOString();
    const endIso = new Date(`${datePrefix}T${newEndTime}`).toISOString();

    addScheduleSlot(startIso, endIso);
    setShowAddModal(false);
  };

  // Submit Handler for Top "課表設定" Block
  const handleSettingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (scheduleMode === 'recurring') {
      const studentNameInput = recurringStudent.trim() || '學生';
      const targetDayObj = weekDates.find((w) => w.key === recurringDayKey);
      const datePrefix = targetDayObj ? targetDayObj.fullDateStr : new Date().toISOString().split('T')[0];

      const startIso = new Date(`${datePrefix}T${recurringStartTime}`).toISOString();
      const endIso = new Date(`${datePrefix}T${recurringEndTime}`).toISOString();

      // Add to Appointments list
      const newApp: Appointment = {
        id: `app-custom-${Date.now()}`,
        student_id: `s-custom-${Date.now()}`,
        student_name: studentNameInput,
        teacher_id: teacherProfile.id,
        start_time: startIso,
        original_start_time: startIso,
        end_time: endIso,
        status: 'confirmed',
      };
      setAppointments((prev) => [...prev, newApp]);

      // Record in "課表設定" Panel Logs
      const newLog: RecurringScheduleLog = {
        id: `rec-${Date.now()}`,
        studentName: studentNameInput,
        dayKey: recurringDayKey,
        monthDay: targetDayObj?.monthDay || '',
        dayLabel: targetDayObj?.dayLabel || '',
        blockKey: recurringBlockKey,
        startTime: recurringStartTime,
        endTime: recurringEndTime,
      };
      setRecurringLogs((prev) => [newLog, ...prev]);

      setSettingNotice(`已成功新增並記錄常態課表：【${studentNameInput}】· ${targetDayObj?.monthDay} ${targetDayObj?.dayLabel} ${recurringStartTime}-${recurringEndTime}！`);
    } else if (scheduleMode === 'openSlot') {
      const targetDayObj = weekDates.find((w) => w.key === openDayKey);
      const datePrefix = targetDayObj ? targetDayObj.fullDateStr : new Date().toISOString().split('T')[0];

      const startIso = new Date(`${datePrefix}T${openStartTime}`).toISOString();
      const endIso = new Date(`${datePrefix}T${openEndTime}`).toISOString();

      addScheduleSlot(startIso, endIso);
      setSettingNotice(`已成功新增「2. 開放時段」：${targetDayObj?.monthDay} ${targetDayObj?.dayLabel} ${openStartTime}-${openEndTime}！`);
    } else {
      // Mode 3: 3. 課程異動
      const targetApp = appointments.find((a) => a.id === rescheduleAppId);
      if (!targetApp) return;

      const targetDayObj = weekDates.find((w) => w.key === rescheduleDayKey);
      const datePrefix = targetDayObj ? targetDayObj.fullDateStr : new Date().toISOString().split('T')[0];

      const newStartIso = new Date(`${datePrefix}T${rescheduleStartTime}`).toISOString();
      const newEndIso = new Date(`${datePrefix}T${rescheduleEndTime}`).toISOString();

      const oldStartIso = targetApp.start_time;
      const origTime = targetApp.original_start_time || oldStartIso;
      const isRestored = new Date(newStartIso).getTime() === new Date(origTime).getTime();

      // 1. Update appointment
      setAppointments((prev) =>
        prev.map((app) =>
          app.id === rescheduleAppId
            ? {
                ...app,
                start_time: newStartIso,
                end_time: newEndIso,
                status: isRestored ? 'restored' : 'rescheduled',
              }
            : app
        )
      );

      // 2. Open Slots Sync: Disable target slot, re-enable old slot
      setScheduleSlots((prev) =>
        prev.map((s) => {
          if (new Date(s.start_time).getTime() === new Date(newStartIso).getTime()) {
            return { ...s, is_available: false };
          }
          if (new Date(s.start_time).getTime() === new Date(oldStartIso).getTime()) {
            return { ...s, is_available: true };
          }
          return s;
        })
      );

      if (isRestored) {
        setSettingNotice(`已成功協助【${targetApp.student_name}】恢復至原上課時間 (${targetDayObj?.monthDay} ${targetDayObj?.dayLabel} ${rescheduleStartTime}-${rescheduleEndTime})，原本的開放時段已自動恢復顯示！`);
      } else {
        setSettingNotice(`已成功協助【${targetApp.student_name}】完成「3. 課程異動」，調整至 ${targetDayObj?.monthDay} ${targetDayObj?.dayLabel} ${rescheduleStartTime}-${rescheduleEndTime}！`);
      }
    }

    setTimeout(() => {
      setSettingNotice(null);
    }, 4000);
  };

  const handleRemoveRecurringLog = (logId: string) => {
    setRecurringLogs((prev) => prev.filter((l) => l.id !== logId));
  };

  // Drag and Drop Logic Execution (Move Card to Target Cell)
  const handleDropOnCell = (dayKey: number, blockKey: string) => {
    if (!draggedCard) return;

    const targetDayObj = weekDates.find((w) => w.key === dayKey);
    const datePrefix = targetDayObj ? targetDayObj.fullDateStr : new Date().toISOString().split('T')[0];

    let defaultStartTime = '10:00';
    let defaultEndTime = '11:00';

    if (blockKey === 'afternoon') {
      defaultStartTime = '14:00';
      defaultEndTime = '15:00';
    } else if (blockKey === 'evening') {
      defaultStartTime = '19:00';
      defaultEndTime = '20:00';
    }

    const newStartIso = new Date(`${datePrefix}T${defaultStartTime}`).toISOString();
    const newEndIso = new Date(`${datePrefix}T${defaultEndTime}`).toISOString();

    if (draggedCard.type === 'appointment') {
      const targetApp = appointments.find((a) => a.id === draggedCard.id);
      const oldStartIso = targetApp?.start_time || newStartIso;
      const origTime = targetApp?.original_start_time || oldStartIso;
      const isRestored = origTime && new Date(newStartIso).getTime() === new Date(origTime).getTime();

      // 1. Update appointment start & end time, and set status
      setAppointments((prev) =>
        prev.map((app) =>
          app.id === draggedCard.id
            ? {
                ...app,
                start_time: newStartIso,
                end_time: newEndIso,
                status: isRestored ? 'restored' : 'rescheduled',
              }
            : app
        )
      );

      // 2. Open Slots Sync: Disable target open slot, Re-enable old open slot if restored/moved
      setScheduleSlots((prev) =>
        prev.map((s) => {
          if (new Date(s.start_time).getTime() === new Date(newStartIso).getTime()) {
            return { ...s, is_available: false };
          }
          if (new Date(s.start_time).getTime() === new Date(oldStartIso).getTime()) {
            return { ...s, is_available: true };
          }
          return s;
        })
      );

      if (isRestored) {
        setSettingNotice(`已成功將【${targetApp?.student_name || '學生'}】的課程恢復至原上課時間 (${targetDayObj?.monthDay} ${targetDayObj?.dayLabel} ${defaultStartTime}-${defaultEndTime})，原本的開放時段已自動恢復顯示！`);
      } else {
        setSettingNotice(`已成功將【${targetApp?.student_name || '學生'}】的課程拖曳異動至 ${targetDayObj?.monthDay} ${targetDayObj?.dayLabel} (${defaultStartTime}-${defaultEndTime})！`);
      }
    } else if (draggedCard.type === 'slot') {
      setScheduleSlots((prev) =>
        prev.map((slot) =>
          slot.id === draggedCard.id
            ? {
                ...slot,
                start_time: newStartIso,
                end_time: newEndIso,
              }
            : slot
        )
      );
      setSettingNotice(`已成功將「開放時段」拖曳移動至 ${targetDayObj?.monthDay} ${targetDayObj?.dayLabel} (${defaultStartTime}-${defaultEndTime})！`);
    }

    setDraggedCard(null);
    setTimeout(() => setSettingNotice(null), 4000);
  };

  const formatTimeRange = (startIso: string, endIso: string) => {
    const s = new Date(startIso).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false });
    const e = new Date(endIso).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${s} - ${e}`;
  };

  const formatFullDateStr = (isoString: string) => {
    const d = new Date(isoString);
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const date = String(d.getDate()).padStart(2, '0');
    const dayName = DAYS.find((item) => item.key === d.getDay())?.label || '';
    return `${m}/${date} ${dayName}`;
  };

  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayColIdx = weekDates.findIndex((d) => d.fullDateStr === todayDateStr);

  // Synchronized scroll refs for 2D Split Pane (Requirements 1 & 2)
  const headerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const handleBodyScroll = () => {
    if (bodyRef.current) {
      if (headerRef.current) {
        headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
      }
      if (leftColRef.current) {
        leftColRef.current.scrollTop = bodyRef.current.scrollTop;
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 warm-card p-6 sm:p-8 rounded-3xl border border-[#EFECE6] shadow-warm bg-gradient-to-r from-white to-[#FAF2EC]">
        <div>
          <div className="flex items-center gap-2 text-[#8C6D53] text-xs font-bold uppercase tracking-wider mb-1">
            <CalendarIcon className="w-4 h-4" />
            Teacher Portal (P1)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332C27]">週課表與開放時段</h1>
          <p className="text-[#7A736E] text-xs sm:text-sm mt-1 font-medium">
            一週 (週一～週日) × 3大時段 矩陣視圖 · 支援自由輸入學生姓名紀錄與 HTML5 卡片拖曳移動
          </p>
        </div>

        <button
          onClick={() => handleOpenAddModal(3, 'afternoon')}
          className="px-5 py-2.5 rounded-full bg-[#8C6D53] hover:bg-[#765942] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-[#8C6D53]/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          新增開放時段 (Add Slot)
        </button>
      </div>

      {/* TOP BLOCK: 課表設定 (1. 常態課表  2. 開放時段  3. 課程異動 & 已記錄常態課表區塊) */}
      <div className="warm-card p-6 sm:p-8 rounded-3xl border border-[#EADFC9] border-l-8 border-l-[#8C6D53] shadow-warm space-y-6 bg-gradient-to-r from-[#FFFDF9] via-white to-[#FAF2EC]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EADFC9]/80 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#8C6D53]" />
            <h2 className="text-xl font-extrabold text-[#332C27]">
              課表設定
            </h2>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-[#FAF7F2] p-1.5 rounded-2xl border border-[#EADFC9]">
            <button
              type="button"
              onClick={() => setScheduleMode('recurring')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                scheduleMode === 'recurring'
                  ? 'bg-[#8C6D53] text-white shadow-sm'
                  : 'text-[#7A736E] hover:text-[#332C27]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              1. 常態課表
            </button>

            <button
              type="button"
              onClick={() => setScheduleMode('openSlot')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                scheduleMode === 'openSlot'
                  ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] shadow-sm font-extrabold'
                  : 'text-[#7A736E] hover:text-[#332C27]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
              2. 開放時段
            </button>

            <button
              type="button"
              onClick={() => {
                setScheduleMode('reschedule');
                if (appointments.length > 0) setRescheduleAppId(appointments[0].id);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                scheduleMode === 'reschedule'
                  ? 'bg-[#E3F2FD] text-[#1565C0] border border-[#BBDEFB] shadow-sm font-extrabold'
                  : 'text-[#7A736E] hover:text-[#332C27]'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-[#1565C0]" />
              3. 課程異動
            </button>
          </div>
        </div>

        {settingNotice && (
          <div className="p-3.5 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-xs font-bold text-[#2E7D32] flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2E7D32]" />
            {settingNotice}
          </div>
        )}

        {/* Dynamic Form according to Mode */}
        {scheduleMode === 'recurring' ? (
          /* Mode 1: 1. 常態課表 Form (Supports Custom Typing & Selecting) */
          <form onSubmit={handleSettingSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end pt-1">
            <div>
              <label className="block text-xs font-bold text-[#332C27] mb-1">
                1. 學生姓名 (可自由輸入或點選)
              </label>
              <input
                type="text"
                required
                list="student-suggestions"
                value={recurringStudent}
                onChange={(e) => setRecurringStudent(e.target.value)}
                placeholder="請輸入或選擇學生姓名..."
                className="w-full bg-white border border-[#EFECE6] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#332C27] focus:outline-none focus:border-[#8C6D53]"
              />
              <datalist id="student-suggestions">
                <option value="小明" />
                <option value="小華" />
                <option value="小美" />
                <option value="小王" />
                <option value="常態班學生" />
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#332C27] mb-1">
                固定日期
              </label>
              <select
                value={recurringDayKey}
                onChange={(e) => setRecurringDayKey(parseInt(e.target.value, 10))}
                className="w-full bg-white border border-[#EFECE6] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#332C27] focus:outline-none focus:border-[#8C6D53]"
              >
                {weekDates.map((d) => (
                  <option key={d.key} value={d.key}>
                    {d.monthDay} {d.dayLabel}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#332C27] mb-1">
                固定時段
              </label>
              <select
                value={recurringBlockKey}
                onChange={(e) => {
                  const bKey = e.target.value;
                  setRecurringBlockKey(bKey);
                  if (bKey === 'morning') {
                    setRecurringStartTime('10:00');
                    setRecurringEndTime('11:00');
                  } else if (bKey === 'afternoon') {
                    setRecurringStartTime('14:00');
                    setRecurringEndTime('15:00');
                  } else {
                    setRecurringStartTime('19:00');
                    setRecurringEndTime('20:00');
                  }
                }}
                className="w-full bg-white border border-[#EFECE6] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#332C27] focus:outline-none focus:border-[#8C6D53]"
              >
                <option value="morning">☀️ 上午</option>
                <option value="afternoon">🌤️ 下午</option>
                <option value="evening">🌙 晚間</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#332C27] mb-1">
                上課時間
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="time"
                  value={recurringStartTime}
                  onChange={(e) => setRecurringStartTime(e.target.value)}
                  className="w-full bg-white border border-[#EFECE6] rounded-2xl px-2.5 py-2 text-[11px] font-mono text-[#332C27]"
                />
                <span className="text-xs text-[#7A736E] font-bold">-</span>
                <input
                  type="time"
                  value={recurringEndTime}
                  onChange={(e) => setRecurringEndTime(e.target.value)}
                  className="w-full bg-white border border-[#EFECE6] rounded-2xl px-2.5 py-2 text-[11px] font-mono text-[#332C27]"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#8C6D53] hover:bg-[#765942] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#8C6D53]/20 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                排入常態課表
              </button>
            </div>
          </form>
        ) : scheduleMode === 'openSlot' ? (
          /* Mode 2: 2. 開放時段 Form */
          <form onSubmit={handleSettingSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end pt-1">
            <div>
              <label className="block text-xs font-bold text-[#2E7D32] mb-1">
                2. 時段屬性
              </label>
              <div className="w-full bg-[#E8F5E9] border border-[#C8E6C9] rounded-2xl px-3.5 py-2 text-xs font-extrabold text-[#2E7D32] flex items-center gap-1.5">
                開放時段
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#332C27] mb-1">
                開放日期
              </label>
              <select
                value={openDayKey}
                onChange={(e) => setOpenDayKey(parseInt(e.target.value, 10))}
                className="w-full bg-white border border-[#EFECE6] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#332C27] focus:outline-none focus:border-[#2E7D32]"
              >
                {weekDates.map((d) => (
                  <option key={d.key} value={d.key}>
                    {d.monthDay} {d.dayLabel}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#332C27] mb-1">
                開放時段
              </label>
              <select
                value={openBlockKey}
                onChange={(e) => {
                  const bKey = e.target.value;
                  setOpenBlockKey(bKey);
                  if (bKey === 'morning') {
                    setOpenStartTime('11:00');
                    setOpenEndTime('12:00');
                  } else if (bKey === 'afternoon') {
                    setOpenStartTime('14:00');
                    setOpenEndTime('15:00');
                  } else {
                    setOpenStartTime('19:00');
                    setOpenEndTime('20:00');
                  }
                }}
                className="w-full bg-white border border-[#EFECE6] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#332C27] focus:outline-none focus:border-[#2E7D32]"
              >
                <option value="morning">☀️ 上午</option>
                <option value="afternoon">🌤️ 下午</option>
                <option value="evening">🌙 晚間</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#332C27] mb-1">
                開放時間
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="time"
                  value={openStartTime}
                  onChange={(e) => setOpenStartTime(e.target.value)}
                  className="w-full bg-white border border-[#EFECE6] rounded-2xl px-2.5 py-2 text-[11px] font-mono text-[#332C27]"
                />
                <span className="text-xs text-[#7A736E] font-bold">-</span>
                <input
                  type="time"
                  value={openEndTime}
                  onChange={(e) => setOpenEndTime(e.target.value)}
                  className="w-full bg-white border border-[#EFECE6] rounded-2xl px-2.5 py-2 text-[11px] font-mono text-[#332C27]"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#E8F5E9] hover:bg-[#C8E6C9] border border-[#C8E6C9] text-[#2E7D32] font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
                開放此時段
              </button>
            </div>
          </form>
        ) : (
          /* Mode 3: 3. 課程異動 Form */
          <form onSubmit={handleSettingSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end pt-1">
            <div>
              <label className="block text-xs font-bold text-[#1565C0] mb-1">
                3. 欲異動之課程
              </label>
              <select
                value={rescheduleAppId}
                onChange={(e) => setRescheduleAppId(e.target.value)}
                className="w-full bg-white border border-[#EFECE6] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#332C27] focus:outline-none focus:border-[#1565C0]"
              >
                {appointments.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.student_name} · {formatFullDateStr(app.start_time)} ({formatTimeRange(app.start_time, app.end_time)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#332C27] mb-1">
                異動新日期
              </label>
              <select
                value={rescheduleDayKey}
                onChange={(e) => setRescheduleDayKey(parseInt(e.target.value, 10))}
                className="w-full bg-white border border-[#EFECE6] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#332C27] focus:outline-none focus:border-[#1565C0]"
              >
                {weekDates.map((d) => (
                  <option key={d.key} value={d.key}>
                    {d.monthDay} {d.dayLabel}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#332C27] mb-1">
                異動新時段
              </label>
              <select
                value={rescheduleBlockKey}
                onChange={(e) => {
                  const bKey = e.target.value;
                  setRescheduleBlockKey(bKey);
                  if (bKey === 'morning') {
                    setRescheduleStartTime('10:00');
                    setRescheduleEndTime('11:00');
                  } else if (bKey === 'afternoon') {
                    setRescheduleStartTime('14:00');
                    setRescheduleEndTime('15:00');
                  } else {
                    setRescheduleStartTime('19:00');
                    setRescheduleEndTime('20:00');
                  }
                }}
                className="w-full bg-white border border-[#EFECE6] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#332C27] focus:outline-none focus:border-[#1565C0]"
              >
                <option value="morning">☀️ 上午</option>
                <option value="afternoon">🌤️ 下午</option>
                <option value="evening">🌙 晚間</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#332C27] mb-1">
                異動新時間
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="time"
                  value={rescheduleStartTime}
                  onChange={(e) => setRescheduleStartTime(e.target.value)}
                  className="w-full bg-white border border-[#EFECE6] rounded-2xl px-2.5 py-2 text-[11px] font-mono text-[#332C27]"
                />
                <span className="text-xs text-[#7A736E] font-bold">-</span>
                <input
                  type="time"
                  value={rescheduleEndTime}
                  onChange={(e) => setRescheduleEndTime(e.target.value)}
                  className="w-full bg-white border border-[#EFECE6] rounded-2xl px-2.5 py-2 text-[11px] font-mono text-[#332C27]"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#1565C0] hover:bg-[#0D47A1] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#1565C0]/20 transition-all"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                確認異動課程
              </button>
            </div>
          </form>
        )}

        {/* Dedicated Registered Recurring Schedules Log Panel Inside "課表設定" Section */}
        <div className="pt-4 border-t border-[#EADFC9]/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#8C6D53] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#8C6D53]" />
              已記錄的常態課表 (Registered Recurring Schedules)
            </span>
            <span className="text-[11px] text-[#7A736E] font-bold">
              共 {recurringLogs.length} 筆常態紀錄
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {recurringLogs.map((log) => {
              const cardStyle = getStudentCardStyle(log.studentName);
              return (
                <div
                  key={log.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-2 shadow-xs ${cardStyle}`}
                >
                  <div className="space-y-0.5">
                    <div className="font-extrabold text-xs">
                      {log.studentName} (常態課)
                    </div>
                    <div className="font-mono text-[11px] opacity-90">
                      {log.monthDay} {log.dayLabel} · {log.startTime}-{log.endTime}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveRecurringLog(log.id)}
                    className="p-1.5 rounded-xl hover:bg-black/10 text-current opacity-70 hover:opacity-100 transition-all"
                    title="刪除此筆常態課表紀錄"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Banner: Global Year & Week Segment Banner */}
      <div className="warm-card p-4 sm:p-6 rounded-3xl border border-[#EFECE6] shadow-warm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FAF2EC] border border-[#E8D4C5] flex items-center justify-center text-[#8C6D53] shrink-0">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-extrabold text-[#7A736E] uppercase tracking-wider">
              全域年份與週別區間 (Year & Week Banner)
            </div>
            <span className="text-base sm:text-lg font-black text-[#332C27] font-mono">
              {yearBanner}
            </span>
          </div>
        </div>

        {/* Week Switcher Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-white p-1 rounded-full border border-[#EFECE6] shadow-xs w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={() => setWeekOffset((prev) => prev - 1)}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-full hover:bg-[#FAF7F2] text-xs font-bold text-[#7A736E] hover:text-[#332C27] flex items-center gap-1 transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> 上一週
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            className={`px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              weekOffset === 0
                ? 'bg-[#8C6D53] text-white shadow-xs'
                : 'text-[#7A736E] hover:bg-[#FAF7F2]'
            }`}
          >
            本週 (Current)
          </button>
          <button
            onClick={() => setWeekOffset((prev) => prev + 1)}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-full hover:bg-[#FAF7F2] text-xs font-bold text-[#7A736E] hover:text-[#332C27] flex items-center gap-1 transition-all"
          >
            下一週 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rock-Solid Matrix Table with iPhone Calendar Style Top Date Strip & 2D Sticky Matrix */}
      <div className="warm-card p-3.5 sm:p-6 lg:p-8 rounded-3xl border border-[#EFECE6] shadow-warm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#EFECE6] pb-3 sticky top-0 bg-white/95 backdrop-blur-md z-20 pt-1 gap-3">
          <h2 className="text-base sm:text-lg font-bold text-[#332C27] flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span>張老師 課表總覽</span>
            <span className="text-xs text-[#7A736E] font-normal">（可以直接用滑鼠拖曳卡片至任一天的格子內）</span>
          </h2>
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold">
            <span className="flex items-center gap-1 text-[#2E7D32]">
              <span className="w-3 h-3 rounded-full bg-[#E8F5E9] border border-[#C8E6C9]" /> 開放時段 (粉綠)
            </span>
            <span className="flex items-center gap-1 text-[#1565C0]">
              <span className="w-3 h-3 rounded-full bg-[#E3F2FD] border border-[#BBDEFB]" /> 小明 (天藍)
            </span>
            <span className="flex items-center gap-1 text-[#4527A0]">
              <span className="w-3 h-3 rounded-full bg-[#EDE7F6] border border-[#D1C4E9]" /> 小華 (靛紫)
            </span>
            <span className="flex items-center gap-1 text-[#C2185B]">
              <span className="w-3 h-3 rounded-full bg-[#FCE4EC] border border-[#F8BBD0]" /> 小美 (粉紅)
            </span>
          </div>
        </div>

        {/* 2D Split Pane Matrix Container (Requirement 1: Unclipped Today Badge z-60, Requirement 2: Blue-Line Scrollbars!) */}
        <div className="rounded-2xl border-2 border-[#EFECE6] bg-[#FAF7F2] p-2.5 sm:p-3.5 shadow-sm space-y-3 relative">
          {/* ROW 0: TOP HEADER PANEL (Corner Cell + Date Headers Row) */}
          <div className="flex gap-3">
            {/* Corner Cell: Fixed Top-Left */}
            <div className="w-[100px] shrink-0 p-2 font-extrabold text-xs text-[#7A736E] uppercase flex items-center justify-center bg-[#FAF7F2] rounded-xl border border-[#EFECE6] h-[52px] shadow-xs">
              時段 / 日期
            </div>

            {/* Top Date Headers Panel: Synchronized with bodyRef horizontal scroll */}
            <div ref={headerRef} className="overflow-x-hidden flex-1 relative pt-5 pb-0.5">
              <div className="grid grid-cols-7 gap-3 min-w-[980px]">
                {weekDates.map((d) => {
                  const isToday = d.fullDateStr === todayDateStr;
                  return (
                    <div
                      key={d.key}
                      className={`p-2 text-center rounded-xl transition-all space-y-0.5 h-[52px] flex flex-col justify-center items-center relative ${
                        isToday
                          ? 'bg-[#FFF2EB] border-2 border-[#E88D67] shadow-md ring-2 ring-[#E88D67]/30'
                          : 'bg-[#FAF2EC] border border-[#E8D4C5] shadow-xs'
                      }`}
                    >
                      {/* Today Badge Pill - 100% Visible & Unclipped */}
                      {isToday && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#E88D67] text-white text-[10px] font-black px-3 py-0.5 rounded-full shadow-md whitespace-nowrap uppercase tracking-wider flex items-center gap-1 z-50">
                          ★ 今天 (TODAY)
                        </div>
                      )}

                      <div className={`font-mono font-black text-sm tracking-wide ${isToday ? 'text-[#B85536]' : 'text-[#8C6D53]'}`}>
                        {d.monthDay}
                      </div>
                      <div className={`font-extrabold text-[11px] ${isToday ? 'text-[#5C3C24]' : 'text-[#332C27]'}`}>
                        {d.dayLabel} ({d.short})
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* MAIN MATRIX BODY (Rows 1..3): Left Time Column + Content Body with Blue-Line Scrollbars! */}
          <div className="flex gap-3 items-stretch">
            {/* Column 0: Left Time Labels Column (Synchronized with bodyRef vertical scroll) */}
            <div ref={leftColRef} className="w-[100px] shrink-0 overflow-y-hidden space-y-3">
              {TIME_BLOCKS.map((block) => {
                const BlockIcon = block.icon;
                return (
                  <div
                    key={block.key}
                    className="h-[140px] p-2 bg-[#FAF7F2] rounded-xl border border-[#EFECE6] flex flex-col items-center justify-center text-center space-y-1 shadow-xs shrink-0"
                  >
                    <BlockIcon className="w-5 h-5 text-[#8C6D53]" />
                    <div className="font-extrabold text-xs sm:text-sm text-[#332C27]">{block.label}</div>
                    <div className="text-[9px] text-[#7A736E] font-mono font-bold">{block.sub}</div>
                  </div>
                );
              })}
            </div>

            {/* Content Body Viewport: THE EXACT BLUE LINE SCROLLBAR LOCATION IN IMAGE 3! */}
            <div
              ref={bodyRef}
              onScroll={handleBodyScroll}
              className="flex-1 overflow-x-auto overflow-y-auto max-h-[520px] touch-pan-x touch-pan-y rounded-xl border border-[#EFECE6] bg-[#FAF7F2] p-1 shadow-inner relative"
            >
              <div className="space-y-3 min-w-[980px]">
                {TIME_BLOCKS.map((block) => (
                  <div key={block.key} className="grid grid-cols-7 gap-3 h-[140px] items-stretch">
                    {weekDates.map((d) => {
                      const isToday = d.fullDateStr === todayDateStr;
                      const dayApps = appointments.filter((app) => {
                        const appDay = getSlotDayOfWeek(app.start_time);
                        const appHour = getSlotHour(app.start_time);
                        return appDay === d.key && isTimeInBlock(appHour, block.key);
                      });

                      const daySlots = scheduleSlots.filter((slot) => {
                        if (!slot.is_available) return false;
                        const slotDay = getSlotDayOfWeek(slot.start_time);
                        const slotHour = getSlotHour(slot.start_time);
                        return slotDay === d.key && isTimeInBlock(slotHour, block.key);
                      });

                      const sortedDayApps = [...dayApps].sort(
                        (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
                      );
                      const sortedDaySlots = [...daySlots].sort(
                        (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
                      );

                      return (
                        <div
                          key={d.key}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => handleDropOnCell(d.key, block.key)}
                          className={`h-[140px] p-2.5 rounded-xl flex flex-col justify-between space-y-2 transition-all group z-10 overflow-y-auto ${
                            isToday
                              ? 'bg-[#FFF8F3] border-2 border-[#E88D67] ring-2 ring-[#E88D67]/20 shadow-sm'
                              : 'bg-white/70 border border-[#EFECE6] hover:border-[#8C6D53]/60 shadow-2xs'
                          }`}
                        >
                          <div className="space-y-2">
                            {/* Student Appointment Cards */}
                            {sortedDayApps.map((app) => {
                              const cardStyle = getStudentCardStyle(app.student_name || '');
                              const titleText =
                                app.status === 'rescheduled'
                                  ? `${app.student_name || '學生'} (異動)`
                                  : app.status === 'restored'
                                  ? `${app.student_name || '學生'} (恢復)`
                                  : (app.student_name || '學生');
                              return (
                                <div
                                  key={app.id}
                                  draggable
                                  onDragStart={() => setDraggedCard({ type: 'appointment', id: app.id })}
                                  className={`p-2.5 rounded-xl border flex flex-col gap-0.5 cursor-grab active:cursor-grabbing hover:scale-[1.02] transition-transform ${cardStyle}`}
                                >
                                  <div className="font-black text-xs leading-snug flex items-center gap-1">
                                    <GripVertical className="w-3 h-3 opacity-60" />
                                    {titleText}
                                  </div>
                                  <div className="font-mono text-[11px] opacity-95 tracking-tight font-bold pl-4">
                                    {formatTimeRange(app.start_time, app.end_time)}
                                  </div>
                                </div>
                              );
                            })}

                            {/* Open Slots */}
                            {sortedDaySlots.map((slot) => (
                              <div
                                key={slot.id}
                                draggable
                                onDragStart={() => setDraggedCard({ type: 'slot', id: slot.id })}
                                className="p-2.5 rounded-xl cursor-grab active:cursor-grabbing hover:scale-[1.02] flex flex-col gap-0.5 border bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9] hover:bg-[#C8E6C9] shadow-xs transition-transform"
                              >
                                <div className="font-black text-xs leading-snug flex items-center gap-1">
                                  <GripVertical className="w-3 h-3 opacity-60" />
                                  開放時段
                                </div>
                                <div className="font-mono text-[11px] opacity-95 tracking-tight font-bold pl-4">
                                  {formatTimeRange(slot.start_time, slot.end_time)}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Quick Add Button */}
                          <button
                            onClick={() => handleOpenAddModal(d.key, block.key)}
                            className="w-full py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-all bg-[#FFF9E6] hover:bg-[#FFF2C8] border border-[#F0E2BF] text-[#8C6D53]"
                          >
                            <Plus className="w-3.5 h-3.5" /> 開設此時段
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Single Add Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#332C27]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-3xl border border-[#EFECE6] space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#EFECE6] pb-3">
              <h3 className="font-bold text-lg text-[#332C27] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#8C6D53]" />
                開設開放時段 (Add Slot)
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#7A736E] hover:text-[#332C27]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSlot} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#332C27] mb-1">選擇日期 (Date)</label>
                  <select
                    value={selectedDayKey}
                    onChange={(e) => setSelectedDayKey(parseInt(e.target.value, 10))}
                    className="w-full bg-[#FAF7F2] border border-[#EFECE6] rounded-2xl px-3 py-2 text-xs font-bold text-[#332C27] focus:outline-none focus:border-[#8C6D53]"
                  >
                    {weekDates.map((w) => (
                      <option key={w.key} value={w.key}>
                        {w.monthDay} ({w.dayLabel})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#332C27] mb-1">選擇時段</label>
                  <select
                    value={selectedBlockKey}
                    onChange={(e) => setSelectedBlockKey(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EFECE6] rounded-2xl px-3 py-2 text-xs font-bold text-[#332C27] focus:outline-none focus:border-[#8C6D53]"
                  >
                    {TIME_BLOCKS.map((b) => (
                      <option key={b.key} value={b.key}>
                        {b.label} ({b.sub})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#332C27] mb-1">開始時間</label>
                  <input
                    type="time"
                    required
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EFECE6] rounded-2xl px-3 py-2 text-xs text-[#332C27] focus:outline-none focus:border-[#8C6D53]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#332C27] mb-1">結束時間</label>
                  <input
                    type="time"
                    required
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EFECE6] rounded-2xl px-3 py-2 text-xs text-[#332C27] focus:outline-none focus:border-[#8C6D53]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-[#7A736E] hover:text-[#332C27]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-[#8C6D53] hover:bg-[#765942] text-white font-bold text-xs shadow-md shadow-[#8C6D53]/20"
                >
                  確認開設
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
