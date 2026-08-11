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

export default function TeacherSchedulePage() {
  const {
    scheduleSlots,
    toggleSlotAvailability,
    addScheduleSlot,
    appointments,
    teacherProfile,
  } = useDemoContext();

  const [weekOffset, setWeekOffset] = useState<number>(0); // 0 = current week, +1 = next week, -1 = prev week

  // Recurring Fixed Schedule Block State
  const [recurringStudent, setRecurringStudent] = useState('小明');
  const [recurringDayKey, setRecurringDayKey] = useState<number>(3); // Wednesday
  const [recurringBlockKey, setRecurringBlockKey] = useState<string>('morning'); // Morning
  const [recurringStartTime, setRecurringStartTime] = useState('10:00');
  const [recurringEndTime, setRecurringEndTime] = useState('11:00');
  const [recurringNotice, setRecurringNotice] = useState<string | null>(null);

  // Single Add Slot Modal State
  const [selectedDayKey, setSelectedDayKey] = useState<number>(3);
  const [selectedBlockKey, setSelectedBlockKey] = useState<string>('afternoon');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStartTime, setNewStartTime] = useState('14:00');
  const [newEndTime, setNewEndTime] = useState('15:00');

  // Compute Current Week Dates relative to Monday
  const getWeekDates = (offset: number) => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 is Sun, 1 is Mon
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

  const handleBatchInsertRecurring = (e: React.FormEvent) => {
    e.preventDefault();
    const targetDayObj = weekDates.find((w) => w.key === recurringDayKey);
    const datePrefix = targetDayObj ? targetDayObj.fullDateStr : new Date().toISOString().split('T')[0];

    const startIso = new Date(`${datePrefix}T${recurringStartTime}`).toISOString();
    const endIso = new Date(`${datePrefix}T${recurringEndTime}`).toISOString();

    addScheduleSlot(startIso, endIso);
    setRecurringNotice(`已成功將「${recurringStudent}」之常態課程批次排入 ${targetDayObj?.monthDay} ${targetDayObj?.dayLabel} ${recurringStartTime}-${recurringEndTime}！`);

    setTimeout(() => {
      setRecurringNotice(null);
    }, 3500);
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
            一週 (週一～週日) × 3大時段 (上午/下午/晚間) 矩陣視圖 · 年月日標示與常態課程設定
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

      {/* NEW BLOCK: 常態固定上課時間與學生對象設定區塊 (Fixed Recurring Schedule Block) */}
      <div className="warm-card p-6 sm:p-8 rounded-3xl border border-[#EADFC9] border-l-8 border-l-[#8C6D53] shadow-warm space-y-4 bg-gradient-to-r from-[#FFFDF9] via-white to-[#FAF2EC]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EADFC9]/80 pb-3">
          <div className="flex items-center gap-2">
            <Repeat className="w-5 h-5 text-[#8C6D53]" />
            <h2 className="text-lg font-extrabold text-[#332C27]">
              常態固定上課時間與學生對象設定 (Recurring Fixed Schedule Block)
            </h2>
          </div>
          <span className="text-xs text-[#7A736E] font-medium">
            設定學生每週固定上課時間，可一鍵批次填入 7x3 週課表
          </span>
        </div>

        {recurringNotice && (
          <div className="p-3.5 rounded-2xl bg-[#E3E8E1] border border-[#C5D2C2] text-xs font-bold text-[#3D5240] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#3D5240]" />
            {recurringNotice}
          </div>
        )}

        <form onSubmit={handleBatchInsertRecurring} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end pt-1">
          <div>
            <label className="block text-xs font-bold text-[#332C27] mb-1">
              學生對象 (Student Target)
            </label>
            <select
              value={recurringStudent}
              onChange={(e) => setRecurringStudent(e.target.value)}
              className="w-full bg-white border border-[#EFECE6] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#332C27] focus:outline-none focus:border-[#8C6D53]"
            >
              <option value="小明">小明 (Student Ming)</option>
              <option value="小華">小華 (Student Hua)</option>
              <option value="小美">小美 (Student Mei)</option>
              <option value="常態班全體">常態班學生對象</option>
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
              ➕ 一鍵批次排入週課表
            </button>
          </div>
        </form>
      </div>

      {/* Global Year & Week Navigation Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF7F2] p-4 rounded-3xl border border-[#EFECE6]">
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
            className="px-3 py-1.5 rounded-full hover:bg-[#FAF7F2] text-xs font-bold text-[#7A736E] hover:text-[#332C27] flex items-center gap-1 transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> 上一週
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              weekOffset === 0
                ? 'bg-[#8C6D53] text-white shadow-xs'
                : 'text-[#7A736E] hover:bg-[#FAF7F2]'
            }`}
          >
            本週 (Current)
          </button>
          <button
            onClick={() => setWeekOffset((prev) => prev + 1)}
            className="px-3 py-1.5 rounded-full hover:bg-[#FAF7F2] text-xs font-bold text-[#7A736E] hover:text-[#332C27] flex items-center gap-1 transition-all"
          >
            下一週 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 7x3 Grid Schedule Matrix Table with Y-Axis Multi-Week Scroll */}
      <div className="warm-card p-6 sm:p-8 rounded-3xl border border-[#EFECE6] shadow-warm space-y-6 overflow-x-auto max-h-[750px] overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-between border-b border-[#EFECE6] pb-4 sticky top-0 bg-white/95 backdrop-blur-md z-20 pt-1">
          <h2 className="text-lg font-bold text-[#332C27] flex items-center gap-2">
            <span>張老師 7x3 課表總覽</span>
            <span className="text-xs text-[#7A736E] font-normal">（月日在上 · 週幾在下 · 可垂直 Y 軸捲動預排多週）</span>
          </h2>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-[#3D5240]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E3E8E1] border border-[#C5D2C2]" /> 開放空檔
            </span>
            <span className="flex items-center gap-1.5 text-[#8C6D53]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FAF2EC] border border-[#E8D4C5]" /> 已約課程
            </span>
          </div>
        </div>

        {/* 7x3 Responsive Grid System */}
        <div className="min-w-[900px]">
          {/* Header Row: Month/Day on Top, Day-of-Week Underneath */}
          <div className="grid grid-cols-8 gap-3 mb-3 sticky top-12 bg-white/95 backdrop-blur-md z-10 py-1">
            <div className="p-3 font-extrabold text-xs text-[#7A736E] uppercase flex items-center justify-center bg-[#FAF7F2] rounded-2xl border border-[#EFECE6]">
              時段 / 日期
            </div>
            {weekDates.map((d) => (
              <div
                key={d.key}
                className="p-3 text-center bg-[#FAF2EC] rounded-2xl border border-[#E8D4C5] space-y-0.5 shadow-xs"
              >
                {/* Top Line: Month/Day */}
                <div className="font-mono font-black text-sm text-[#8C6D53] tracking-wide">
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
              <div key={block.key} className="grid grid-cols-8 gap-3 mb-4">
                {/* Left Label Cell */}
                <div className="p-3 bg-[#FDFBF7] rounded-2xl border border-[#EFECE6] flex flex-col items-center justify-center text-center space-y-1">
                  <BlockIcon className="w-5 h-5 text-[#8C6D53]" />
                  <div className="font-extrabold text-xs text-[#332C27]">{block.label}</div>
                  <div className="text-[9px] text-[#7A736E] font-mono">{block.sub}</div>
                </div>

                {/* 7 Day Cells for this block */}
                {weekDates.map((d) => {
                  const daySlots = scheduleSlots.filter((slot) => {
                    const slotDay = getSlotDayOfWeek(slot.start_time);
                    const slotHour = getSlotHour(slot.start_time);
                    return slotDay === d.key && isTimeInBlock(slotHour, block.key);
                  });

                  const dayApps = appointments.filter((app) => {
                    const appDay = getSlotDayOfWeek(app.start_time);
                    const appHour = getSlotHour(app.start_time);
                    return appDay === d.key && isTimeInBlock(appHour, block.key);
                  });

                  return (
                    <div
                      key={d.key}
                      className="min-h-[110px] p-2.5 bg-[#FAF7F2] rounded-2xl border border-[#EFECE6] flex flex-col justify-between space-y-2 hover:border-[#D3C9BE] transition-all"
                    >
                      <div className="space-y-1.5">
                        {/* Booked Appointments */}
                        {dayApps.map((app) => (
                          <div
                            key={app.id}
                            className="p-1.5 rounded-xl bg-[#FAF2EC] border border-[#E8D4C5] text-[11px] font-bold text-[#8C6D53] flex items-center justify-between"
                          >
                            <span className="truncate">🔵 {app.student_name || '學生'}</span>
                            <span className="font-mono text-[9px] text-[#7A736E]">
                              {new Date(app.start_time).getHours()}:00
                            </span>
                          </div>
                        ))}

                        {/* Available Slots */}
                        {daySlots.map((slot) => (
                          <div
                            key={slot.id}
                            onClick={() => toggleSlotAvailability(slot.id)}
                            className={`p-1.5 rounded-xl cursor-pointer text-[10px] font-bold flex items-center justify-between border transition-all ${
                              slot.is_available
                                ? 'bg-[#E3E8E1] text-[#3D5240] border-[#C5D2C2] hover:bg-[#C5D2C2]'
                                : 'bg-[#FCEADE] text-[#B85536] border-[#F6D0B8] hover:bg-[#F6D0B8]'
                            }`}
                          >
                            <span className="truncate">
                              {slot.is_available ? '🟢 開放中' : '⚪ 已約滿'}
                            </span>
                            <span className="font-mono text-[9px]">
                              {formatTimeRange(slot.start_time, slot.end_time)}
                            </span>
                          </div>
                        ))}

                        {daySlots.length === 0 && dayApps.length === 0 && (
                          <div className="text-[10px] text-[#7A736E] text-center py-2 italic font-medium">
                            無設定時段
                          </div>
                        )}
                      </div>

                      {/* Quick Add Button per cell */}
                      <button
                        onClick={() => handleOpenAddModal(d.key, block.key)}
                        className="w-full py-1 rounded-xl bg-white hover:bg-[#FAF2EC] border border-[#EFECE6] text-[10px] font-bold text-[#8C6D53] flex items-center justify-center gap-1 shadow-sm transition-all"
                      >
                        <Plus className="w-3 h-3" /> 開設此時段
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
