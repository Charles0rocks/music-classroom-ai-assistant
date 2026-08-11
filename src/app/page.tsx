'use client';

import React from 'react';
import Link from 'next/link';
import { useDemoContext } from '@/context/DemoContext';
import {
  UserCheck,
  Sparkles,
  Calendar,
  Mic,
  Video,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Music,
} from 'lucide-react';

export default function RoleSelectorPage() {
  const { currentRole, switchRole, teacherProfile, studentProfile } = useDemoContext();

  return (
    <div className="space-y-8 py-4">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl warm-card p-8 sm:p-10 border border-[#EFECE6] shadow-warm bg-gradient-to-br from-[#FDFBF7] via-white to-[#FAF2EC]">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#E88D67]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-[#8C6D53]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF2EC] border border-[#E8D4C5] text-[#8C6D53] text-xs font-bold">
            <Heart className="w-3.5 h-3.5 fill-[#E88D67] text-[#E88D67]" />
            溫暖柔和風格 AI 音樂教學輔助系統 MVP
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#332C27] leading-tight">
            歡迎使用 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8C6D53] via-[#B85536] to-[#E88D67]">Harmonix AI Studio</span>
          </h1>
          <p className="text-[#7A736E] text-sm sm:text-base leading-relaxed font-medium">
            專為溫暖音樂教室打造的雙端 AI 夥伴。提供語音情緒過濾淨化卡片、智慧無衝突排課與 AI 雙影片逐影格姿態分析。
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-[#7A736E]">
            <span className="flex items-center gap-1.5 bg-[#FAF7F2] px-3.5 py-1.5 rounded-full border border-[#EFECE6]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4A5D4E]" /> Next.js App Router
            </span>
            <span className="flex items-center gap-1.5 bg-[#FAF7F2] px-3.5 py-1.5 rounded-full border border-[#EFECE6]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4A5D4E]" /> Supabase RLS 隱私保護
            </span>
            <span className="flex items-center gap-1.5 bg-[#FAF7F2] px-3.5 py-1.5 rounded-full border border-[#EFECE6]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4A5D4E]" /> LLM 溫暖情緒淨化器
            </span>
          </div>
        </div>
      </div>

      {/* Role Selection Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#332C27] flex items-center gap-2">
          <span>請選擇 Demo 體驗視角 (Role Selector)</span>
          <span className="text-xs font-normal text-[#7A736E]">（點擊切換當前模擬視角）</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Teacher Role Card */}
          <div
            onClick={() => switchRole('teacher')}
            className={`cursor-pointer rounded-3xl p-6 transition-all border ${
              currentRole === 'teacher'
                ? 'bg-[#FAF2EC] border-[#8C6D53] shadow-warm-hover ring-2 ring-[#8C6D53]/30'
                : 'warm-card-interactive border-[#EFECE6]'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#8C6D53]/15 border border-[#8C6D53]/30 flex items-center justify-center text-[#8C6D53]">
                  <UserCheck className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-[#332C27]">張老師 (Teacher Mode)</h3>
                    {currentRole === 'teacher' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#8C6D53] text-white text-[10px] font-bold">
                        當前視角
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#8C6D53] font-bold mt-0.5">{teacherProfile.instrument}</p>
                </div>
              </div>
            </div>

            <p className="text-[#7A736E] text-xs mt-4 leading-relaxed font-medium">
              老師端入口：輕鬆勾選開放時段、使用課堂語音進行 Whisper STT + LLM 課後情緒淨化筆記，並可管理個人教學示範影片庫。
            </p>

            <div className="mt-6 pt-4 border-t border-[#EFECE6] grid grid-cols-3 gap-2.5">
              <Link
                href="/teacher/schedule"
                className="flex flex-col items-center p-3 rounded-2xl bg-white hover:bg-[#FAF2EC] border border-[#EFECE6] text-center transition-all group shadow-sm"
              >
                <Calendar className="w-4 h-4 text-[#8C6D53] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#332C27]">P1 週課表</span>
              </Link>
              <Link
                href="/teacher/recorder"
                className="flex flex-col items-center p-3 rounded-2xl bg-white hover:bg-[#FAF2EC] border border-[#EFECE6] text-center transition-all group shadow-sm"
              >
                <Mic className="w-4 h-4 text-[#8C6D53] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#332C27]">P2 課堂錄音</span>
              </Link>
              <Link
                href="/teacher/demos"
                className="flex flex-col items-center p-3 rounded-2xl bg-white hover:bg-[#FAF2EC] border border-[#EFECE6] text-center transition-all group shadow-sm"
              >
                <Video className="w-4 h-4 text-[#8C6D53] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#332C27]">P7 範例影片</span>
              </Link>
            </div>
          </div>

          {/* Student Role Card */}
          <div
            onClick={() => switchRole('student')}
            className={`cursor-pointer rounded-3xl p-6 transition-all border ${
              currentRole === 'student'
                ? 'bg-[#FCEADE] border-[#E88D67] shadow-warm-hover ring-2 ring-[#E88D67]/30'
                : 'warm-card-interactive border-[#EFECE6]'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#E88D67]/15 border border-[#E88D67]/30 flex items-center justify-center text-[#E88D67]">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-[#332C27]">小明 (Student Mode)</h3>
                    {currentRole === 'student' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#E88D67] text-white text-[10px] font-bold">
                        當前視角
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#B85536] font-bold mt-0.5">小提琴進階班學生</p>
                </div>
              </div>
            </div>

            <p className="text-[#7A736E] text-xs mt-4 leading-relaxed font-medium">
              學生端入口：檢視個人課表與安全智慧調課、檢視 AI 淨化後的實體紙質感學習筆記卡片，並上傳練習影片進行雙畫面 AI 比對。
            </p>

            <div className="mt-6 pt-4 border-t border-[#EFECE6] grid grid-cols-4 gap-2">
              <Link
                href="/student/schedule"
                className="flex flex-col items-center p-2.5 rounded-2xl bg-white hover:bg-[#FCEADE] border border-[#EFECE6] text-center transition-all group shadow-sm"
              >
                <Calendar className="w-4 h-4 text-[#E88D67] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#332C27]">P3 智慧調課</span>
              </Link>
              <Link
                href="/student/practice"
                className="flex flex-col items-center p-2.5 rounded-2xl bg-white hover:bg-[#FCEADE] border border-[#EFECE6] text-center transition-all group shadow-sm"
              >
                <BookOpen className="w-4 h-4 text-[#E88D67] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#332C27]">P4 作業中心</span>
              </Link>
              <Link
                href="/student/summary/lesson-1"
                className="flex flex-col items-center p-2.5 rounded-2xl bg-white hover:bg-[#FCEADE] border border-[#EFECE6] text-center transition-all group shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-[#E88D67] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#332C27]">P5 AI筆記</span>
              </Link>
              <Link
                href="/student/compare/practice-1"
                className="flex flex-col items-center p-2.5 rounded-2xl bg-white hover:bg-[#FCEADE] border border-[#EFECE6] text-center transition-all group shadow-sm"
              >
                <Video className="w-4 h-4 text-[#E88D67] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-[#332C27]">P6 雙圖比對</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Showcase Grid */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-bold text-[#332C27]">三大核心 Demo 功能導覽</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="warm-card p-6 rounded-3xl border border-[#EFECE6] space-y-3 shadow-warm">
            <div className="w-9 h-9 rounded-2xl bg-[#E3E8E1] text-[#3D5240] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#332C27] text-base">1. 智慧調課與嚴格隱私保護</h3>
            <p className="text-xs text-[#7A736E] leading-relaxed font-medium">
              學生申請調課時，演算法比對老師開放的 `schedule_slots` 並自動過濾已佔用時間，完全隱藏其他學生身份與隱私。
            </p>
            <Link
              href="/student/schedule"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#8C6D53] hover:text-[#765942]"
            >
              試試智慧調課彈窗 <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="warm-card p-6 rounded-3xl border border-[#EFECE6] space-y-3 shadow-warm">
            <div className="w-9 h-9 rounded-2xl bg-[#FAF2EC] text-[#8C6D53] flex items-center justify-center font-bold">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#332C27] text-base">2. 課堂錄音 STT 與溫暖淨化</h3>
            <p className="text-xs text-[#7A736E] leading-relaxed font-medium">
              錄音轉譯後自動調用 LLM，過濾情緒批評與雜談，精準萃取「技術修正、樂理重點與 BPM 建議」並生成紙質感卡片。
            </p>
            <Link
              href="/teacher/recorder"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#8C6D53] hover:text-[#765942]"
            >
              體驗 AI 錄音淨化 <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="warm-card p-6 rounded-3xl border border-[#EFECE6] space-y-3 shadow-warm">
            <div className="w-9 h-9 rounded-2xl bg-[#FCEADE] text-[#B85536] flex items-center justify-center font-bold">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#332C27] text-base">3. 學生 vs 老師 AI 雙影片比對</h3>
            <p className="text-xs text-[#7A736E] leading-relaxed font-medium">
              左右同步播放學生練習與老師範例影片，下方互動時間軸精準標註錯音、搶拍與手位問題，並給出 AI 個別改善建議。
            </p>
            <Link
              href="/student/compare/practice-1"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#E88D67] hover:text-[#D67A53]"
            >
              查看影片比對分析 <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
