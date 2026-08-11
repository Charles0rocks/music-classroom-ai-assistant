'use client';

import React, { useState } from 'react';
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

type ScheduleMode = 'recurring' | 'openSlot';

// Student Color Mapping Rules:
// 🎓 小明 (Ming)：海洋天藍色 (bg-[#E3F2FD] text-[#1565C0])
// 🎓 小華 (Hua)：優雅靛紫色 (bg-[#EDE7F6] text-[#4527A0])
// 🎓 小美 (Mei)：柔粉紅色 (bg-[#FCE4EC] text-[#C2185B])
const getStudentCardStyle = (studentName: string) => {
  if (studentName.includes('小明')) {
    return 'bg-[#E3F2FD] border-[#BBDEFB] text-[#1565C0] shadow-xs'; // Ocean Light Blue
  } else if (studentName.includes('小華')) {
    return 'bg-[#EDE7F6] border-[#D1C4E9] text-[#4527A0] shadow-xs'; // Elegant Indigo/Purple
  } else if (studentName.includes('小美')) {
    return 'bg-[#FCE4EC] border-[#F8BBD0] text-[#C2185B] shadow-xs'; // Soft Pink
  } else {
    return 'bg-[#E8EAF6] border-[#C5CAE9] text-[#283593] shadow-xs'; // Classic Powder Blue
  }
};

