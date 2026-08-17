'use client';

import React, { useState } from 'react';
import { useDemoContext } from '@/context/DemoContext';
import {
  Calendar as CalendarIcon,
  Clock,
  Check,
  X,
  AlertCircle,
  Lock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Sliders,
  Layers,
  BookOpen,
} from 'lucide-react';
import { Appointment, ScheduleSlot } from '@/types';

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
  { key: 'morning', label: '上午', sub: '09:00 - 12:00', icon: Clock, startHour: 9, endHour: 12 },
  { key: 'afternoon', label: '下午', sub: '13:00 - 18:00', icon: Clock, startHour: 13, endHour: 18 },
  { key: 'evening', label: '晚間', sub: '19:00 - 22:00', icon: Clock, startHour: 19, endHour: 22 },
];

export default function StudentSchedulePage() {
  const {
    studentProfile,
    appointments,
    scheduleSlots,
    requestReschedule,
  } = useDemoContext();
  const currentStudentId = studentProfile?.id || 's-1';

  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [selectedSlotForReschedule, setSelectedSlotForReschedule] = useState<ScheduleSlot | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState<boolean>(false);
  const [selectedAppToMove, setSelectedAppToMove] = useState<string>('');
  const [modalNotice, setModalNotice] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

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

  // Filter Student Appointments
  const myAppointments = appointments.filter(
    (app) => app.student_id === currentStudentId && app.status !== 'cancelled'
  );

  const getSlotDayOfWeek = (isoString: string) => new Date(isoString).getDay();
  const getSlotHour = (isoString: string) => new Date(isoString).getHours();

  const isTimeInBlock = (hour: number, blockKey: string) => {
    if (blockKey === 'morning') return hour >= 8 && hour < 12;
    if (blockKey === 'afternoon') return hour >= 12 && hour < 18;
    return hour >= 18 && hour < 23;
  };

  const isWithin24Hours = (isoString: string) => {
    const now = new Date().getTime();
    const target = new Date(isoString).getTime();
    const diffHours = (target - now) / (1000 * 60 * 60);
    return diffHours < 24 && diffHours > 0;
  };

  const handleOpenSlotClick = (slot: ScheduleSlot) => {
    setSelectedSlotForReschedule(slot);
    setModalNotice(null);

    // Auto-select first non-locked appointment if available
    const movableApps = myAppointments.filter((a) => !isWithin24Hours(a.start_time));
    if (movableApps.length > 0) {
      setSelectedAppToMove(movableApps[0].id);
    } else if (myAppointments.length > 0) {
      setSelectedAppToMove(myAppointments[0].id);
    }

    setShowRescheduleModal(true);
  };

  const handleConfirmReschedule = () => {
    if (!selectedSlotForReschedule || !selectedAppToMove) {
      setModalNotice({ type: 'error', message: '請選擇欲移動的舊課程！' });
      return;
    }

    const result = requestReschedule(selectedAppToMove, selectedSlotForReschedule.id);
    if (!result.success) {
      setModalNotice({ type: 'error', message: result.message });
    } else {
      setModalNotice({ type: 'success', message: result.message });
      setTimeout(() => {
        setShowRescheduleModal(false);
        setSelectedSlotForReschedule(null);
      }, 1800);
    }
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

  // Find index of Today in weekDates
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayColIdx = weekDates.findIndex((d) => d.fullDateStr === todayDateStr);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="warm-card p-6 sm:p-8 rounded-3xl border border-[#EFECE6] shadow-warm bg-gradient-to-r from-white to-[#FAF2EC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#E88D67] text-xs font-bold uppercase tracking-wider mb-1">
            <CalendarIcon className="w-4 h-4" />
            Student Portal (P3)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332C27]">我的個人課表與可調時段</h1>
          <p className="text-[#7A736E] text-xs sm:text-sm mt-1 font-medium">
            一週 (週一～週日) × 3大時段 矩陣視圖 · 點選張老師開放時段即可快速進行線上自主調課
          </p>
        </div>
      </div>

      {/* Global Year & Week Navigation Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF7F2] p-4.5 rounded-3xl border border-[#EFECE6]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FCEADE]/60 border border-[#F6D0B8] flex items-center justify-center text-[#E88D67]">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-[#E88D67] uppercase tracking-wider block">
              全域年份與週別區間 (YEAR & WEEK BANNER)
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
                ? 'bg-[#E88D67] text-white shadow-xs'
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

      {/* Synchronized Row-Grid Matrix Container */}
      <div className="warm-card p-6 sm:p-10 rounded-3xl border border-[#EFECE6] shadow-warm space-y-6 overflow-x-auto max-h-[850px] overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-between border-b border-[#EFECE6] pb-4 sticky top-0 bg-white/95 backdrop-blur-md z-20 pt-1">
          <h2 className="text-lg font-bold text-[#332C27] flex items-center gap-2">
            <span>學生端 課表總覽</span>
            <span className="text-xs text-[#7A736E] font-normal">（點選「張老師開放時段」即可申請將個人課程調整至該時段）</span>
          </h2>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-[#1565C0]">
              <span className="w-3 h-3 rounded-full bg-[#E3F2FD] border border-[#BBDEFB]" /> 我的課程 (海洋天藍)
            </span>
            <span className="flex items-center gap-1.5 text-[#2E7D32]">
              <span className="w-3 h-3 rounded-full bg-[#E8F5E9] border border-[#C8E6C9]" /> 張老師開放時段 (清新粉綠)
            </span>
          </div>
        </div>

        {/* Outer Container with 100% Precise Math Overlay for Today */}
        <div className="min-w-[1150px] relative space-y-3.5 pt-9 pb-1">
          {/* Today's Single Big Orange Border Container Overlay */}
          {todayColIdx !== -1 && (
            <div
              className="absolute top-0 -bottom-2.5 border-[3px] border-[#E88D67] bg-transparent rounded-[28px] shadow-lg shadow-[#E88D67]/15 ring-4 ring-[#E88D67]/25 pointer-events-none z-0 transition-all"
              style={{
                left: `calc(${todayColIdx + 1} * (100% + 14px) / 8 - 8px)`,
                width: `calc((100% - 98px) / 8 + 16px)`,
              }}
            >
              {/* Badge Header INSIDE top of Orange Frame, NOT touching/pressing top border line */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#E88D67] text-white text-[11px] font-black px-3.5 py-0.5 rounded-full shadow-md whitespace-nowrap uppercase tracking-wider flex items-center gap-1">
                ★ 今天 (TODAY)
              </div>
            </div>
          )}

          {/* ROW 0: Date Header Row (All 7 Date Header Boxes share 100% IDENTICAL background color) */}
          <div className="grid grid-cols-8 gap-3.5">
            <div className="p-3.5 font-extrabold text-xs text-[#7A736E] uppercase flex items-center justify-center bg-[#FAF7F2] rounded-2xl border border-[#EFECE6] h-[92px] z-10">
              時段 / 日期
            </div>
            {weekDates.map((d) => {
              const isToday = d.fullDateStr === todayDateStr;
              return (
                <div
                  key={d.key}
                  className="p-3.5 text-center rounded-2xl transition-all space-y-1 h-[92px] flex flex-col justify-center items-center z-10 bg-[#FCEADE]/40 border border-[#F6D0B8] shadow-xs"
                >
                  <div className={`font-mono font-black text-base tracking-wide ${isToday ? 'text-[#B85536]' : 'text-[#B85536]'}`}>
                    {d.monthDay}
                  </div>
                  <div className={`font-extrabold text-xs ${isToday ? 'text-[#5C3C24]' : 'text-[#332C27]'}`}>
                    {d.dayLabel} ({d.short})
                  </div>
                </div>
              );
            })}
          </div>

          {/* ROWS 1, 2, 3: 3 Time Block Rows */}
          {TIME_BLOCKS.map((block) => {
            const BlockIcon = block.icon;
            return (
              <div key={block.key} className="grid grid-cols-8 gap-3.5 items-stretch">
                {/* Left Label Cell */}
                <div className="min-h-[140px] p-3.5 bg-[#FDFBF7] rounded-2xl border border-[#EFECE6] flex flex-col items-center justify-center text-center space-y-1.5 z-10">
                  <BlockIcon className="w-6 h-6 text-[#E88D67]" />
                  <div className="font-extrabold text-sm text-[#332C27]">{block.label}</div>
                  <div className="text-[10px] text-[#7A736E] font-mono">{block.sub}</div>
                </div>

                {/* 7 Day Cells for this Row (Synchronized Row Height Across All Days) */}
                {weekDates.map((d) => {
                  const isToday = d.fullDateStr === todayDateStr;

                  const cellAppointments = myAppointments.filter((app) => {
                    const appDay = getSlotDayOfWeek(app.start_time);
                    const appHour = getSlotHour(app.start_time);
                    return appDay === d.key && isTimeInBlock(appHour, block.key);
                  });

                  const cellAvailableSlots = scheduleSlots.filter((slot) => {
                    if (!slot.is_available) return false;
                    const slotDay = getSlotDayOfWeek(slot.start_time);
                    const slotHour = getSlotHour(slot.start_time);
                    return slotDay === d.key && isTimeInBlock(slotHour, block.key);
                  });

                  const sortedAppointments = [...cellAppointments].sort(
                    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
                  );
                  const sortedAvailableSlots = [...cellAvailableSlots].sort(
                    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
                  );

                  return (
                    <div
                      key={d.key}
                      className={`min-h-[140px] p-3.5 rounded-2xl flex flex-col justify-between space-y-2.5 transition-all z-10 ${
                        isToday
                          ? 'bg-[#FFFDF3]/90 border border-[#E88D67]/40 shadow-xs hover:border-[#E88D67]'
                          : 'bg-[#FAF7F2] border border-[#EFECE6] hover:border-[#E88D67]/40'
                      }`}
                    >
                      <div className="space-y-2">
                        {/* Confirmed Student Appointments (Ocean Light Blue Cards) */}
                        {sortedAppointments.map((app) => {
                          const locked24h = isWithin24Hours(app.start_time);
                          return (
                            <div
                              key={app.id}
                              className="p-2.5 rounded-xl bg-[#E3F2FD] border border-[#BBDEFB] text-[#1565C0] flex flex-col gap-1 shadow-xs"
                            >
                              <div className="flex items-center justify-between text-xs font-black">
                                <span>
                                  {app.status === 'rescheduled'
                                    ? '我的課程 (異動)'
                                    : app.status === 'restored'
                                    ? '我的課程 (恢復)'
                                    : '我的課程'}
                                </span>
                              </div>
                              <div className="font-mono text-[11px] font-bold tracking-tight">
                                {formatTimeRange(app.start_time, app.end_time)}
                              </div>

                              {locked24h ? (
                                <div className="mt-1 text-[10px] text-[#B85536] bg-[#FCEADE] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 border border-[#F6D0B8]">
                                  <Lock className="w-3 h-3 shrink-0" /> 24h內不可線上調課
                                </div>
                              ) : (
                                <div className="mt-0.5 text-[10px] text-[#1565C0]/80 font-bold">
                                  可進行線上調課
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Teacher's Open Slots ("張老師開放時段" - Clickable to open Reschedule Modal) */}
                        {sortedAvailableSlots.map((slot) => (
                          <div
                            key={slot.id}
                            onClick={() => handleOpenSlotClick(slot)}
                            className="p-2.5 rounded-xl cursor-pointer bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] hover:bg-[#C8E6C9] flex flex-col gap-0.5 shadow-xs transition-all group"
                            title="點擊預約/將課程調整至此時段"
                          >
                            <div className="font-black text-xs flex items-center justify-between">
                              <span>張老師開放時段</span>
                              <Sparkles className="w-3 h-3 text-[#2E7D32] group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="font-mono text-[11px] font-bold tracking-tight">
                              {formatTimeRange(slot.start_time, slot.end_time)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Online Reschedule Modal */}
      {showRescheduleModal && selectedSlotForReschedule && (
        <div className="fixed inset-0 z-50 bg-[#332C27]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-3xl border border-[#EFECE6] space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#EFECE6] pb-3">
              <h3 className="font-bold text-lg text-[#332C27] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#E88D67]" />
                自主線上調課申請
              </h3>
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="text-[#7A736E] hover:text-[#332C27]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] space-y-1">
                <div className="text-[#2E7D32] font-extrabold text-xs">
                  目標調整新時段 (Target Slot):
                </div>
                <div className="font-bold text-[#332C27] text-sm font-mono">
                  {formatFullDateStr(selectedSlotForReschedule.start_time)} · {formatTimeRange(selectedSlotForReschedule.start_time, selectedSlotForReschedule.end_time)}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#332C27] mb-1.5">
                  選擇欲移動的舊課程：
                </label>
                <select
                  value={selectedAppToMove}
                  onChange={(e) => setSelectedAppToMove(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#EFECE6] rounded-2xl p-3 text-xs font-bold text-[#332C27] focus:outline-none focus:border-[#E88D67]"
                >
                  {myAppointments.map((app) => {
                    const locked = isWithin24Hours(app.start_time);
                    return (
                      <option key={app.id} value={app.id} disabled={locked}>
                        {formatFullDateStr(app.start_time)} ({formatTimeRange(app.start_time, app.end_time)}) {locked ? ' [24h內不可調課]' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              {modalNotice && (
                <div
                  className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                    modalNotice.type === 'error'
                      ? 'bg-[#FCEADE] text-[#B85536] border border-[#F6D0B8]'
                      : 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]'
                  }`}
                >
                  {modalNotice.type === 'error' ? (
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#B85536]" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2E7D32]" />
                  )}
                  {modalNotice.message}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowRescheduleModal(false)}
                className="px-4 py-2 rounded-full text-xs font-bold text-[#7A736E] hover:text-[#332C27]"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmReschedule}
                className="px-5 py-2.5 rounded-full bg-[#E88D67] hover:bg-[#D47953] text-white font-bold text-xs shadow-md shadow-[#E88D67]/20"
              >
                確認送出調課
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
