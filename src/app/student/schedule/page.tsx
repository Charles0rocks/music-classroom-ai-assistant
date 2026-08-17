'use client';

import React, { useState } from 'react';
import { useDemoContext } from '@/context/DemoContext';
import {
  Calendar as CalendarIcon,
  Clock,
  ArrowRightLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Lock,
  Sparkles,
  X,
  User,
  Sun,
  Sunset,
  Moon,
  ChevronLeft,
  ChevronRight,
  Info,
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
  { key: 'morning', label: '上午', sub: '09:00 - 12:00', icon: Sun },
  { key: 'afternoon', label: '下午', sub: '13:00 - 18:00', icon: Sunset },
  { key: 'evening', label: '晚間', sub: '19:00 - 22:00', icon: Moon },
];

export default function StudentSchedulePage() {
  const { appointments, studentProfile, teacherProfile, scheduleSlots, requestReschedule } = useDemoContext();

  const [weekOffset, setWeekOffset] = useState<number>(0);
  
  // Interactive Modal State for clicking "張老師開放時段"
  const [selectedTargetSlot, setSelectedTargetSlot] = useState<ScheduleSlot | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>('');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ success: boolean; text: string } | null>(null);

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

  // Filter student's own appointments
  const myAppointments = appointments.filter((app) => app.student_id === studentProfile.id);

  const getSlotDayOfWeek = (isoString: string) => new Date(isoString).getDay();
  const getSlotHour = (isoString: string) => new Date(isoString).getHours();

  const isTimeInBlock = (hour: number, blockKey: string) => {
    if (blockKey === 'morning') return hour >= 8 && hour < 12;
    if (blockKey === 'afternoon') return hour >= 12 && hour < 18;
    return hour >= 18 && hour < 23;
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

  // Check 24-hour advance restriction rule
  const isWithin24Hours = (startTimeIso: string) => {
    const now = new Date().getTime();
    const lessonTime = new Date(startTimeIso).getTime();
    const diffHours = (lessonTime - now) / (1000 * 60 * 60);
    return diffHours < 24;
  };

  const handleOpenSlotClick = (slot: ScheduleSlot) => {
    setSelectedTargetSlot(slot);
    setFeedbackMsg(null);
    if (myAppointments.length > 0) {
      setSelectedAppointmentId(myAppointments[0].id);
    }
  };

  const handleSubmitReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTargetSlot || !selectedAppointmentId) return;

    const result = requestReschedule(selectedAppointmentId, selectedTargetSlot.id, rescheduleReason);
    setFeedbackMsg({ success: result.success, text: result.message });

    if (result.success) {
      setTimeout(() => {
        setSelectedTargetSlot(null);
        setFeedbackMsg(null);
      }, 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="warm-card p-6 sm:p-8 rounded-3xl border border-[#EFECE6] shadow-warm bg-gradient-to-r from-white to-[#FCEADE]">
        <div className="flex items-center gap-2 text-[#E88D67] text-xs font-bold uppercase tracking-wider mb-1">
          <CalendarIcon className="w-4 h-4" />
          Student Portal (P3)
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332C27]">個人課表</h1>
        <p className="text-[#7A736E] text-xs sm:text-sm mt-1 font-medium">
          點擊「張老師開放時段」即可直接調課 · 預防上課前 24 小時急迫調課保護
        </p>
      </div>

      {/* Global Year & Week Navigation Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF7F2] p-4.5 rounded-3xl border border-[#EFECE6]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FCEADE] border border-[#F6D0B8] flex items-center justify-center text-[#E88D67]">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-[#E88D67] uppercase tracking-wider block">
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

      {/* ENLARGED 7x3 Grid Schedule Matrix Table for Student */}
      <div className="warm-card p-6 sm:p-10 rounded-3xl border border-[#EFECE6] shadow-warm space-y-6 overflow-x-auto max-h-[850px] overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-between border-b border-[#EFECE6] pb-4 sticky top-0 bg-white/95 backdrop-blur-md z-20 pt-1">
          <h2 className="text-lg font-bold text-[#332C27] flex items-center gap-2">
            <span>小明同學 週課表矩陣</span>
            <span className="text-xs text-[#7A736E] font-normal">（天藍色: 我的課程 · 清新粉綠: 張老師開放時段）</span>
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

        {/* Enlarged Matrix Grid Container (Min Width 1150px) */}
        <div className="min-w-[1150px]">
          {/* Header Row: Month/Day on Top, Day-of-Week Underneath */}
          <div className="grid grid-cols-8 gap-3.5 mb-3.5 sticky top-12 bg-white/95 backdrop-blur-md z-10 py-1.5">
            <div className="p-3.5 font-extrabold text-xs text-[#7A736E] uppercase flex items-center justify-center bg-[#FAF7F2] rounded-2xl border border-[#EFECE6]">
              時段 / 日期
            </div>
            {weekDates.map((d) => {
              const todayDateStr = new Date().toISOString().split('T')[0];
              const isToday = d.fullDateStr === todayDateStr;
              return (
                <div
                  key={d.key}
                  className={`p-3.5 text-center rounded-2xl transition-all space-y-1 ${
                    isToday
                      ? 'bg-[#FFF9E6] border-2 border-[#E88D67]/70 shadow-md ring-2 ring-[#E88D67]/20 relative overflow-hidden'
                      : 'bg-[#FCEADE]/40 border border-[#F6D0B8] shadow-xs'
                  }`}
                >
                  {isToday && (
                    <span className="text-[10px] bg-[#E88D67] text-white px-2 py-0.5 rounded-full font-bold inline-block mb-1 shadow-xs">
                      ★ 今天
                    </span>
                  )}
                  {/* Top Line: Month/Day */}
                  <div className="font-mono font-black text-base text-[#B85536] tracking-wide">
                    {d.monthDay}
                  </div>
                  {/* Bottom Line: Day of Week */}
                  <div className="font-extrabold text-xs text-[#332C27]">
                    {d.dayLabel} ({d.short})
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3 Time Block Rows */}
          {TIME_BLOCKS.map((block) => {
            const BlockIcon = block.icon;
            return (
              <div key={block.key} className="grid grid-cols-8 gap-3.5 mb-4.5">
                {/* Left Label Cell */}
                <div className="p-3.5 bg-[#FDFBF7] rounded-2xl border border-[#EFECE6] flex flex-col items-center justify-center text-center space-y-1.5">
                  <BlockIcon className="w-6 h-6 text-[#E88D67]" />
                  <div className="font-extrabold text-sm text-[#332C27]">{block.label}</div>
                  <div className="text-[10px] text-[#7A736E] font-mono">{block.sub}</div>
                </div>

                {/* 7 Day Cells */}
                {weekDates.map((d) => {
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

                  return (
                    <div
                      key={d.key}
                      className="min-h-[140px] p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#EFECE6] flex flex-col justify-between space-y-2.5 hover:border-[#E88D67]/40 transition-all"
                    >
                      <div className="space-y-2">
                        {/* Confirmed Student Appointments (Ocean Light Blue Cards) */}
                        {cellAppointments.map((app) => {
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
                              ) : null}
                            </div>
                          );
                        })}

                        {/* Teacher's Open Slots ("張老師開放時段" - Clickable to open Reschedule Modal) */}
                        {cellAvailableSlots.map((slot) => (
                          <div
                            key={slot.id}
                            onClick={() => handleOpenSlotClick(slot)}
                            className="p-2.5 rounded-xl cursor-pointer bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] hover:bg-[#C8E6C9] flex flex-col gap-0.5 shadow-xs transition-all"
                            title="點擊預約/將課程調整至此時段"
                          >
                            <div className="font-black text-xs flex items-center justify-between">
                              <span>張老師開放時段</span>
                              <Sparkles className="w-3 h-3 text-[#2E7D32]" />
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

      {/* Interactive Reschedule Modal when clicking "張老師開放時段" */}
      {selectedTargetSlot && (
        <div className="fixed inset-0 z-50 bg-[#332C27]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-3xl border border-[#EFECE6] space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#EFECE6] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#E88D67]" />
                <h3 className="font-bold text-lg text-[#332C27]">將課程調整至「張老師開放時段」</h3>
              </div>
              <button
                onClick={() => setSelectedTargetSlot(null)}
                className="text-[#7A736E] hover:text-[#332C27]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-xs text-[#2E7D32] font-bold flex items-center justify-between">
              <span>目標時段：</span>
              <span className="font-mono font-black text-sm">
                {formatFullDateStr(selectedTargetSlot.start_time)} {formatTimeRange(selectedTargetSlot.start_time, selectedTargetSlot.end_time)}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EFECE6] flex items-center gap-2 text-xs text-[#7A736E] font-medium">
              <Info className="w-4 h-4 text-[#E88D67] shrink-0" />
              <span>規則提醒：上課前 24 小時內之舊課程不受理線上調課。</span>
            </div>

            {feedbackMsg && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                  feedbackMsg.success
                    ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]'
                    : 'bg-[#FCEADE] text-[#B85536] border border-[#F6D0B8]'
                }`}
              >
                {feedbackMsg.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {feedbackMsg.text}
              </div>
            )}

            <form onSubmit={handleSubmitReschedule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#332C27] mb-2">
                  請問您想將哪一天的舊課程調整至此時段？
                </label>

                {myAppointments.length === 0 ? (
                  <div className="py-6 text-center text-xs text-[#7A736E] bg-[#FAF7F2] rounded-2xl border border-[#EFECE6] font-bold">
                    您目前沒有已排定的舊課程可供調課。
                  </div>
                ) : (
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {myAppointments.map((app) => {
                      const timeStr = `${formatFullDateStr(app.start_time)} ${formatTimeRange(app.start_time, app.end_time)}`;
                      const isLocked = isWithin24Hours(app.start_time);
                      const isSelected = selectedAppointmentId === app.id;

                      return (
                        <div
                          key={app.id}
                          onClick={() => {
                            if (!isLocked) setSelectedAppointmentId(app.id);
                          }}
                          className={`p-3.5 rounded-2xl border transition-all flex flex-col gap-1 ${
                            isLocked
                              ? 'bg-[#FAF7F2] border-[#EFECE6] opacity-60 cursor-not-allowed'
                              : isSelected
                              ? 'bg-[#E3F2FD] border-[#BBDEFB] text-[#1565C0] cursor-pointer font-bold shadow-xs'
                              : 'bg-white border-[#EFECE6] text-[#332C27] cursor-pointer hover:border-[#BBDEFB]'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-extrabold">
                              我的課程 {app.status === 'rescheduled' ? '(先前已調課)' : ''}
                            </span>
                            {isLocked ? (
                              <span className="text-[10px] text-[#B85536] bg-[#FCEADE] px-2 py-0.5 rounded-full font-bold border border-[#F6D0B8] flex items-center gap-1">
                                <Lock className="w-3 h-3" /> 24h內不可線上調課
                              </span>
                            ) : isSelected ? (
                              <span className="text-[10px] text-[#1565C0] bg-[#E3F2FD] px-2 py-0.5 rounded-full font-bold border border-[#BBDEFB]">
                                已選擇此課程調課
                              </span>
                            ) : null}
                          </div>
                          <div className="font-mono text-xs font-bold text-[#7A736E]">
                            {timeStr}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#332C27] mb-1">調課原因 (選填)</label>
                <textarea
                  rows={2}
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  placeholder="例如：時間調整申請..."
                  className="w-full bg-[#FAF7F2] border border-[#EFECE6] rounded-2xl px-3.5 py-2 text-xs text-[#332C27] focus:outline-none focus:border-[#E88D67]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedTargetSlot(null)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-[#7A736E] hover:text-[#332C27]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={!selectedAppointmentId || myAppointments.length === 0}
                  className="px-5 py-2.5 rounded-full bg-[#E88D67] hover:bg-[#D67A53] text-white font-bold text-xs shadow-md shadow-[#E88D67]/20 disabled:opacity-50"
                >
                  確認調課至此時段
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
