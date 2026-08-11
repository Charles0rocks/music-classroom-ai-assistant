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

  const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlotResponse[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Filter student's own appointments (Privacy protection)
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
      // Call API 1: Smart Rescheduling Conflict Checking Endpoint
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
          一週 (週一～週日) × 3大時段 (上午/下午/晚間) 矩陣課表 · 精準展現個人預約與老師開放空檔
        </p>
      </div>

      {/* 7x3 Grid Schedule Matrix Table for Student */}
      <div className="warm-card p-6 sm:p-8 rounded-3xl border border-[#EFECE6] shadow-warm space-y-6 overflow-x-auto">
        <div className="flex items-center justify-between border-b border-[#EFECE6] pb-4">
          <h2 className="text-lg font-bold text-[#332C27] flex items-center gap-2">
            <span>小明同學 7x3 上課週課表矩陣</span>
            <span className="text-xs text-[#7A736E] font-normal">（授課指導：張老師）</span>
          </h2>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-[#B85536]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FCEADE] border border-[#F6D0B8]" /> 我的上課時間
            </span>
            <span className="flex items-center gap-1.5 text-[#3D5240]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E3E8E1] border border-[#C5D2C2]" /> 可申請調課空檔
            </span>
          </div>
        </div>

        {/* 7x3 Matrix Grid Container */}
        <div className="min-w-[900px]">
          {/* Header Row: 7 Days */}
          <div className="grid grid-cols-8 gap-3 mb-3">
            <div className="p-3 font-extrabold text-xs text-[#7A736E] uppercase flex items-center justify-center bg-[#FAF7F2] rounded-2xl border border-[#EFECE6]">
              時段 / 日期
            </div>
            {DAYS.map((day) => (
              <div
                key={day.key}
                className="p-3 text-center bg-[#FCEADE]/40 rounded-2xl border border-[#F6D0B8] space-y-0.5"
              >
                <div className="font-extrabold text-sm text-[#B85536]">{day.label}</div>
                <div className="text-[10px] text-[#7A736E] font-mono">{day.short}</div>
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
                  <BlockIcon className="w-5 h-5 text-[#E88D67]" />
                  <div className="font-extrabold text-xs text-[#332C27]">{block.label}</div>
                  <div className="text-[9px] text-[#7A736E] font-mono">{block.sub}</div>
                </div>

                {/* 7 Day Cells */}
                {DAYS.map((day) => {
                  // Student's appointments in this cell
                  const cellAppointments = myAppointments.filter((app) => {
                    const appDay = getSlotDayOfWeek(app.start_time);
                    const appHour = getSlotHour(app.start_time);
                    return appDay === day.key && isTimeInBlock(appHour, block.key);
                  });

                  // Teacher's available slots in this cell
                  const cellAvailableSlots = scheduleSlots.filter((slot) => {
                    if (!slot.is_available) return false;
                    const slotDay = getSlotDayOfWeek(slot.start_time);
                    const slotHour = getSlotHour(slot.start_time);
                    return slotDay === day.key && isTimeInBlock(slotHour, block.key);
                  });

                  return (
                    <div
                      key={day.key}
                      className="min-h-[115px] p-2.5 bg-[#FAF7F2] rounded-2xl border border-[#EFECE6] flex flex-col justify-between space-y-2 hover:border-[#E88D67]/40 transition-all"
                    >
                      <div className="space-y-1.5">
                        {/* Student's Confirmed Appointments */}
                        {cellAppointments.map((app) => (
                          <div
                            key={app.id}
                            className="p-2 rounded-xl bg-[#FCEADE] border border-[#F6D0B8] space-y-1"
                          >
                            <div className="flex items-center justify-between text-[11px] font-bold text-[#B85536]">
                              <span>🎵 我的課程</span>
                              <span className="font-mono text-[9px]">
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

                        {/* Teacher's Available Slots */}
                        {cellAvailableSlots.map((slot) => (
                          <div
                            key={slot.id}
                            className="p-1.5 rounded-xl bg-[#E3E8E1] border border-[#C5D2C2] text-[10px] font-bold text-[#3D5240] flex items-center justify-between"
                          >
                            <span>🟢 老師開放空檔</span>
                            <span className="font-mono text-[9px]">
                              {formatTimeRange(slot.start_time, slot.end_time)}
                            </span>
                          </div>
                        ))}

                        {cellAppointments.length === 0 && cellAvailableSlots.length === 0 && (
                          <div className="text-[10px] text-[#7A736E] text-center py-4 italic font-medium">
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

      {/* Reschedule Modal (Popup strictly hiding other students' privacy) */}
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

            {/* Privacy Guarantee Alert Banner */}
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
                              ? 'bg-[#FAF2EC] border-[#8C6D53] text-[#332C27] shadow-sm'
                              : 'bg-[#FAF7F2] border-[#EFECE6] text-[#7A736E] hover:border-[#D3C9BE]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Clock className={`w-4 h-4 ${isSelected ? 'text-[#8C6D53]' : 'text-[#7A736E]'}`} />
                            <span className="text-xs font-bold font-mono">
                              {start}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#3D5240] bg-[#E3E8E1] px-2.5 py-0.5 rounded-full font-bold border border-[#C5D2C2]">
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
