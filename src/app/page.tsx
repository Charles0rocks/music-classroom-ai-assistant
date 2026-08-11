'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDemoContext } from '@/context/DemoContext';
import { DemoGuideModal } from '@/components/DemoGuideModal';
import { Role } from '@/types';
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
  Lock,
  Mail,
  Key,
  AlertCircle,
  HelpCircle,
  Music,
  Heart,
} from 'lucide-react';

export default function RoleSelectorPage() {
  const router = useRouter();
  const { currentRole, isAuthenticated, login, logout, teacherProfile, currentUser } = useDemoContext();

  const [activeTab, setActiveTab] = useState<Role>('student'); // Default student login selection
  const [email, setEmail] = useState('ming.student@harmony.edu');
  const [password, setPassword] = useState('student123');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showGuideModal, setShowGuideModal] = useState(false);

  const handleTabChange = (role: Role) => {
    setActiveTab(role);
    setErrorMsg('');
    setSuccessMsg('');
    if (role === 'teacher') {
      setEmail('chang.teacher@harmony.edu');
      setPassword('teacher123');
    } else {
      setEmail('ming.student@harmony.edu');
      setPassword('student123');
    }
  };

  const handleQuickFill = (role: Role) => {
    handleTabChange(role);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const res = login(email, password, activeTab);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        if (activeTab === 'student') {
          router.push('/student/schedule');
        } else {
          router.push('/teacher/schedule');
        }
      }, 600);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="space-[#332C27] space-y-8 py-2">
      {/* Greeting Banner & App Introduction Section */}
      <div className="relative overflow-hidden rounded-3xl warm-card p-8 sm:p-10 border border-[#EFECE6] shadow-warm bg-gradient-to-br from-[#FDFBF7] via-white to-[#FAF2EC]">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#E88D67]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-[#8C6D53]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF2EC] border border-[#E8D4C5] text-[#8C6D53] text-xs font-bold">
              <Heart className="w-3.5 h-3.5 fill-[#E88D67] text-[#E88D67]" />
              溫暖音樂教室 AI 夥伴 · 系統簡介與登入
            </div>

            <button
              onClick={() => setShowGuideModal(true)}
              className="px-4 py-1.5 rounded-full bg-white hover:bg-[#FAF2EC] text-[#8C6D53] border border-[#E8D4C5] text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            >
              <HelpCircle className="w-4 h-4 text-[#8C6D53]" />
              💡 Demo 測試帳密與系統說明
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#332C27] leading-tight">
            🎵 歡迎來到 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8C6D53] via-[#B85536] to-[#E88D67]">Harmonix AI Studio</span>
          </h1>

          <p className="text-[#7A736E] text-sm sm:text-base leading-relaxed font-medium">
            專為溫暖現代音樂教室打造的雙端 AI 助手。整合「師生排課系統與智慧調課」、「 Whisper 課堂錄音 STT + LLM 溫暖情緒過濾筆記」與「學生 vs 老師 AI 雙影片逐影格姿態/音高比對」。請選擇您的身份並輸入帳號密碼登入，探索全方位的 AI 音樂教學體驗！
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-[#7A736E]">
            <span className="flex items-center gap-1.5 bg-[#FAF7F2] px-3.5 py-1.5 rounded-full border border-[#EFECE6]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3D5240]" /> 師生排課系統
            </span>
            <span className="flex items-center gap-1.5 bg-[#FAF7F2] px-3.5 py-1.5 rounded-full border border-[#EFECE6]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3D5240]" /> 課堂紀錄與筆記
            </span>
            <span className="flex items-center gap-1.5 bg-[#FAF7F2] px-3.5 py-1.5 rounded-full border border-[#EFECE6]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3D5240]" /> 課後作業驗收與專家建議
            </span>
          </div>
        </div>
      </div>

      {/* Main Container: Default Identity Selector & Dedicated Login Card */}
      {!isAuthenticated ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Dedicated Login Form Card (7 cols) */}
          <div className="lg:col-span-7 bg-[#FFFDF9] rounded-3xl border border-[#EADFC9] border-l-8 border-l-[#8C6D53] shadow-[0_10px_35px_rgba(140,109,83,0.12)] p-6 sm:p-10 space-y-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F2E8D8] text-[#785338] text-xs font-bold border border-[#EADFC9]">
                <Lock className="w-3.5 h-3.5 text-[#8C6D53]" /> 預設身分選擇與帳密登入
              </div>
              <h2 className="text-2xl font-extrabold text-[#332C27]">
                請選擇登入身分
              </h2>
              <p className="text-xs text-[#7A736E] font-medium">
                點擊選擇「學生」或「老師」頁籤，輸入帳密登入專屬 Portal
              </p>
            </div>

            {/* Role Select Tabs */}
            <div className="grid grid-cols-2 gap-2.5 bg-[#FAF7F2] p-2 rounded-2xl border border-[#EFECE6]">
              <button
                type="button"
                onClick={() => handleTabChange('student')}
                className={`py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'student'
                    ? 'bg-[#E88D67] text-white shadow-sm scale-100'
                    : 'text-[#7A736E] hover:text-[#332C27]'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                🎓 我是學生 (Student)
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('teacher')}
                className={`py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'teacher'
                    ? 'bg-[#8C6D53] text-white shadow-sm scale-100'
                    : 'text-[#7A736E] hover:text-[#332C27]'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                👨‍🏫 我是老師 (Teacher)
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-[#FCEADE] border border-[#F6D0B8] text-xs font-bold text-[#B85536] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-2xl bg-[#E3E8E1] border border-[#C5D2C2] text-xs font-bold text-[#3D5240] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {successMsg}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#332C27] mb-1.5">
                  帳號 (Email Address)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#7A736E] absolute left-4 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="請輸入 Email 帳號"
                    className="w-full bg-[#FAF7F2] border border-[#EFECE6] rounded-2xl pl-11 pr-4 py-3 text-xs text-[#332C27] font-mono focus:outline-none focus:border-[#8C6D53]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#332C27] mb-1.5">
                  密碼 (Password)
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-[#7A736E] absolute left-4 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="請輸入密碼"
                    className="w-full bg-[#FAF7F2] border border-[#EFECE6] rounded-2xl pl-11 pr-4 py-3 text-xs text-[#332C27] font-mono focus:outline-none focus:border-[#8C6D53]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full py-3.5 rounded-full text-white font-bold text-xs shadow-md transition-all ${
                    activeTab === 'teacher'
                      ? 'bg-[#8C6D53] hover:bg-[#765942] shadow-[#8C6D53]/20'
                      : 'bg-[#E88D67] hover:bg-[#D67A53] shadow-[#E88D67]/20'
                  }`}
                >
                  登入系統 (Log In to Portal)
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Demo Notes & Quick Credentials Helper Card (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="warm-card p-6 rounded-3xl border border-[#EFECE6] shadow-warm space-y-4">
              <h3 className="font-bold text-sm text-[#332C27] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8C6D53]" />
                Demo 測試備註與一鍵帶入 (Quick Fill)
              </h3>
              <p className="text-xs text-[#7A736E] leading-relaxed font-medium">
                您可直接點擊下方按鈕帶入測試帳號密碼，快速體驗老師或學生端 Portal：
              </p>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-2xl bg-[#FCEADE] border border-[#F6D0B8] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#B85536]">小明 (Student)</span>
                    <span className="text-[10px] text-[#7A736E] font-mono">ming.student@harmony.edu</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('student')}
                    className="w-full py-2 rounded-full bg-[#E88D67] hover:bg-[#D67A53] text-white text-xs font-bold shadow-xs transition-all"
                  >
                    帶入小明帳密 (student123)
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF2EC] border border-[#E8D4C5] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#8C6D53]">張老師 (Teacher)</span>
                    <span className="text-[10px] text-[#7A736E] font-mono">chang.teacher@harmony.edu</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('teacher')}
                    className="w-full py-2 rounded-full bg-[#8C6D53] hover:bg-[#765942] text-white text-xs font-bold shadow-xs transition-all"
                  >
                    帶入張老師帳密 (teacher123)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Authenticated Welcome Dashboard */
        <div className="space-y-6">
          <div className="warm-card p-8 rounded-3xl border border-[#EFECE6] shadow-warm space-y-4 bg-gradient-to-r from-white to-[#FAF2EC]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar_url}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-full border-2 border-[#EFECE6] object-cover"
                />
                <div>
                  <h2 className="text-2xl font-extrabold text-[#332C27]">
                    歡迎回來，{currentUser.name}！
                  </h2>
                  <span className="text-xs text-[#8C6D53] font-bold">
                    {currentRole === 'teacher' ? '張老師教學 Portal' : '小明學習 Portal'} 已成功登入
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                className="px-4 py-2 rounded-full bg-[#FAF7F2] hover:bg-[#EFECE6] text-[#7A736E] text-xs font-bold border border-[#EFECE6]"
              >
                登出帳號
              </button>
            </div>

            <p className="text-xs text-[#7A736E] font-medium leading-relaxed">
              您已登入 Harmonix AI Studio。請點擊下方快捷按鈕進入功能頁面：
            </p>

            {currentRole === 'teacher' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <Link
                  href="/teacher/schedule"
                  className="p-4 rounded-2xl bg-white hover:bg-[#FAF2EC] border border-[#EFECE6] flex items-center gap-3 font-bold text-xs text-[#332C27] shadow-sm transition-all"
                >
                  <Calendar className="w-5 h-5 text-[#8C6D53]" />
                  P1 7x3週課表矩陣
                </Link>
                <Link
                  href="/teacher/recorder"
                  className="p-4 rounded-2xl bg-white hover:bg-[#FAF2EC] border border-[#EFECE6] flex items-center gap-3 font-bold text-xs text-[#332C27] shadow-sm transition-all"
                >
                  <Mic className="w-5 h-5 text-[#8C6D53]" />
                  P2 課堂錄音 AI 淨化
                </Link>
                <Link
                  href="/teacher/demos"
                  className="p-4 rounded-2xl bg-white hover:bg-[#FAF2EC] border border-[#EFECE6] flex items-center gap-3 font-bold text-xs text-[#332C27] shadow-sm transition-all"
                >
                  <Video className="w-5 h-5 text-[#8C6D53]" />
                  P7 範例影片庫微調
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <Link
                  href="/student/schedule"
                  className="p-3.5 rounded-2xl bg-white hover:bg-[#FCEADE] border border-[#EFECE6] flex flex-col items-center text-center font-bold text-xs text-[#332C27] shadow-sm transition-all space-y-1"
                >
                  <Calendar className="w-5 h-5 text-[#E88D67]" />
                  <span>P3 7x3 智慧調課矩陣</span>
                </Link>
                <Link
                  href="/student/practice"
                  className="p-3.5 rounded-2xl bg-white hover:bg-[#FCEADE] border border-[#EFECE6] flex flex-col items-center text-center font-bold text-xs text-[#332C27] shadow-sm transition-all space-y-1"
                >
                  <BookOpen className="w-5 h-5 text-[#E88D67]" />
                  <span>P4 作業學習中心</span>
                </Link>
                <Link
                  href="/student/summary/lesson-1"
                  className="p-3.5 rounded-2xl bg-white hover:bg-[#FCEADE] border border-[#EFECE6] flex flex-col items-center text-center font-bold text-xs text-[#332C27] shadow-sm transition-all space-y-1"
                >
                  <Sparkles className="w-5 h-5 text-[#E88D67]" />
                  <span>P5 AI紙質筆記</span>
                </Link>
                <Link
                  href="/student/compare/practice-1"
                  className="p-3.5 rounded-2xl bg-white hover:bg-[#FCEADE] border border-[#EFECE6] flex flex-col items-center text-center font-bold text-xs text-[#332C27] shadow-sm transition-all space-y-1"
                >
                  <Video className="w-5 h-5 text-[#E88D67]" />
                  <span>P6 雙圖比對</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Demo Guide Modal Triggered by Button */}
      <DemoGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        onQuickFill={(role) => {
          handleQuickFill(role);
          login(role === 'teacher' ? 'chang.teacher@harmony.edu' : 'ming.student@harmony.edu', role === 'teacher' ? 'teacher123' : 'student123', role);
        }}
      />
    </div>
  );
}
