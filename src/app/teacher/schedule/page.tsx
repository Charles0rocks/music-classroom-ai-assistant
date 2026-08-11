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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 warm-card p-6 sm:p-8 rounded-3xl border border-[#EFECE6] shadow-warm bg-gradient-to-r from-white to-[#FAF2EC]">
        <div>
          <div className="flex items-center gap-2 text-[#8C6D53] text-xs font-bold uppercase tracking-wider mb-1">
            <CalendarIcon className="w-4 h-4" />
            Teacher Portal (P1)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332C27]">週課表與可用時段設定</h1>
          <p className="text-[#7A736E] text-xs sm:text-sm mt-1 font-medium">
            下週日 20:00 前開放時段批次管理 · 查看本週學生預約狀況
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-full bg-[#8C6D53] hover:bg-[#765942] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-[#8C6D53]/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          新增開放時段 (Add Slot)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Weekly Slots Management (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#332C27] flex items-center gap-2">
              <span>開放時段設定 (`schedule_slots`)</span>
              <span className="text-xs text-[#7A736E] font-normal">（可一鍵點擊切換開放/關閉）</span>
            </h2>
            <span className="text-xs text-[#8C6D53] bg-[#FAF2EC] px-3 py-1 rounded-full border border-[#E8D4C5] font-bold">
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
                  className={`p-5 rounded-2xl transition-all border flex items-center justify-between ${
                    slot.is_available
                      ? 'warm-card border-[#EFECE6] shadow-warm hover:border-[#8C6D53]/50'
                      : 'bg-[#FAF7F2] border-[#EFECE6] opacity-75'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#8C6D53]">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      {start.dateStr}
                    </div>
                    <div className="text-sm font-bold text-[#332C27] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#7A736E]" />
                      {start.timeStr} - {end.timeStr}
                    </div>
                    <div className="text-[11px] text-[#7A736E]">
                      狀態：
                      {slot.is_available ? (
                        <span className="text-[#3D5240] font-bold bg-[#E3E8E1] px-2 py-0.5 rounded-full ml-1">
                          開放中 (Available)
                        </span>
                      ) : (
                        <span className="text-[#B85536] font-bold bg-[#FCEADE] px-2 py-0.5 rounded-full ml-1">
                          已約滿 / 不開放
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleSlotAvailability(slot.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
                      slot.is_available
                        ? 'bg-[#E3E8E1] text-[#3D5240] border border-[#C5D2C2] hover:bg-[#3D5240] hover:text-white'
                        : 'bg-[#FAF7F2] text-[#7A736E] border border-[#EFECE6] hover:bg-[#EFECE6] hover:text-[#332C27]'
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
          <h2 className="text-lg font-bold text-[#332C27] flex items-center gap-2">
            <span>本週預約學生 (`appointments`)</span>
          </h2>

          <div className="warm-card p-5 rounded-3xl border border-[#EFECE6] space-y-3 shadow-warm">
            {appointments.map((app) => {
              const start = formatDateTime(app.start_time);
              const end = formatDateTime(app.end_time);
              return (
                <div
                  key={app.id}
                  className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#EFECE6] hover:border-[#8C6D53]/40 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#FAF2EC] text-[#8C6D53] flex items-center justify-center font-bold text-xs border border-[#E8D4C5]">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-sm text-[#332C27]">
                        {app.student_name || '學生'}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        app.status === 'confirmed'
                          ? 'bg-[#E3E8E1] text-[#3D5240] border border-[#C5D2C2]'
                          : 'bg-[#FCEADE] text-[#B85536] border border-[#F6D0B8]'
                      }`}
                    >
                      {app.status === 'confirmed' ? '已確認' : '已調課'}
                    </span>
                  </div>

                  <div className="text-xs text-[#7A736E] font-medium flex items-center gap-1.5 pt-1">
                    <Clock className="w-3.5 h-3.5 text-[#8C6D53]" />
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
        <div className="fixed inset-0 z-50 bg-[#332C27]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-3xl border border-[#EFECE6] space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#EFECE6] pb-3">
              <h3 className="font-bold text-lg text-[#332C27] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#8C6D53]" />
                新增開放時段 (Add Slot)
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#7A736E] hover:text-[#332C27]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSlot} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#332C27] mb-1">日期 (Date)</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#EFECE6] rounded-2xl px-3.5 py-2 text-sm text-[#332C27] focus:outline-none focus:border-[#8C6D53]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#332C27] mb-1">開始時間 (Start)</label>
                  <input
                    type="time"
                    required
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EFECE6] rounded-2xl px-3.5 py-2 text-sm text-[#332C27] focus:outline-none focus:border-[#8C6D53]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#332C27] mb-1">結束時間 (End)</label>
                  <input
                    type="time"
                    required
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#EFECE6] rounded-2xl px-3.5 py-2 text-sm text-[#332C27] focus:outline-none focus:border-[#8C6D53]"
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
