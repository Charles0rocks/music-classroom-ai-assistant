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
  CheckCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function TeacherSchedulePage() {
  const {
    scheduleSlots,
    toggleSlotAvailability,
    addScheduleSlot,
    appointments,
    teacherProfile,
  } = useDemoContext();

  const [newDate, setNewDate] = useState('');
  const [newStartTime, setNewStartTime] = useState('14:00');
  const [newEndTime, setNewEndTime] = useState('15:00');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) return;
    const startIso = new Date(`${newDate}T${newStartTime}`).toISOString();
    const endIso = new Date(`${newDate}T${newEndTime}`).toISOString();
    addScheduleSlot(startIso, endIso);
    setShowAddModal(false);
  };

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    const dateStr = d.toLocaleDateString('zh-TW', { weekday: 'short', month: 'numeric', day: 'numeric' });
    const timeStr = d.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false });
    return { dateStr, timeStr };
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 glass-panel p-6 rounded-2xl border border-purple-500/20">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <CalendarIcon className="w-4 h-4" />
            Teacher Portal (P1)
          </div>
          <h1 className="text-2xl font-extrabold text-white">週課表與可用時段設定</h1>
          <p className="text-slate-400 text-xs mt-1">
            下週日 20:00 前開放時段批次管理 · 查看本週學生預約狀況
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          新增開放時段 (Add Slot)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Weekly Slots Management (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>開放時段設定 (`schedule_slots`)</span>
              <span className="text-xs text-slate-400 font-normal">（可一鍵點擊切換開放/關閉）</span>
            </h2>
            <span className="text-xs text-purple-400 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-800">
              共 {scheduleSlots.length} 個時段
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {scheduleSlots.map((slot) => {
              const start = formatDateTime(slot.start_time);
              const end = formatDateTime(slot.end_time);
              return (
                <div
                  key={slot.id}
                  className={`p-4 rounded-xl transition-all border flex items-center justify-between ${
                    slot.is_available
                      ? 'glass-panel border-purple-500/30 hover:border-purple-400'
                      : 'bg-slate-900/60 border-slate-800/80 opacity-70'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      {start.dateStr}
                    </div>
                    <div className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {start.timeStr} - {end.timeStr}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      狀態：
                      {slot.is_available ? (
                        <span className="text-emerald-400 font-medium">開放中 (Available)</span>
                      ) : (
                        <span className="text-amber-400 font-medium">已約滿 / 不開放</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleSlotAvailability(slot.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                      slot.is_available
                        ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50 hover:bg-purple-600 hover:text-white'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {slot.is_available ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> 開放中
                      </>
                    ) : (
                      <>
                        <X className="w-3.5 h-3.5" /> 關閉
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Confirmed Student Appointments */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>本週預約學生 (`appointments`)</span>
          </h2>

          <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
            {appointments.map((app) => {
              const start = formatDateTime(app.start_time);
              const end = formatDateTime(app.end_time);
              return (
                <div
                  key={app.id}
                  className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-purple-500/30 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-sm text-slate-100">
                        {app.student_name || '學生'}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        app.status === 'confirmed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      }`}
                    >
                      {app.status === 'confirmed' ? '已確認' : '已調課'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 font-mono flex items-center gap-1.5 pt-1">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    {start.dateStr} {start.timeStr} - {end.timeStr}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-purple-500/40 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                新增開放時段 (Add Slot)
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSlot} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">日期 (Date)</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">開始時間 (Start)</label>
                  <input
                    type="time"
                    required
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">結束時間 (End)</label>
                  <input
                    type="time"
                    required
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md shadow-purple-600/30"
                >
                  確認新增
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
