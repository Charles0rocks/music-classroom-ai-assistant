'use client';

import React from 'react';
import {
  Sparkles,
  X,
  UserCheck,
  ShieldCheck,
  Mic,
  Video,
  CheckCircle2,
  Heart,
  Key,
} from 'lucide-react';

interface DemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickFill: (role: 'teacher' | 'student') => void;
}

export const DemoGuideModal: React.FC<DemoGuideModalProps> = ({
  isOpen,
  onClose,
  onQuickFill,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#332C27]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FFFDF9] w-full max-w-xl p-6 sm:p-8 rounded-3xl border border-[#EADFC9] border-l-8 border-l-[#8C6D53] shadow-[0_10px_35px_rgba(140,109,83,0.18)] space-y-6 animate-in fade-in zoom-in-95 duration-150 relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-[#7A736E] hover:text-[#332C27]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F2E8D8] text-[#785338] text-xs font-bold border border-[#EADFC9]">
            <Sparkles className="w-3.5 h-3.5 text-[#E88D67]" />
            MusiMate - Demo 測試與系統說明
          </div>
          <h2 className="text-2xl font-extrabold text-[#332C27]">
            Demo 測試帳號與系統說明
          </h2>
        </div>

        {/* Demo 測試備註與一鍵帶入 (Quick Fill) - Exact Image 1 Card */}
        <div className="warm-card p-6 rounded-3xl border border-[#EFECE6] shadow-warm space-y-4 bg-white">
          <h3 className="font-bold text-sm text-[#332C27] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8C6D53]" />
            Demo 測試備註與一鍵帶入 (Quick Fill)
          </h3>
          <p className="text-xs text-[#7A736E] leading-relaxed font-medium">
            您可直接點擊下方按鈕帶入測試帳號密碼，快速體驗老師或學生端 Portal：
          </p>

          <div className="space-y-3">
            {/* Student Box (小明) */}
            <div className="p-4 rounded-2xl bg-[#FCEADE] border border-[#F6D0B8] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#B85536]">小明 (Student)</span>
                <span className="text-[11px] text-[#7A736E] font-mono">ming.student@harmony.edu</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onQuickFill('student');
                  onClose();
                }}
                className="w-full py-2.5 rounded-full bg-[#E88D67] hover:bg-[#D67A53] text-white text-xs font-bold shadow-xs transition-all"
              >
                帶入小明帳密 (student123)
              </button>
            </div>

            {/* Teacher Box (張老師) */}
            <div className="p-4 rounded-2xl bg-[#FAF2EC] border border-[#E8D4C5] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#8C6D53]">張老師 (Teacher)</span>
                <span className="text-[11px] text-[#7A736E] font-mono">chang.teacher@harmony.edu</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onQuickFill('teacher');
                  onClose();
                }}
                className="w-full py-2.5 rounded-full bg-[#8C6D53] hover:bg-[#765942] text-white text-xs font-bold shadow-xs transition-all"
              >
                帶入張老師帳密 (teacher123)
              </button>
            </div>
          </div>
        </div>

        {/* 3 Core Features Brief */}
        <div className="space-y-2 text-xs text-[#332C27] pt-1">
          <h3 className="font-bold text-sm text-[#332C27] border-b border-[#EFECE6] pb-1">
            三大核心 MVP 展示功能
          </h3>

          <div className="space-y-2 pt-1 font-medium text-[#7A736E]">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#3D5240] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#332C27]">1. 智慧調課演算法與 24h 禁調保護：</strong> 比對開放空檔，彈出舊課程選擇視窗並自動釋放舊時段。
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Mic className="w-4 h-4 text-[#8C6D53] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#332C27]">2. Whisper STT + LLM 溫暖情緒過濾：</strong> 將口語與私生活閒聊（如帶貓看醫生）過濾，產出格式化筆記。
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Video className="w-4 h-4 text-[#E88D67] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#332C27]">3. 課後作業驗收與專家建議：</strong> 同步雙片播放器，逐影格標註姿勢偏差與音高誤差。
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
