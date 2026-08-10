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
  Zap,
} from 'lucide-react';

export default function RoleSelectorPage() {
  const { currentRole, switchRole, teacherProfile, studentProfile } = useDemoContext();

  return (
    <div className="space-y-8 py-4">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-8 sm:p-10 border border-purple-500/20 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-medium">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            AI-Powered Music Academy System MVP
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            歡迎使用 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300">Harmonix AI Studio</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            專為音樂教室打造的智慧雙端小幫手。整合課堂 STT 語音過濾淨化、智慧衝突調課演算法與 AI 雙影片逐影格姿態/音高比對。
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Next.js App Router
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Supabase RLS Protected
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> LLM Emotion Cleanser
            </span>
          </div>
        </div>
      </div>

      {/* Role Selection Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <span>請選擇 Demo 體驗角色 (Role Selector)</span>
          <span className="text-xs font-normal text-slate-400">（點擊切換當前模擬視角）</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Teacher Role Card */}
          <div
            onClick={() => switchRole('teacher')}
            className={`cursor-pointer rounded-2xl p-6 transition-all border ${
              currentRole === 'teacher'
                ? 'bg-purple-950/40 border-purple-500/80 shadow-xl shadow-purple-500/10 ring-2 ring-purple-500/40'
                : 'glass-panel-interactive border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <UserCheck className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">張老師 (Teacher Mode)</h3>
                    {currentRole === 'teacher' && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/50 text-purple-300 text-[10px] font-bold">
                        當前選擇
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-purple-300/80 font-medium">{teacherProfile.instrument}</p>
                </div>
              </div>
            </div>

            <p className="text-slate-300 text-xs mt-4 leading-relaxed">
              老師端入口：輕鬆勾選開放時段、使用課堂語音錄影進行 Whisper STT + AI 課後摘要淨化，並可管理個人教學示範影片庫。
            </p>

            <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2">
              <Link
                href="/teacher/schedule"
                className="flex flex-col items-center p-2.5 rounded-xl bg-slate-900/60 hover:bg-purple-900/40 border border-slate-800 text-center transition-all group"
              >
                <Calendar className="w-4 h-4 text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold text-slate-200">P1 週課表</span>
              </Link>
              <Link
                href="/teacher/recorder"
                className="flex flex-col items-center p-2.5 rounded-xl bg-slate-900/60 hover:bg-purple-900/40 border border-slate-800 text-center transition-all group"
              >
                <Mic className="w-4 h-4 text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold text-slate-200">P2 課堂錄音</span>
              </Link>
              <Link
                href="/teacher/demos"
                className="flex flex-col items-center p-2.5 rounded-xl bg-slate-900/60 hover:bg-purple-900/40 border border-slate-800 text-center transition-all group"
              >
                <Video className="w-4 h-4 text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold text-slate-200">P7 範例影片</span>
              </Link>
            </div>
          </div>

          {/* Student Role Card */}
          <div
            onClick={() => switchRole('student')}
            className={`cursor-pointer rounded-2xl p-6 transition-all border ${
              currentRole === 'student'
                ? 'bg-cyan-950/40 border-cyan-500/80 shadow-xl shadow-cyan-500/10 ring-2 ring-cyan-500/40'
                : 'glass-panel-interactive border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">小明 (Student Mode)</h3>
                    {currentRole === 'student' && (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-[10px] font-bold">
                        當前選擇
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-cyan-300/80 font-medium">小提琴進階班學生</p>
                </div>
              </div>
            </div>

            <p className="text-slate-300 text-xs mt-4 leading-relaxed">
              學生端入口：檢視個人課表與安全智慧申請調課、檢視經過 AI 淨化後的精美課堂筆記卡片，並上傳練習影片與老師範例進行 AI 雙畫面比對。
            </p>

            <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-4 gap-2">
              <Link
                href="/student/schedule"
                className="flex flex-col items-center p-2 rounded-xl bg-slate-900/60 hover:bg-cyan-900/40 border border-slate-800 text-center transition-all group"
              >
                <Calendar className="w-4 h-4 text-cyan-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold text-slate-200">P3 智慧調課</span>
              </Link>
              <Link
                href="/student/practice"
                className="flex flex-col items-center p-2 rounded-xl bg-slate-900/60 hover:bg-cyan-900/40 border border-slate-800 text-center transition-all group"
              >
                <BookOpen className="w-4 h-4 text-cyan-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold text-slate-200">P4 作業中心</span>
              </Link>
              <Link
                href="/student/summary/lesson-1"
                className="flex flex-col items-center p-2 rounded-xl bg-slate-900/60 hover:bg-cyan-900/40 border border-slate-800 text-center transition-all group"
              >
                <Sparkles className="w-4 h-4 text-cyan-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold text-slate-200">P5 AI筆記</span>
              </Link>
              <Link
                href="/student/compare/practice-1"
                className="flex flex-col items-center p-2 rounded-xl bg-slate-900/60 hover:bg-cyan-900/40 border border-slate-800 text-center transition-all group"
              >
                <Video className="w-4 h-4 text-cyan-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold text-slate-200">P6 雙圖比對</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Showcase Grid */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-bold text-slate-100">三大核心 Demo 功能導覽</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-100">1. 智慧調課與嚴格隱私保護</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              學生申請調課時，演算法自動比對老師開放的 `schedule_slots` 並排除已被其他人 Occupied 的時間，完全隱藏其他學生身份與課表細節。
            </p>
            <Link
              href="/student/schedule"
              className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
            >
              試試智慧調課彈窗 <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-100">2. 課堂錄音 STT 與 LLM 淨化</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              錄音轉譯後自動調用 LLM，過濾情緒化批評與私生活閒聊，精準萃取「技術修正、樂理重點與 BPM 建議」並生成精美卡片。
            </p>
            <Link
              href="/teacher/recorder"
              className="inline-flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300"
            >
              體驗 AI 錄音淨化 <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-100">3. 學生 vs 老師 AI 雙影片比對</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              左右同步播放學生練習與老師範例影片，下方互動時間軸精準標註錯音、搶拍與手位問題，並給出 AI 個別改善建議。
            </p>
            <Link
              href="/student/compare/practice-1"
              className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
            >
              查看影片比對分析 <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