export default function TeacherSchedulePage() {
  const {
    scheduleSlots,
    toggleSlotAvailability,
    addScheduleSlot,
    appointments,
    teacherProfile,
  } = useDemoContext();

  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [scheduleMode, setScheduleMode] = useState<ScheduleMode>('recurring');

  // Form State for Mode 1: 1. 常態課表
  const [recurringStudent, setRecurringStudent] = useState('小明');
  const [recurringDayKey, setRecurringDayKey] = useState<number>(3);
  const [recurringBlockKey, setRecurringBlockKey] = useState<string>('morning');
  const [recurringStartTime, setRecurringStartTime] = useState('10:00');
  const [recurringEndTime, setRecurringEndTime] = useState('11:00');

  // Form State for Mode 2: 2. 開放時段
  const [openDayKey, setOpenDayKey] = useState<number>(4);
  const [openBlockKey, setOpenBlockKey] = useState<string>('afternoon');
  const [openStartTime, setOpenStartTime] = useState('14:00');
  const [openEndTime, setOpenEndTime] = useState('15:00');

  const [settingNotice, setSettingNotice] = useState<string | null>(null);

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
      const targetDayObj = weekDates.find((w) => w.key === recurringDayKey);
      const datePrefix = targetDayObj ? targetDayObj.fullDateStr : new Date().toISOString().split('T')[0];

      const startIso = new Date(`${datePrefix}T${recurringStartTime}`).toISOString();
      const endIso = new Date(`${datePrefix}T${recurringEndTime}`).toISOString();

      addScheduleSlot(startIso, endIso);
      setSettingNotice(`已成功新增「1. 常態課表」：${recurringStudent} · ${targetDayObj?.monthDay} ${targetDayObj?.dayLabel} ${recurringStartTime}-${recurringEndTime}！`);
    } else {
      const targetDayObj = weekDates.find((w) => w.key === openDayKey);
      const datePrefix = targetDayObj ? targetDayObj.fullDateStr : new Date().toISOString().split('T')[0];

      const startIso = new Date(`${datePrefix}T${openStartTime}`).toISOString();
      const endIso = new Date(`${datePrefix}T${openEndTime}`).toISOString();

      addScheduleSlot(startIso, endIso);
      setSettingNotice(`已成功新增粉綠色「2. 開放時段」：${targetDayObj?.monthDay} ${targetDayObj?.dayLabel} ${openStartTime}-${openEndTime}！`);
    }

    setTimeout(() => {
      setSettingNotice(null);
    }, 4000);
  };

  const formatTimeRange = (startIso: string, endIso: string) => {
    const s = new Date(startIso).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false });
    const e = new Date(endIso).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${s} - ${e}`;
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332C27]">週課表矩陣與開放時段 (7x3 Grid)</h1>
          <p className="text-[#7A736E] text-xs sm:text-sm mt-1 font-medium">
            一週 (週一～週日) × 3大時段 矩陣視圖 · 學生專屬色系與完整上下課時間全顯
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

      {/* TOP BLOCK: 課表設定 (1. 常態課表  2. 開放時段) */}
      <div className="warm-card p-6 sm:p-8 rounded-3xl border border-[#EADFC9] border-l-8 border-l-[#8C6D53] shadow-warm space-y-5 bg-gradient-to-r from-[#FFFDF9] via-white to-[#FAF2EC]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EADFC9]/80 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#8C6D53]" />
            <h2 className="text-xl font-extrabold text-[#332C27]">
              課表設定
            </h2>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 bg-[#FAF7F2] p-1.5 rounded-2xl border border-[#EADFC9]">
            <button
              type="button"
              onClick={() => setScheduleMode('recurring')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
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
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                scheduleMode === 'openSlot'
                  ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] shadow-sm font-extrabold'
                  : 'text-[#7A736E] hover:text-[#332C27]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
              2. 開放時段
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
          /* Mode 1: 1. 常態課表 Form */
          <form onSubmit={handleSettingSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end pt-1">
            <div>
              <label className="block text-xs font-bold text-[#332C27] mb-1">
                1. 學生對象 (Student Target)
              </label>
              <select
                value={recurringStudent}
                onChange={(e) => setRecurringStudent(e.target.value)}
                className="w-full bg-white border border-[#EFECE6] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#332C27] focus:outline-none focus:border-[#8C6D53]"
              >
                <option value="小明">小明 (Ocean Blue)</option>
                <option value="小華">小華 (Indigo Purple)</option>
                <option value="小美">小美 (Soft Pink)</option>
                <option value="常態班學生">常態班學生對象</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#332C27] mb-1">
                固定星期 (Fixed Day)
              </label>
              <select
                value={recurringDayKey}
                onChange={(e) => setRecurringDayKey(parseInt(e.target.value, 10))}
                className="w-full bg-white border border-[#EFECE6] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#332C27] focus:outline-none focus:border-[#8C6D53]"
              >
                {DAYS.map((d) => (
                  <option key={d.key} value={d.key}>
                    {d.label} ({d.short})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#332C27] mb-1">
                固定時段 (Fixed Period)
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
                <option value="morning">☀️ 上午 (10:00 - 11:00)</option>
                <option value="afternoon">🌤️ 下午 (14:00 - 15:00)</option>
                <option value="evening">🌙 晚間 (19:00 - 20:00)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#332C27] mb-1">
                上課時間 (Class Hours)
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
        ) : (
          /* Mode 2: 2. 開放時段 Form */
          <form onSubmit={handleSettingSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end pt-1">
            <div>
              <label className="block text-xs font-bold text-[#2E7D32] mb-1">
                2. 時段屬性 (Slot Type)
              </label>
              <div className="w-full bg-[#E8F5E9] border border-[#C8E6C9] rounded-2xl px-3.5 py-2 text-xs font-extrabold text-[#2E7D32] flex items-center gap-1.5">
                開放時段 (粉綠色標籤)
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#332C27] mb-1">
                開放星期 (Open Day)
              </label>
              <select
                value={openDayKey}
                onChange={(e) => setOpenDayKey(parseInt(e.target.value, 10))}
                className="w-full bg-white border border-[#EFECE6] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#332C27] focus:outline-none focus:border-[#2E7D32]"
              >
                {DAYS.map((d) => (
                  <option key={d.key} value={d.key}>
                    {d.label} ({d.short})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#332C27] mb-1">
                開放時段 (Open Period)
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
                <option value="morning">☀️ 上午空檔 (11:00 - 12:00)</option>
                <option value="afternoon">🌤️ 下午空檔 (14:00 - 15:00)</option>
                <option value="evening">🌙 晚間空檔 (19:00 - 20:00)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#332C27] mb-1">
                開放時間 (Open Hours)
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
                開放此時段 (粉綠卡片)
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Global Year & Week Navigation Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF7F2] p-4.5 rounded-3xl border border-[#EFECE6]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FAF2EC] border border-[#E8D4C5] flex items-center justify-center text-[#8C6D53]">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-[#8C6D53] uppercase tracking-wider block">
              全域年份與週別區間 (Year & Week Banner)
            </span>
            <span className="text-lg font-black text-[#332C27] font-mono">
              {yearBanner}
            </span>
          </div>
        </div>

        {/* Week Switcher Controls */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-full border border-[#EFECE6] shadow-xs">
          <button
            onClick={() => setWeekOffset((prev) => prev - 1)}
            className="px-3.5 py-1.5 rounded-full hover:bg-[#FAF7F2] text-xs font-bold text-[#7A736E] hover:text-[#332C27] flex items-center gap-1 transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> 上一週
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              weekOffset === 0
                ? 'bg-[#8C6D53] text-white shadow-xs'
                : 'text-[#7A736E] hover:bg-[#FAF7F2]'
            }`}
          >
            本週 (Current)
          </button>
          <button
            onClick={() => setWeekOffset((prev) => prev + 1)}
            className="px-3.5 py-1.5 rounded-full hover:bg-[#FAF7F2] text-xs font-bold text-[#7A736E] hover:text-[#332C27] flex items-center gap-1 transition-all"
          >
            下一週 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ENLARGED 7x3 Grid Schedule Matrix Table (Full Text Visibility, No Truncation) */}
      <div className="warm-card p-6 sm:p-10 rounded-3xl border border-[#EFECE6] shadow-warm space-y-6 overflow-x-auto max-h-[850px] overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-between border-b border-[#EFECE6] pb-4 sticky top-0 bg-white/95 backdrop-blur-md z-20 pt-1">
          <h2 className="text-lg font-bold text-[#332C27] flex items-center gap-2">
            <span>張老師 7x3 課表總覽</span>
            <span className="text-xs text-[#7A736E] font-normal">（學生姓名與上下課時間100%完全顯示 · 無省略符號）</span>
          </h2>
          <div className="flex items-center gap-3 text-xs font-bold">
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

        {/* 7x3 Responsive Enlarged Grid System (Min Width 1150px) */}
        <div className="min-w-[1150px]">
          {/* Header Row: Month/Day on Top, Day-of-Week Underneath */}
          <div className="grid grid-cols-8 gap-3.5 mb-3.5 sticky top-12 bg-white/95 backdrop-blur-md z-10 py-1.5">
            <div className="p-3.5 font-extrabold text-xs text-[#7A736E] uppercase flex items-center justify-center bg-[#FAF7F2] rounded-2xl border border-[#EFECE6]">
              時段 / 日期
            </div>
            {weekDates.map((d) => (
              <div
                key={d.key}
                className="p-3.5 text-center bg-[#FAF2EC] rounded-2xl border border-[#E8D4C5] space-y-1 shadow-xs"
              >
                {/* Top Line: Month/Day */}
                <div className="font-mono font-black text-base text-[#8C6D53] tracking-wide">
                  {d.monthDay}
                </div>
                {/* Bottom Line: Day of Week */}
                <div className="font-extrabold text-xs text-[#332C27]">
                  {d.dayLabel} ({d.short})
                </div>
              </div>
            ))}
          </div>

          {/* 3 Time Block Rows */}
          {TIME_BLOCKS.map((block) => {
            const BlockIcon = block.icon;
            return (
              <div key={block.key} className="grid grid-cols-8 gap-3.5 mb-4.5">
                {/* Left Label Cell */}
                <div className="p-3.5 bg-[#FDFBF7] rounded-2xl border border-[#EFECE6] flex flex-col items-center justify-center text-center space-y-1.5">
                  <BlockIcon className="w-6 h-6 text-[#8C6D53]" />
                  <div className="font-extrabold text-sm text-[#332C27]">{block.label}</div>
                  <div className="text-[10px] text-[#7A736E] font-mono">{block.sub}</div>
                </div>

                {/* 7 Day Cells for this block (Min Height 140px) */}
                {weekDates.map((d) => {
                  // Booked Appointments
                  const dayApps = appointments.filter((app) => {
                    const appDay = getSlotDayOfWeek(app.start_time);
                    const appHour = getSlotHour(app.start_time);
                    return appDay === d.key && isTimeInBlock(appHour, block.key);
                  });

                  // Available Open Slots
                  const daySlots = scheduleSlots.filter((slot) => {
                    if (!slot.is_available) return false;
                    const slotDay = getSlotDayOfWeek(slot.start_time);
                    const slotHour = getSlotHour(slot.start_time);
                    return slotDay === d.key && isTimeInBlock(slotHour, block.key);
                  });

                  return (
                    <div
                      key={d.key}
                      className="min-h-[140px] p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#EFECE6] flex flex-col justify-between space-y-2.5 hover:border-[#D3C9BE] transition-all"
                    >
                      <div className="space-y-2">
                        {/* Student Appointment Cards (Stacked 2-line layout, FULL Student Name & FULL Time Range) */}
                        {dayApps.map((app) => {
                          const cardStyle = getStudentCardStyle(app.student_name || '');
                          return (
                            <div
                              key={app.id}
                              className={`p-2.5 rounded-xl border flex flex-col gap-0.5 ${cardStyle}`}
                            >
                              <div className="font-black text-xs leading-snug">
                                {app.student_name || '學生'}
                              </div>
                              <div className="font-mono text-[11px] opacity-95 tracking-tight font-bold">
                                {formatTimeRange(app.start_time, app.end_time)}
                              </div>
                            </div>
                          );
                        })}

                        {/* Unbooked Open Slots (Pastel Mint Green, Stacked 2-line layout) */}
                        {daySlots.map((slot) => (
                          <div
                            key={slot.id}
                            onClick={() => toggleSlotAvailability(slot.id)}
                            className="p-2.5 rounded-xl cursor-pointer flex flex-col gap-0.5 border bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9] hover:bg-[#C8E6C9] shadow-xs transition-all"
                          >
                            <div className="font-black text-xs leading-snug">開放時段</div>
                            <div className="font-mono text-[11px] tracking-tight font-bold">
                              {formatTimeRange(slot.start_time, slot.end_time)}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Quick Add Button in Soft Pale Warm Yellow */}
                      <button
                        onClick={() => handleOpenAddModal(d.key, block.key)}
                        className="w-full py-1.5 rounded-xl bg-[#FFF9E6] hover:bg-[#FFF2C8] border border-[#F0E2BF] text-xs font-bold text-[#8C6D53] flex items-center justify-center gap-1 shadow-sm transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" /> 開設此時段
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })}
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
