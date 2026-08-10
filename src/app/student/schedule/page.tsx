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
} from 'lucide-react';
import { AvailableSlotResponse } from '@/types';

export default function StudentSchedulePage() {
  const { appointments, studentProfile, teacherProfile, requestReschedule } = useDemoContext();

  const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlotResponse[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Filter student's own appointments (Privacy filter)
  const myAppointments = appointments.filter((app) => app.student_id === studentProfile.id);

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    const dateStr = d.toLocaleDateString('zh-TW', { weekday: 'short', month: 'numeric', day: 'numeric' });
    const timeStr = d.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false });
    return { dateStr, timeStr };
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
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <CalendarIcon className="w-4 h-4" />
          Student Portal (P3)
        </div>
        <h1 className="text-2xl font-extrabold text-white">個人課表與智慧隱私調課</h1>
        <p className="text-slate-400 text-xs mt-1">
          檢視個人預約 · 點擊申請調課彈窗：只顯示空檔且絕不洩漏其他學生隱私資訊
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: My Confirmed Appointments (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>我的課程表 (`appointments`)</span>
            </h2>
            <span className="text-xs text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800">
              授課老師：{teacherProfile.instrument} 張老師
            </span>
          </div>

          <div className="space-y-4">
            {myAppointments.map((app) => {
              const start = formatDateTime(app.start_time);
              const end = formatDateTime(app.end_time);
              return (
                <div
                  key={app.id}
                  className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                        {app.status === 'rescheduled' ? '已調整時段' : '正次預約'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">ID: {app.id}</span>
                    </div>

                    <div className="text-base font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      {start.dateStr} {start.timeStr} - {end.timeStr}
                    </div>

                    <div className="text-xs text-slate-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      授課指導：張老師 ({teacherProfile.instrument})
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenRescheduleModal(app.id)}
                    className="px-4 py-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white font-semibold text-xs border border-cyan-500/40 flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                    申請智慧調課 (Reschedule)
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Privacy Protection Card */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-100">智慧隱私保護機制</h2>
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">RLS + 衝突演算法保護</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              系統在查詢可調課時間時，會自動：
            </p>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                1. 僅拉取老師標註為開放 (`is_available = true`) 的時間。
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                2. 剔除任何與其他人重複的時段。
              </li>
              <li className="flex items-start gap-2">
                <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                3. 嚴格遮蔽其他學生的姓名、頭像與個別預約時間。
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Reschedule Modal (Popup strictly hiding other students' privacy) */}
      {rescheduleAppointmentId && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border border-cyan-500/40 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-base text-white">智慧調課申請 (Smart Reschedule)</h3>
              </div>
              <button
                onClick={() => setRescheduleAppointmentId(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Privacy Guarantee Alert Banner */}
            <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/40 flex items-center gap-2.5 text-xs text-indigo-200">
              <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
              <span>隱私保護已啟用：僅呈現張老師開放且無衝突之空檔，保護他人隱私。</span>
            </div>

            {feedbackMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  feedbackMsg.success
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
                    : 'bg-rose-950/80 text-rose-300 border border-rose-500/50'
                }`}
              >
                {feedbackMsg.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {feedbackMsg.text}
              </div>
            )}

            <form onSubmit={handleSubmitReschedule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  選擇目標開放空檔 (`schedule_slots`)
                </label>

                {isLoadingSlots ? (
                  <div className="py-8 text-center text-xs text-slate-400 animate-pulse">
                    正在演算法比對無衝突時段...
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="py-6 text-center text-xs text-amber-400 bg-amber-950/40 rounded-xl border border-amber-800">
                    目前老師暫無可供調課的開放空檔，請聯絡老師新增開放時間。
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {availableSlots.map((slot) => {
                      const start = formatDateTime(slot.start_time);
                      const end = formatDateTime(slot.end_time);
                      const isSelected = selectedSlotId === slot.slot_id;
                      return (
                        <div
                          key={slot.slot_id}
                          onClick={() => setSelectedSlotId(slot.slot_id)}
                          className={`p-3 rounded-xl cursor-pointer transition-all border flex items-center justify-between ${
                            isSelected
                              ? 'bg-cyan-950/80 border-cyan-500 text-white shadow-md'
                              : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Clock className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                            <span className="text-xs font-bold font-mono">
                              {start.dateStr} {start.timeStr} - {end.timeStr}
                            </span>
                          </div>
                          <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-semibold">
                            可預約 (Available)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">調課原因 (選填)</label>
                <textarea
                  rows={2}
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  placeholder="例如：學校段考時間調整..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRescheduleAppointmentId(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={!selectedSlotId || availableSlots.length === 0}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 disabled:opacity-50"
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
