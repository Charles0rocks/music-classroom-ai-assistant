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
} from 'lucide-react';
import { AvailableSlotResponse } from '@/types';

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
  const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlotResponse[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
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

  const handleOpenRescheduleModal = async (appointmentId: string) => {
    setRescheduleAppointmentId(appointmentId);
    setIsLoadingSlots(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch(
        `/api/schedule/available-slots?teacherId=${teacherProfile.id}&studentId=${studentProfile.id}`
      );
      const data = await res.json();
      if (data.available_slots) {
        setAvailableSlots(data.available_slots);
        if (data.available_slots.length > 0) {
          setSelectedSlotId(data.available_slots[0].slot_id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleSubmitReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleAppointmentId || !selectedSlotId) return;

    const result = requestReschedule(rescheduleAppointmentId, selectedSlotId, rescheduleReason);
    setFeedbackMsg({ success: result.success, text: result.message });

    if (result.success) {
      setTimeout(() => {
        setRescheduleAppointmentId(null);
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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332C27]">個人課表矩陣與智慧調課 (7x3 Grid)</h1>
        <p className="text-[#7A736E] text-xs sm:text-sm mt-1 font-medium">
          一週 (週一～週日) × 3大時段 (上午/下午/晚間) 放大矩陣課表 · 精準日期標示與淡黃色開放時段
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
            <span>小明同學 7x3 上課週課表矩陣</span>
            <span className="text-xs text-[#7A736E] font-normal">（月日在上 · 週幾在下 · 授課指導：張老師）</span>
          </h2>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-[#B85536]">
              <span className="w-3 h-3 rounded-full bg-[#FCEADE] border border-[#F6D0B8]" /> 我的上課時間
            </span>
            <span className="flex items-center gap-1.5 text-[#8C6D53]">
              <span className="w-3 h-3 rounded-full bg-[#FFF9E6] border border-[#F0E2BF]" /> 老師開放時段
            </span>
          </div>
        </div>

        {/* 7x3 Enlarged Matrix Grid Container */}
        <div className="min-w-[1050px]">
          {/* Header Row: Month/Day on Top, Day-of-Week Underneath */}
          <div className="grid grid-cols-8 gap-3.5 mb-3.5 sticky top-12 bg-white/95 backdrop-blur-md z-10 py-1.5">
            <div className="p-3.5 font-extrabold text-xs text-[#7A736E] uppercase flex items-center justify-center bg-[#FAF7F2] rounded-2xl border border-[#EFECE6]">
              時段 / 日期
            </div>
            {weekDates.map((d) => (
              <div
                key={d.key}
                className="p-3.5 text-center bg-[#FCEADE]/40 rounded-2xl border border-[#F6D0B8] space-y-1 shadow-xs"
              >
                {/* Top Line: Month/Day */}
                <div className="font-mono font-black text-base text-[#B85536] tracking-wide">
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
                        {/* Student's Confirmed Appointments */}
                        {cellAppointments.map((app) => (
                          <div
                            key={app.id}
                            className="p-2 rounded-xl bg-[#FCEADE] border border-[#F6D0B8] space-y-1 shadow-xs"
                          >
                            <div className="flex items-center justify-between text-xs font-bold text-[#B85536]">
                              <span>🎵 我的課程</span>
                              <span className="font-mono text-[10px]">
                                {formatTimeRange(app.start_time, app.end_time)}
                              </span>
                            </div>
                            <button
                              onClick={() => handleOpenRescheduleModal(app.id)}
                              className="w-full py-1 rounded-lg bg-[#E88D67] hover:bg-[#D67A53] text-white text-[10px] font-bold flex items-center justify-center gap-1 shadow-xs transition-all"
                            >
                              <ArrowRightLeft className="w-3 h-3" /> 申請調課
                            </button>
                          </div>
                        ))}

                        {/* Teacher's Open Slots (Soft Pale Yellow Cards) */}
                        {cellAvailableSlots.map((slot) => (
                          <div
                            key={slot.id}
                            className="p-2 rounded-xl bg-[#FFF9E6] border border-[#F0E2BF] text-xs font-bold text-[#8C6D53] flex items-center justify-between shadow-xs"
                          >
                            <span>🟡 開放時段</span>
                            <span className="font-mono text-[10px]">
                              {formatTimeRange(slot.start_time, slot.end_time)}
                            </span>
                          </div>
                        ))}

                        {cellAppointments.length === 0 && cellAvailableSlots.length === 0 && (
                          <div className="text-xs text-[#7A736E] text-center py-4 italic font-medium">
                            無排課 / 無空檔
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Reschedule Modal */}
      {rescheduleAppointmentId && (
        <div className="fixed inset-0 z-50 bg-[#332C27]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-[#EFECE6] space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#EFECE6] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#E88D67]" />
                <h3 className="font-bold text-lg text-[#332C27]">智慧調課申請 (Smart Reschedule)</h3>
              </div>
              <button
                onClick={() => setRescheduleAppointmentId(null)}
                className="text-[#7A736E] hover:text-[#332C27]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#E3E8E1]/60 border border-[#C5D2C2] flex items-center gap-2.5 text-xs text-[#3D5240] font-bold">
              <ShieldCheck className="w-5 h-5 text-[#3D5240] shrink-0" />
              <span>隱私保護已啟用：僅呈現張老師開放且無衝突之空檔，保護他人隱私。</span>
            </div>

            {feedbackMsg && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                  feedbackMsg.success
                    ? 'bg-[#E3E8E1] text-[#3D5240] border border-[#C5D2C2]'
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
                  選擇目標開放空檔 (`schedule_slots`)
                </label>

                {isLoadingSlots ? (
                  <div className="py-8 text-center text-xs text-[#7A736E] font-medium animate-pulse">
                    正在演算法比對無衝突時段...
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="py-6 text-center text-xs text-[#B85536] bg-[#FCEADE] rounded-2xl border border-[#F6D0B8] font-bold">
                    目前老師暫無可供調課的開放空檔，請聯絡老師新增開放時間。
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {availableSlots.map((slot) => {
                      const start = formatTimeRange(slot.start_time, slot.end_time);
                      const isSelected = selectedSlotId === slot.slot_id;
                      return (
                        <div
                          key={slot.slot_id}
                          onClick={() => setSelectedSlotId(slot.slot_id)}
                          className={`p-3.5 rounded-2xl cursor-pointer transition-all border flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#FFF9E6] border-[#F0E2BF] text-[#332C27] shadow-sm font-bold'
                              : 'bg-[#FAF7F2] border-[#EFECE6] text-[#7A736E] hover:border-[#D3C9BE]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Clock className={`w-4 h-4 ${isSelected ? 'text-[#8C6D53]' : 'text-[#7A736E]'}`} />
                            <span className="text-xs font-bold font-mono">
                              {start}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#8C6D53] bg-[#FFF9E6] px-2.5 py-0.5 rounded-full font-bold border border-[#F0E2BF]">
                            可預約 (Available)
                          </span>
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
                  placeholder="例如：學校段考時間調整..."
                  className="w-full bg-[#FAF7F2] border border-[#EFECE6] rounded-2xl px-3.5 py-2 text-xs text-[#332C27] focus:outline-none focus:border-[#E88D67]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRescheduleAppointmentId(null)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-[#7A736E] hover:text-[#332C27]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={!selectedSlotId || availableSlots.length === 0}
                  className="px-5 py-2.5 rounded-full bg-[#E88D67] hover:bg-[#D67A53] text-white font-bold text-xs shadow-md shadow-[#E88D67]/20 disabled:opacity-50"
                >
                  送出調課申請
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
